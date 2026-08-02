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
		println("REQUEST ID MISSING")
		return ""
	}

	id, ok :=
		requestID.(string)

	if !ok {
		println("REQUEST ID INVALID TYPE")
		return ""
	}
	println("REQUEST ID:", id)
	return id
}
