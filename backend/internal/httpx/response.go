package httpx

import (
	"github.com/gin-gonic/gin"
)

type SuccessResponse struct {
	Message   string `json:"message"`
	RequestID string `json:"request_id,omitempty"`
}

func Success(
	c *gin.Context,
	status int,
	message string,
) {

	c.JSON(
		status,
		SuccessResponse{
			Message: message,
			RequestID: RequestID(
				c,
			),
		},
	)
}