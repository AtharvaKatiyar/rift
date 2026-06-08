package middleware

import (
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/AtharvaKatiyar/rift/internal/constants"
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

		c.Writer.Header().Set(
			"X-Request-ID",
			requestID,
		)

		c.Next()
	}
}