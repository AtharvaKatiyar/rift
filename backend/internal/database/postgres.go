package database

import (
	"context"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/AtharvaKatiyar/rift/internal/config"
	"github.com/AtharvaKatiyar/rift/internal/logger"

	"go.uber.org/zap"
)

func ConnectPostgres(
	ctx context.Context,
	cfg *config.Config,
) (*pgxpool.Pool, error) {

	dsn := fmt.Sprintf(
		"postgresql://%s:%s@%s:%s/%s?sslmode=%s",
		cfg.PostgresUser,
		cfg.PostgresPassword,
		cfg.PostgresHost,
		cfg.PostgresPort,
		cfg.PostgresDB,
		cfg.PostgresSSLMode,
	)

	poolConfig, err :=
		pgxpool.ParseConfig(dsn)

	if err != nil {
		return nil, err
	}

	// Pool tuning
	poolConfig.MaxConns = 25
	poolConfig.MinConns = 5

	poolConfig.MaxConnLifetime =
		30 * time.Minute
	
	poolConfig.MaxConnLifetimeJitter =
		5 * time.Minute

	poolConfig.MaxConnIdleTime =
		5 * time.Minute

	poolConfig.HealthCheckPeriod =
		1 * time.Minute

	pool, err :=
		pgxpool.NewWithConfig(
			ctx,
			poolConfig,
		)

	if err != nil {
		return nil,
			fmt.Errorf(
				"failed to create postgres pool: %w",
				err,
			)
	}

	pingCtx, cancel :=
		context.WithTimeout(
			ctx,
			5*time.Second,
		)

	defer cancel()

	if err := pool.Ping(
		pingCtx,
	); err != nil {

		pool.Close()

		return nil,
			fmt.Errorf(
				"failed to ping postgres: %w",
				err,
			)
	}

	logger.Log.Info(
		"postgres connected",

		zap.String(
			"host",
			cfg.PostgresHost,
		),

		zap.String(
			"database",
			cfg.PostgresDB,
		),


		zap.Int32(
			"max_conns",
			poolConfig.MaxConns,
		),

		zap.Int32(
			"min_conns",
			poolConfig.MinConns,
		),
	)

	return pool, nil
}