package httpx

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type ErrorResponse struct {
	Error     string `json:"error"`
	RequestID string `json:"request_id,omitempty"`
}

func Error(
	c *gin.Context,
	status int,
	err error,
) {

	message :=
		http.StatusText(
			status,
		)

	if err != nil {
		message =
			err.Error()
	}

	c.JSON(
		status,
		ErrorResponse{
			Error: message,
			RequestID: RequestID(
				c,
			),
		},
	)
}

func BadRequest(
	c *gin.Context,
	err error,
) {

	Error(
		c,
		http.StatusBadRequest,
		err,
	)
}

func Unauthorized(
	c *gin.Context,
	err error,
) {

	Error(
		c,
		http.StatusUnauthorized,
		err,
	)
}

func Forbidden(
	c *gin.Context,
	err error,
) {

	Error(
		c,
		http.StatusForbidden,
		err,
	)
}

func NotFound(
	c *gin.Context,
	err error,
) {

	Error(
		c,
		http.StatusNotFound,
		err,
	)
}

func Conflict(
	c *gin.Context,
	err error,
) {

	Error(
		c,
		http.StatusConflict,
		err,
	)
}

func InternalServerError(
	c *gin.Context,
	err error,
) {

	Error(
		c,
		http.StatusInternalServerError,
		err,
	)
}