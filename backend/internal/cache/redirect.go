package cache

import (
	"context"
	"time"

	"github.com/redis/go-redis/v9"
)

const RedirectTTL = 24 * time.Hour

func GetRedirect(
	ctx context.Context,
	rdb *redis.Client,
	key string,
) (string, error) {

	return rdb.Get(
		ctx,
		"redirect:"+key,
	).Result()
}

func SetRedirect(
	ctx context.Context,
	rdb *redis.Client,
	key string,
	targetURL string,
) error {

	return rdb.Set(
		ctx,
		"redirect:"+key,
		targetURL,
		RedirectTTL,
	).Err()
}

func DeleteRedirect(
	ctx context.Context,
	rdb *redis.Client,
	key string,
) error {

	return rdb.Del(
		ctx,
		"redirect:"+key,
	).Err()
}