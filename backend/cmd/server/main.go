package main

import (
	"context"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	analyticspkg "github.com/AtharvaKatiyar/rift/internal/analytics"
	authpkg "github.com/AtharvaKatiyar/rift/internal/auth"
	"github.com/AtharvaKatiyar/rift/internal/cache"
	clickspkg "github.com/AtharvaKatiyar/rift/internal/clicks"
	"github.com/AtharvaKatiyar/rift/internal/config"
	"github.com/AtharvaKatiyar/rift/internal/database"
	db "github.com/AtharvaKatiyar/rift/internal/database/sqlc"
	"github.com/AtharvaKatiyar/rift/internal/geoip"
	"github.com/AtharvaKatiyar/rift/internal/health"
	linkspkg "github.com/AtharvaKatiyar/rift/internal/links"
	"github.com/AtharvaKatiyar/rift/internal/logger"
	"github.com/AtharvaKatiyar/rift/internal/metrics"
	"github.com/AtharvaKatiyar/rift/internal/middleware"
	redirectpkg "github.com/AtharvaKatiyar/rift/internal/redirect"
	subscriptionpkg "github.com/AtharvaKatiyar/rift/internal/subscriptions"
	dodopayments "github.com/dodopayments/dodopayments-go"
	emailpkg "github.com/AtharvaKatiyar/rift/internal/email"
	"github.com/dodopayments/dodopayments-go/option"
	"go.uber.org/zap"
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
	emailService, err :=
		emailpkg.NewResendService(
			cfg.ResendAPIKey,
			cfg.EmailFrom,
		)

	if err != nil {

		logger.Log.Fatal(
			"email service initialization failed",
			zap.Error(err),
		)
	}
	clicksService :=
		&clickspkg.Service{
			Redis: redisClient,

			Queue: make(
				chan string,
				10000,
			),
		}
	analyticsService :=
		&analyticspkg.Service{
			Queries: queries,

			Queue: make(
				chan db.CreateLinkAnalyticsParams,
				10000,
			),

			GeoIP: geoService,
		}

	if cfg.EnableWorkers {
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
		Secret:  cfg.JWTSecret,
		Email:	 emailService,
		FrontendURL: cfg.FrontendURL,
	}

	authHandler :=
		&authpkg.Handler{
			Service:      authService,
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

			StarterProductID: cfg.DodoStarterProductID,

			ProProductID: cfg.DodoProProductID,

			SuccessURL: cfg.DodoSuccessURL,

			WebhookSecret: cfg.DodoWebhookSecret,
		}

	subscriptionService :=
		&subscriptionpkg.Service{
			Queries:         queries,
			DB:              pgPool,
			PaymentProvider: dodoProvider,
		}
	if cfg.EnableWorkers {
		go subscriptionService.RunWebhookWorker(
			appCtx,
		)
		go subscriptionService.
			RunWebhookRecoveryWorker(
				appCtx,
			)
	}
	subscriptionHandler :=
		&subscriptionpkg.Handler{
			Service: subscriptionService,
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
			Postgres:  pgPool,
			Redis:     redisClient,
			StartTime: time.Now(),
			Instance:  hostname,
			Workers:   cfg.EnableWorkers,
		}

	metricsHandler :=
		&metrics.Handler{
			Postgres: pgPool,

			Redis: redisClient,

			Clicks: clicksService,
		}

	router.GET(
		"/health",
		healthHandler.Health,
	)

	router.HEAD("/health", func(c *gin.Context) {
		c.Status(http.StatusOK)
	})

	router.GET(
		"/metrics",
		metricsHandler.Metrics,
	)

	router.GET("/test-email", func(c *gin.Context) {

		err := emailService.SendPasswordResetEmail(
			c.Request.Context(),
			emailpkg.PasswordResetRequest{
				To: "gijenel107@apdtax.com",

				Name: "Atharva",

				ResetURL: "https://rift.dpdns.org/reset-password?token=test-token-123",

				ExpiryMinutes: 30,
			},
		)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": err.Error(),
			})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"message": "Email sent successfully",
		})
	})

	router.GET("/test-verify-email", func(c *gin.Context) {

		err := emailService.SendEmailVerificationEmail(
			c.Request.Context(),
			emailpkg.EmailVerificationRequest{
				To: "gijenel107@apdtax.com",

				Name: "Atharva",

				VerificationURL: "https://rift.dpdns.org/verify-email?token=test-token-123",

				ExpiryHours: 24,
			},
		)

		if err != nil {

			c.JSON(
				http.StatusInternalServerError,
				gin.H{
					"error": err.Error(),
				},
			)

			return
		}

		c.JSON(
			http.StatusOK,
			gin.H{
				"message": "Verification email sent successfully",
			},
		)
	})

	api := router.Group("/api/v1")

	authRoutes := api.Group("/auth")
	{
		authRoutes.POST(
			"/register",
			middleware.AuthRateLimit(
				redisClient,
				middleware.AuthRateLimitConfig{
					IPLimit:    10,
					IdentifierLimit: 5,
					PairLimit:  3,
					Window:     time.Hour,
					Prefix:     "register",
					IdentifierField: middleware.IdentifierEmail,
				},
			),
			authHandler.Register,
		)

		authRoutes.POST(
			"/login",
			middleware.AuthRateLimit(
				redisClient,
				middleware.AuthRateLimitConfig{
					IPLimit:    30,
					IdentifierLimit: 8,
					PairLimit:  5,
					Window:     time.Minute,
					Prefix:     "login",
					IdentifierField: middleware.IdentifierEmail,
				},
			),
			authHandler.Login,
		)
		authRoutes.POST(
			"/forgot-password",
			middleware.AuthRateLimit(
				redisClient,
				middleware.AuthRateLimitConfig{
					IPLimit:    5,
					IdentifierLimit: 3,
					PairLimit:  2,
					Window:     15 * time.Minute,
					Prefix:     "forgot-password",
					IdentifierField: middleware.IdentifierEmail,
				},
			),
			authHandler.ForgotPassword,
		)

		authRoutes.POST(
			"/reset-password",
			middleware.AuthRateLimit(
				redisClient,
				middleware.AuthRateLimitConfig{
					IPLimit:    10,
					IdentifierLimit: 5,
					PairLimit:  2,
					Window:     15 * time.Minute,
					Prefix:     "reset-password",
					IdentifierField: middleware.IdentifierToken,
				},
			),
			authHandler.ResetPassword,
		)

		authRoutes.POST(
			"/verify-email/request",
			middleware.AuthRateLimit(
				redisClient,
				middleware.AuthRateLimitConfig{
					IPLimit:         5,
					IdentifierLimit: 3,
					PairLimit:       2,
					Window:          15 * time.Minute,
					Prefix:          "verify-email-request",

					IdentifierField: middleware.IdentifierEmail,
				},
			),
			authHandler.SendVerificationEmail,
		)

		authRoutes.POST(
			"/verify-email",
			middleware.AuthRateLimit(
				redisClient,
				middleware.AuthRateLimitConfig{
					IPLimit:         10,
					IdentifierLimit: 5,
					PairLimit:       2,
					Window:          15 * time.Minute,
					Prefix:          "verify-email",

					IdentifierField: middleware.IdentifierToken,
				},
			),
			authHandler.VerifyEmail,
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
		Redis:   redisClient,
	}

	linksHandler := &linkspkg.Handler{
		Service: linksService,
	}

	analyticsHandler :=
		&analyticspkg.Handler{
			Service: analyticsService,
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
		Queries: queries,

		Redis: redisClient,

		Clicks: clicksService,

		Analytics: analyticsService,
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
		Addr: ":" +
			cfg.ServerPort,

		Handler: router,

		ReadTimeout: 10 * time.Second,

		WriteTimeout: 10 * time.Second,

		IdleTimeout: 60 * time.Second,
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
