package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"go.uber.org/zap"

	"github.com/AtharvaKatiyar/rift/internal/httpx"
	"github.com/AtharvaKatiyar/rift/internal/logger"
)

func Recovery() gin.HandlerFunc {

	return gin.CustomRecovery(
		func(
			c *gin.Context,
			recovered interface{},
		) {

			logger.Log.Error(
				"panic recovered",
				zap.Any(
					"panic",
					recovered,
				),
				zap.String(
					"path",
					c.Request.URL.Path,
				),
				zap.String(
					"method",
					c.Request.Method,
				),
				zap.String(
					"request_id",
					httpx.RequestID(c),
				),
			)

			httpx.InternalServerError(
				c,
				nil,
			)

			c.AbortWithStatus(
				http.StatusInternalServerError,
			)
		},
	)
}