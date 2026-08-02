package cache

import (
	"context"
	"encoding/json"
	"time"

	"github.com/redis/go-redis/v9"
)

const RedirectTTL = 24 * time.Hour

func GetRedirect(
	ctx context.Context,
	rdb *redis.Client,
	key string,
) (*RedirectCache, error) {

	val, err := rdb.Get(
		ctx,
		"redirect:"+key,
	).Result()

	if err != nil {
		return nil, err
	}

	var data RedirectCache

	err = json.Unmarshal(
		[]byte(val),
		&data,
	)

	if err != nil {
		return nil, err
	}

	return &data, nil
}

func SetRedirect(
	ctx context.Context,
	rdb *redis.Client,
	key string,
	data RedirectCache,
) error {

	jsonData, err :=
		json.Marshal(data)

	if err != nil {
		return err
	}

	return rdb.Set(
		ctx,
		"redirect:"+key,
		jsonData,
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
