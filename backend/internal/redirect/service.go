package redirect

import (
	"context"
	"errors"
	"time"
	"strings"

	"github.com/jackc/pgx/v5/pgtype"
	"github.com/redis/go-redis/v9"
	"go.uber.org/zap"

	"github.com/AtharvaKatiyar/rift/internal/cache"
	db "github.com/AtharvaKatiyar/rift/internal/database/sqlc"
	"github.com/AtharvaKatiyar/rift/internal/logger"
	"github.com/AtharvaKatiyar/rift/internal/utils"
)

type Service struct {
	Queries *db.Queries
	Redis   *redis.Client
}

func buildCacheKey(
	username string,
	slug string,
	key string,
) string {
	return strings.Join(
		[]string{
			username,
			slug,
			key,
		},
		":",
	)
}

func (s *Service) ResolveRedirect(
	ctx context.Context,
	username string,
	slug string,
	key string,
) (string, error) {

	cacheKey := buildCacheKey(
		username,
		slug,
		key,
	)

	// Try cache first
	if url, found, err := s.resolveFromCache(
		ctx,
		cacheKey,
		username,
		slug,
	); found || err != nil {
		return url, err
	}

	// DB fallback
	link, err := s.Queries.GetLinkForRedirect(
		ctx,
		key,
	)
	if err != nil {
		return "", errors.New("link not found")
	}

	if err := validateLink(
		link.Username,
		link.Slug,
		link.IsActive,
		username,
		slug,
	); err != nil {
		return "", err
	}

	s.cacheRedirect(ctx, cacheKey, link)
	s.incrementClickCount(link.ID)

	return link.TargetUrl, nil
}

func (s *Service) resolveFromCache(
	ctx context.Context,
	cacheKey string,
	username string,
	slug string,
) (string, bool, error) {

	cachedData, err := cache.GetRedirect(
		ctx,
		s.Redis,
		cacheKey,
	)

	if err == nil {
		if err := validateLink(
			cachedData.Username,
			cachedData.Slug,
			cachedData.IsActive,
			username,
			slug,
		); err != nil {
			return "", true, err
		}

		linkID, err := utils.ParseUUID(
			cachedData.LinkID,
		)
		if err == nil {
			s.incrementClickCount(linkID)
		}

		return cachedData.TargetURL,
			true,
			nil
	}

	if errors.Is(err, redis.Nil) {
		return "", false, nil
	}

	logger.Log.Warn(
		"redis lookup failed",
		zap.Error(err),
		zap.String(
			"cache_key",
			cacheKey,
		),
	)

	return "", false, nil
}

func validateLink(
	actualUsername string,
	actualSlug string,
	isActive bool,
	expectedUsername string,
	expectedSlug string,
) error {

	if !isActive {
		return errors.New("link inactive")
	}

	if actualUsername != expectedUsername ||
		actualSlug != expectedSlug {
		return errors.New("invalid link")
	}

	return nil
}

func (s *Service) cacheRedirect(
	ctx context.Context,
	cacheKey string,
	link db.GetLinkForRedirectRow,
) {
	err := cache.SetRedirect(
		ctx,
		s.Redis,
		cacheKey,
		cache.RedirectCache{
			LinkID:    link.ID.String(),
			TargetURL: link.TargetUrl,
			Username:  link.Username,
			Slug:      link.Slug,
			IsActive:  link.IsActive,
		},
	)

	if err != nil {
		logger.Log.Warn(
			"redirect cache write failed",
			zap.Error(err),
		)
	}
}

func (s *Service) incrementClickCount(
	linkID pgtype.UUID,
) {
	go func(
		linkID pgtype.UUID,
	) {

		incrementCtx,
			cancel :=
			context.WithTimeout(
				context.Background(),
				2*time.Second,
			)

		defer cancel()

		if err := s.Queries.IncrementClickCount(
			incrementCtx,
			linkID,
		); err != nil {

			logger.Log.Warn(
				"click increment failed",
				zap.Error(err),
				zap.String(
					"link_id",
					linkID.String(),
				),
			)
		}

	}(linkID)
}