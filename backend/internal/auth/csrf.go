package auth

import (
	"crypto/rand"
	"encoding/hex"
	"net/http"

	"github.com/gin-gonic/gin"
)

const csrfCookieName = "csrf_token"

func generateCSRFToken() (
	string,
	error,
) {

	bytes := make(
		[]byte,
		32,
	)

	_, err := rand.Read(
		bytes,
	)

	if err != nil {
		return "", err
	}

	return hex.EncodeToString(
		bytes,
	), nil
}

func SetCSRFCookie(
	c *gin.Context,
) error {

	token, err :=
		generateCSRFToken()

	if err != nil {
		return err
	}

	isProduction :=
		gin.Mode() ==
			gin.ReleaseMode

	http.SetCookie(
		c.Writer,
		&http.Cookie{
			Name: csrfCookieName,

			Value: token,

			Path: "/",

			HttpOnly: false,

			Secure: isProduction,

			SameSite: http.SameSiteLaxMode,

			MaxAge: int(
				RefreshTokenDuration.Seconds(),
			),
		},
	)

	return nil
}
