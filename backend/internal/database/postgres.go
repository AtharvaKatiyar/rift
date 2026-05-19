package database

import (
	"context"
	"fmt"
	"log"
	
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/AtharvaKatiyar/rift/internal/config"
)

func ConnectPostgres(ctx context.Context, cfg *config.Config) (*pgxpool.Pool, error) {
	dsn := fmt.Sprintf("postgresql://%s:%s@%s:%s/%s?sslmode=%s",
		cfg.PostgresUser,
		cfg.PostgresPassword,
		cfg.PostgresHost,
		cfg.PostgresPort,
		cfg.PostgresDB,
		cfg.PostgresSSLMode,
	)
	pool, err := pgxpool.New(ctx, dsn)
	if err != nil {
		return nil, fmt.Errorf("failed to create postgres pool: %w", err)
	}
	
	
	if err := pool.Ping(ctx); err != nil {
		pool.Close()
		return nil, fmt.Errorf("failed to ping postgres: %w", err)
	}
	log.Println("successfully connected to postgres")
	return pool, nil
}