package main

import (
	"context"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/AtharvaKatiyar/rift/internal/cache"
	"github.com/AtharvaKatiyar/rift/internal/config"
	"github.com/AtharvaKatiyar/rift/internal/database"

	authpkg "github.com/AtharvaKatiyar/rift/internal/auth"
	db "github.com/AtharvaKatiyar/rift/internal/database/sqlc"
)

func main() {
	cfg := config.LoadConfig()

	ctx := context.Background()

	pgPool, err := database.ConnectPostgres(ctx, cfg)
	if err != nil {
		log.Fatal(err)
	}
	defer pgPool.Close()

	redisClient, err := cache.ConnectRedis(ctx, cfg)
	if err != nil {
		log.Fatal(err)
	}
	defer redisClient.Close()

	queries := db.New(pgPool)

	authService := &authpkg.Service{
		Queries: queries,
		Secret: cfg.JWTSecret,
	}

	authHandler := &authpkg.Handler{
		Service: authService,
	}

	router := gin.Default()

	if err := router.SetTrustedProxies(nil); err != nil {
		log.Fatal(err)
	}

	router.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	api := router.Group("/api/v1")

	authRoutes := api.Group("/auth")
	{
		authRoutes.POST(
			"/register",
			authHandler.Register,
		)

		authRoutes.POST(
			"/login",
			authHandler.Login,
		)

		protected := authRoutes.Group("/")
		protected.Use(
			authpkg.AuthMiddleware(
				cfg.JWTSecret,
			),
		)

		protected.GET(
			"/me",
			authHandler.Me,
		)
	}

	if err := router.Run(":" + cfg.ServerPort); err != nil {
		log.Fatal(err)
	}
}