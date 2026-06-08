package httpx

import (
	"github.com/gin-gonic/gin"

	"github.com/AtharvaKatiyar/rift/internal/constants"
)

func RequestID(
	c *gin.Context,
) string {

	requestID, ok :=
		c.Get(
			constants.RequestIDKey,
		)

	if !ok {
		return ""
	}

	id, ok :=
		requestID.(string)

	if !ok {
		return ""
	}

	return id
}