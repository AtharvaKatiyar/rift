package middleware

import (
	"time"

	"github.com/gin-gonic/gin"
	"go.uber.org/zap"

	"github.com/AtharvaKatiyar/rift/internal/logger"
	"github.com/AtharvaKatiyar/rift/internal/constants"
)

func RequestLogger() gin.HandlerFunc {

	
	return func(c *gin.Context) {
		
		start := time.Now()
		requestID, _ := c.Get(
			constants.RequestIDKey,
		)
		c.Next()
		duration := time.Since(start)

		status := c.Writer.Status()

		requestIDStr, _ :=
			requestID.(string)

		fields := []zap.Field{
			zap.String(
				"request_id",
				requestIDStr,
			),

			zap.String(
				"method",
				c.Request.Method,
			),

			zap.String(
				"url",
				c.Request.URL.String(),
			),

			zap.Int(
				"status",
				status,
			),

			zap.Duration(
				"latency",
				duration,
			),

			zap.String(
				"ip",
				c.ClientIP(),
			),

			zap.String(
				"user_agent",
				c.Request.UserAgent(),
			),
		}

		switch {

		case status >= 500:

			logger.Log.Error(
				"http request",
				fields...,
			)

		case status >= 400:

			logger.Log.Warn(
				"http request",
				fields...,
			)

		default:

			logger.Log.Info(
				"http request",
				fields...,
			)
		}
	}
}
