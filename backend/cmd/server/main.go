package main

import (
	"os"
	"os/signal"
	"syscall"
	"context"
	"net/http"
	"time"         

	"github.com/gin-gonic/gin"
	"github.com/gin-contrib/cors"

	"go.uber.org/zap"
	"github.com/AtharvaKatiyar/rift/internal/cache"
	"github.com/AtharvaKatiyar/rift/internal/config"
	"github.com/AtharvaKatiyar/rift/internal/database"
	"github.com/AtharvaKatiyar/rift/internal/middleware"
	"github.com/AtharvaKatiyar/rift/internal/health"
	"github.com/AtharvaKatiyar/rift/internal/metrics"
	"github.com/AtharvaKatiyar/rift/internal/logger"
	"github.com/AtharvaKatiyar/rift/internal/geoip"
	"github.com/dodopayments/dodopayments-go/option"
	dodopayments "github.com/dodopayments/dodopayments-go"
	authpkg "github.com/AtharvaKatiyar/rift/internal/auth"
	db "github.com/AtharvaKatiyar/rift/internal/database/sqlc"
	linkspkg "github.com/AtharvaKatiyar/rift/internal/links"
	redirectpkg "github.com/AtharvaKatiyar/rift/internal/redirect"
	clickspkg "github.com/AtharvaKatiyar/rift/internal/clicks"
	analyticspkg "github.com/AtharvaKatiyar/rift/internal/analytics"
	subscriptionpkg "github.com/AtharvaKatiyar/rift/internal/subscriptions"
)

func main() {
	
	cfg := config.LoadConfig()

	hostname, err :=
		os.Hostname()

	if err != nil {
		hostname = "unknown"
	}
	
	appCtx,
		appCancel :=
		context.WithCancel(
			context.Background(),
		)

	defer appCancel()
	
	isProduction :=
		cfg.AppEnv ==
			"production"
	
	if isProduction {
		gin.SetMode(
			gin.ReleaseMode,
		)
	}

	err = logger.Init(
		isProduction,
	)

	if err != nil {
		logger.Log.Fatal(
			"logger initialization failed",
			zap.Error(err),
		)
	}

	defer logger.Sync()

	pgPool, err := database.ConnectPostgres(appCtx, cfg)
	if err != nil {
		logger.Log.Fatal(
			"postgres connection failed",
			zap.Error(err),
		)
	}

	redisClient, err := cache.ConnectRedis(appCtx, cfg)
	if err != nil {
		logger.Log.Fatal(
			"redis connection failed",
			zap.Error(err),
		)
	}

	geoService, err :=
		geoip.New(
			"assets/geoip/GeoLite2-City.mmdb",
		)

	if err != nil {

		logger.Log.Fatal(
			"geoip initialization failed",
			zap.Error(err),
		)
	}

	queries := db.New(pgPool)
	
	clicksService :=
		&clickspkg.Service{
			Redis:
				redisClient,

			Queue:
				make(
					chan string,
					10000,
				),
		}
	analyticsService :=
		&analyticspkg.Service{
			Queries:
				queries,

			Queue: make(
				chan db.CreateLinkAnalyticsParams,
				10000,
			),

			GeoIP:
				geoService,
		}

	if cfg.EnableWorkers{
		logger.Log.Info(
			"starting background workers",
		)

		clicksService.StartWorkers(
			appCtx,
			200,
		)
	
	
		clickspkg.StartFlushWorker(
			appCtx,
			queries,
			clicksService,
		)
		analyticsService.StartWorkers(
			appCtx,
			20,
		)
	}
		

	authService := &authpkg.Service{
		Queries: queries,
		DB:      pgPool,
		Secret: cfg.JWTSecret,
	}

	authHandler :=
	&authpkg.Handler{
		Service:
			authService,
		IsProduction: isProduction,
	}

	// client :=
	// 	dodopayments.NewClient(
	// 		option.WithBearerToken(
	// 			cfg.DodoAPIKey,
	// 		),
	// 	)

	opts := []option.RequestOption{
		option.WithBearerToken(
			cfg.DodoAPIKey,
		),
	}

	if cfg.DodoEnvironment == "test" {
		opts = append(
			opts,
			option.WithEnvironmentTestMode(),
		)
	} else {
		opts = append(
			opts,
			option.WithEnvironmentLiveMode(),
		)
	}

	client := dodopayments.NewClient(
		opts...,
	)

	dodoProvider :=
		&subscriptionpkg.DodoProvider{
			Client: client,

			StarterProductID:
				cfg.DodoStarterProductID,

			ProProductID:
				cfg.DodoProProductID,

			SuccessURL:
				cfg.DodoSuccessURL,

			WebhookSecret:
				cfg.DodoWebhookSecret,
		}

	subscriptionService :=
		&subscriptionpkg.Service{
			Queries: queries,
			DB:      pgPool,
			PaymentProvider: dodoProvider,
		}
	if cfg.EnableWorkers {
		go subscriptionService.RunWebhookWorker(
			appCtx,
		)
	}
	subscriptionHandler :=
		&subscriptionpkg.Handler{
			Service:
				subscriptionService,
		}

	router := gin.Default()

	router.Use(
		middleware.RequestID(),
	)

	router.Use(
		middleware.RequestLogger(),
	)

	router.Use(
		middleware.SecurityHeaders(),
	)

	router.Use(cors.New(
		cors.Config{
			AllowOrigins: []string{
				cfg.FrontendURL,
			},

			AllowMethods: []string{
				"GET",
				"POST",
				"PUT",
				"PATCH",
				"DELETE",
				"OPTIONS",
			},

			AllowHeaders: []string{
				"Origin",
				"Content-Type",
				"Authorization",
				"Accept",
			},

			AllowCredentials: true,
		},
	))

	err = router.SetTrustedProxies(
		[]string{
			"172.16.0.0/12",
			"10.0.0.0/8",
			"192.168.0.0/16",
		},
	)

	if err != nil {
		logger.Log.Fatal(
			"server startup failed",
			zap.Error(err),
		)
	}

	healthHandler :=
		&health.Handler{
			Postgres:
				pgPool,
			Redis:
				redisClient,
			StartTime:
				time.Now(),
			Instance:
				hostname,
			Workers:
				cfg.EnableWorkers,
	}

	metricsHandler :=
		&metrics.Handler{
			Postgres:
				pgPool,

			Redis:
				redisClient,

			Clicks:
				clicksService,
		}

	router.GET(
		"/health",
		healthHandler.Health,
	)

	router.GET(
		"/metrics",
		metricsHandler.Metrics,
	)

	api := router.Group("/api/v1")

	authRoutes := api.Group("/auth")
	{
		authRoutes.POST(
			"/register",
			middleware.RateLimit(
				redisClient,
				10,
				time.Minute,
				"register",
			),
			authHandler.Register,
		)

		authRoutes.POST(
			"/login",
			middleware.RateLimit(
				redisClient,
				10,
				time.Minute,
				"login",
			),
			authHandler.Login,
		)
		authRoutes.POST(
			"/refresh",
			middleware.RateLimit(
				redisClient,
				20,
				time.Minute,
				"refresh",
			),
			authHandler.Refresh,
		)
		authRoutes.POST(
			"/logout",
			authHandler.Logout,
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
		protected.POST(
			"/logout-all",
			authHandler.LogoutAll,
		)
	}

	linksService := &linkspkg.Service{
		Queries: queries,
		BaseURL: cfg.BaseURL,
		Redis: redisClient,
	}

	linksHandler := &linkspkg.Handler{
		Service: linksService,
	}

	analyticsHandler :=
		&analyticspkg.Handler{
			Service:
				analyticsService,
		}

	linksRoutes := api.Group(
		"/links",
		authpkg.AuthMiddleware(
			cfg.JWTSecret,
		),
	)

	publicSubscriptionRoutes := api.Group(
		"/subscription",
	)
	{
		publicSubscriptionRoutes.GET(
			"/plans",
			subscriptionHandler.GetPlans,
		)

		publicSubscriptionRoutes.POST(
			"/webhook/dodo",
			subscriptionHandler.DodoWebhook,
		)

	}

	subscriptionRoutes := api.Group(
		"/subscription",
		authpkg.AuthMiddleware(
			cfg.JWTSecret,
		),
	)

	{
		subscriptionRoutes.GET(
			"",
			subscriptionHandler.GetSubscription,
		)
		subscriptionRoutes.POST(
			"/upgrade",
			subscriptionHandler.CreateUpgradeIntent,
		)
		subscriptionRoutes.POST(
			"/checkout",
			subscriptionHandler.CreateCheckout,
		)
		// subscriptionRoutes.POST(
		// 	"/complete",
		// 	subscriptionHandler.CompleteCheckout,
		// )
		subscriptionRoutes.GET(
			"/payment/:checkout_id",
			subscriptionHandler.GetCheckoutStatus,
		)
	}

	{
		linksRoutes.POST(
			"",
			linksHandler.CreateLink,
		)

		linksRoutes.GET(
			"",
			linksHandler.GetUserLinks,
		)

		linksRoutes.PUT(
			"/:id",
			linksHandler.UpdateLink,
		)

		linksRoutes.GET(
			"/:id",
			linksHandler.GetLink,
		)

		linksRoutes.GET(
			"/:id/analytics",
			analyticsHandler.GetLinkAnalytics,
		)

		linksRoutes.DELETE(
			"/:id",
			linksHandler.DeleteLink,
		)

		linksRoutes.PATCH(
			"/:id/status",
			linksHandler.ToggleStatus,
		)
	}

	redirectService := &redirectpkg.Service{
		Queries:
			queries,

			Redis:
				redisClient,

			Clicks:
				clicksService,

			Analytics:
				analyticsService,
	}

	redirectHandler := &redirectpkg.Handler{
		Service: redirectService,
	}

	router.GET(
		"/u/:username/:slug/:key",
		middleware.RateLimit(
				redisClient,
				100,
				time.Minute,
				"redirect",
			),
		redirectHandler.Redirect,
	)

	server := &http.Server{
		Addr:
			":" +
				cfg.ServerPort,

		Handler:
			router,

		ReadTimeout:
			10 * time.Second,

		WriteTimeout:
			10 * time.Second,

		IdleTimeout:
			60 * time.Second,
	}

	go func() {

		logger.Log.Info(
			"server started",
			zap.String(
				"hostname",
				hostname,
			),
			zap.String(
				"port",
				cfg.ServerPort,
			),
			zap.Bool(
				"production",
				isProduction,
			),
		)

		if err :=
			server.ListenAndServe(); err != nil &&
			err != http.ErrServerClosed {

			logger.Log.Error(
				"http server error",
				zap.Error(err),
			)
		}
	}()

	quit := make(
		chan os.Signal,
		1,
	)

	signal.Notify(
		quit,
		syscall.SIGINT,
		syscall.SIGTERM,
	)

	<-quit

	logger.Log.Info(
		"shutdown signal received",
		zap.String(
			"instance",
			hostname,
		),
	)

	appCancel()

	shutdownCtx,
		cancel :=
		context.WithTimeout(
			context.Background(),
			30*time.Second,
		)

	defer cancel()

	if err :=
		server.Shutdown(
			shutdownCtx,
		); err != nil {

		logger.Log.Error(
			"graceful shutdown failed",
			zap.Error(err),
		)
	}

	logger.Log.Info(
		"waiting for workers to finish",
		zap.String(
			"instance",
			hostname,
		),
	)

	time.Sleep(
		3 * time.Second,
	)

	pgPool.Close()

	if err :=
		redisClient.Close(); err != nil {

		logger.Log.Error(
			"redis close failed",
			zap.Error(err),
		)
	}

	logger.Log.Info(
		"server shutdown complete",
		zap.String(
			"instance",
			hostname,
		),
	)
}