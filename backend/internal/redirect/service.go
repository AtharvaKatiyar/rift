package redirect

import (
	"context"
	"errors"
	"log"

	"github.com/redis/go-redis/v9"

	"github.com/AtharvaKatiyar/rift/internal/cache"
	db "github.com/AtharvaKatiyar/rift/internal/database/sqlc"
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
	return username + ":" + slug + ":" + key
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
	cachedURL, err := cache.GetRedirect(
		ctx,
		s.Redis,
		cacheKey,
	)

	switch {
	case err == nil:
		return cachedURL, nil

	case errors.Is(err, redis.Nil):
		// cache miss
		break

	default:
		log.Printf(
			"redis lookup failed: %v",
			err,
		)
	}

	link, err := s.Queries.GetLinkForRedirect(
		ctx,
		key,
	)

	if err != nil {
		return "", errors.New(
			"link not found",
		)
	}

	if link.Username != username ||
		link.Slug != slug {

		return "", errors.New(
			"invalid link",
		)
	}

	if err := cache.SetRedirect(
		ctx,
		s.Redis,
		cacheKey,
		link.TargetUrl,
	); err != nil {

		log.Printf(
			"failed to cache redirect: %v",
			err,
		)
	}
	go func(
		linkID interface{},
	) {

		if err := s.Queries.IncrementClickCount(
			context.Background(),
			link.ID,
		); err != nil {

			log.Printf(
				"failed to increment click count: %v",
				err,
			)
		}

	}(link.ID)

	return link.TargetUrl,
		nil
}