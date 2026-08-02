package middleware

import (
	"github.com/AtharvaKatiyar/rift/internal/constants"
	"github.com/AtharvaKatiyar/rift/internal/httpx"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func RequestID() gin.HandlerFunc {

	return func(c *gin.Context) {

		requestID :=
			"req_" +
				uuid.NewString()

		c.Set(
			constants.RequestIDKey,
			requestID,
		)

		ctx := httpx.WithRequestID(
			c.Request.Context(),
			requestID,
		)

		c.Request =
			c.Request.WithContext(
				ctx,
			)

		c.Writer.Header().Set(
			"X-Request-ID",
			requestID,
		)

		c.Next()
	}
}
