package helpers

import (
	"github.com/gin-gonic/gin"

	authpkg "github.com/AtharvaKatiyar/rift/internal/auth"
	linkspkg "github.com/AtharvaKatiyar/rift/internal/links"
	redirectpkg "github.com/AtharvaKatiyar/rift/internal/redirect"
)

type TestRouterConfig struct {
	AuthHandler     *authpkg.Handler
	LinksHandler    *linkspkg.Handler
	RedirectHandler *redirectpkg.Handler
	JWTSecret       string
}

func SetupRouter(
	cfg TestRouterConfig,
) *gin.Engine {

	gin.SetMode(
		gin.TestMode,
	)

	router :=
		gin.New()

	api :=
		router.Group(
			"/api/v1",
		)

	authRoutes :=
		api.Group(
			"/auth",
		)

	{
		authRoutes.POST(
			"/register",
			cfg.AuthHandler.Register,
		)

		authRoutes.POST(
			"/login",
			cfg.AuthHandler.Login,
		)

		authRoutes.POST(
			"/refresh",
			cfg.AuthHandler.Refresh,
		)

		authRoutes.POST(
			"/logout",
			cfg.AuthHandler.Logout,
		)
	}

	return router
}
