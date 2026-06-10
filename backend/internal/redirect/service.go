package redirect

import (
	"context"
	"errors"
	"time"
	"strings"

	"github.com/redis/go-redis/v9"
	"go.uber.org/zap"

	"github.com/AtharvaKatiyar/rift/internal/cache"
	db "github.com/AtharvaKatiyar/rift/internal/database/sqlc"
	"github.com/AtharvaKatiyar/rift/internal/logger"
	"github.com/AtharvaKatiyar/rift/internal/httpx"
	clickspkg "github.com/AtharvaKatiyar/rift/internal/clicks"
)

type Service struct {
	Queries *db.Queries
	Redis   *redis.Client
	Clicks  *clickspkg.Service
}

const (
	redirectRedisTimeout =
		500 * time.Millisecond

	redirectDBTimeout =
		1 * time.Second
)

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

	start := time.Now()

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

		// logger.Log.Debug(
		// 	"redirect resolved",
		// 	zap.Bool(
		// 		"cache_hit",
		// 		found,
		// 	),
		// 	zap.Duration(
		// 		"latency",
		// 		time.Since(start),
		// 	),
		// )

		return url, err
	}

	// DB fallback
	dbCtx, cancel :=
		context.WithTimeout(
			ctx,
			redirectDBTimeout,
		)

	defer cancel()

	link, err := s.Queries.GetLinkForRedirect(
		dbCtx,
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
	if s.Clicks != nil {
		s.Clicks.EnqueueClick(
			link.ID.String(),
		)
	}

	logger.Log.Debug(
		"redirect resolved",
		zap.Bool(
			"cache_hit",
			false,
		),
		zap.Duration(
			"latency",
			time.Since(start),
		),
	)

	return link.TargetUrl, nil
}

func (s *Service) resolveFromCache(
	ctx context.Context,
	cacheKey string,
	username string,
	slug string,
) (string, bool, error) {

	redisCtx, cancel :=
		context.WithTimeout(
			ctx,
			redirectRedisTimeout,
		)

	defer cancel()

	cachedData, err := cache.GetRedirect(
		redisCtx,
		s.Redis,
		cacheKey,
	)

	if err == nil {

		logger.Log.Debug(
			"redirect cache hit",
			zap.String(
				"cache_key",
				cacheKey,
			),
		)

		if err := validateLink(
			cachedData.Username,
			cachedData.Slug,
			cachedData.IsActive,
			username,
			slug,
		); err != nil {
			return "", true, err
		}

		if s.Clicks != nil {
			s.Clicks.EnqueueClick(
				cachedData.LinkID,
			)
		}

		return cachedData.TargetURL,
			true,
			nil
	}

	if errors.Is(err, redis.Nil) {
		logger.Log.Debug(
			"redirect cache miss",
			zap.String(
				"cache_key",
				cacheKey,
			),
		)
		return "", false, nil
	}

	logger.Log.Warn(
		"redis lookup failed",
		zap.Error(err),
		zap.String(
			"request_id",
			httpx.RequestIDFromContext(ctx),
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
	cacheCtx, cancel :=
		context.WithTimeout(
			ctx,
			redirectRedisTimeout,
		)

	defer cancel()

	err := cache.SetRedirect(
		cacheCtx,
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



// func (s *Service) incrementClickCount(
// 	linkID pgtype.UUID,
// ) {
// 	go func(
// 		linkID pgtype.UUID,
// 	) {

// 		incrementCtx,
// 			cancel :=
// 			context.WithTimeout(
// 				context.Background(),
// 				clickIncrementTimeout,
// 			)

// 		defer cancel()

// 		if err := s.Queries.IncrementClickCount(
// 			incrementCtx,
// 			linkID,
// 		); err != nil {

// 			logger.Log.Warn(
// 				"click increment failed",
// 				zap.Error(err),
// 				zap.String(
// 					"link_id",
// 					linkID.String(),
// 				),
// 			)
// 		}

// 	}(linkID)
// }