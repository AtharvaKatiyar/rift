package cache
import (
	"context"
	"fmt"
	
	"github.com/AtharvaKatiyar/rift/internal/config"
	"github.com/redis/go-redis/v9"
	"github.com/AtharvaKatiyar/rift/internal/logger"
)
func ConnectRedis(ctx context.Context, cfg *config.Config) (*redis.Client, error) {
	addr := fmt.Sprintf("%s:%s", cfg.RedisHost, cfg.RedisPort)
	rdb := redis.NewClient(&redis.Options{
		Addr:     addr,
		Password: cfg.RedisPassword,
		DB:       0,
	})
	if err := rdb.Ping(ctx).Err(); err != nil {
		_ = rdb.Close()
		return nil, fmt.Errorf("failed to connect to Redis: %w", err)
	}
	logger.Log.Info(
		"redis connected",
	)
	return rdb, nil
}
