package cache

import (
	"context"
	"fmt"
	"time"

	"github.com/redis/go-redis/v9"
	"go.uber.org/zap"

	"github.com/AtharvaKatiyar/rift/internal/config"
	"github.com/AtharvaKatiyar/rift/internal/logger"
)

func ConnectRedis(
	ctx context.Context,
	cfg *config.Config,
) (*redis.Client, error) {

	addr := fmt.Sprintf(
		"%s:%s",
		cfg.RedisHost,
		cfg.RedisPort,
	)

	rdb := redis.NewClient(
		&redis.Options{
			Addr: addr,

			Password: cfg.RedisPassword,

			DB: 0,

			// Connection pool
			PoolSize: 200,

			MinIdleConns: 20,

			// Reliability
			MaxRetries: 3,

			// Timeouts
			DialTimeout: 2 * time.Second,

			ReadTimeout: 500 * time.Millisecond,

			WriteTimeout: 500 * time.Millisecond,

			PoolTimeout: 1 * time.Second,

			ConnMaxIdleTime: 5 * time.Minute,
		},
	)

	pingCtx, cancel :=
		context.WithTimeout(
			ctx,
			5*time.Second,
		)

	defer cancel()

	if err := rdb.Ping(
		pingCtx,
	).Err(); err != nil {

		_ = rdb.Close()

		return nil,
			fmt.Errorf(
				"failed to connect to redis: %w",
				err,
			)
	}

	logger.Log.Info(
		"redis connected",

		zap.String(
			"host",
			addr,
		),

		zap.Int(
			"pool_size",
			200,
		),

		zap.Int(
			"1min_idle_conns",
			20,
		),

		zap.Int(
			"max_retries",
			3,
		),
	)

	return rdb, nil
}
