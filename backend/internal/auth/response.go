package auth

import (
	"github.com/AtharvaKatiyar/rift/internal/httpx"
	"github.com/gin-gonic/gin"
)

func SetSessionResponse(
	c *gin.Context,
	accessToken string,
	refreshToken string,
	isProduction bool,
) error {

	SetAuthCookies(
		c,
		accessToken,
		refreshToken,
		isProduction,
	)

	err := SetCSRFCookie(
		c,
	)

	if err != nil {
		return err
	}

	return nil
}

func HandleAuthError(
	c *gin.Context,
	status int,
	err error,
) {

	httpx.Error(
		c,
		status,
		err,
	)

}

func HandleAuthSuccess(
	c *gin.Context,
	status int,
	message string,
) {
	httpx.Success(
		c,
		status,
		message,
	)
}
