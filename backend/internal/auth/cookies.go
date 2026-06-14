package auth

import (
	"net/http"
	"github.com/gin-gonic/gin"
)

const (
	accessCookieName  = "access_token"
	refreshCookieName = "refresh_token"
)

func SetAuthCookies(
	c *gin.Context,
	accessToken string,
	refreshToken string,
	isProduction bool,
) {

	http.SetCookie(
		c.Writer,
		&http.Cookie{
			Name:
				accessCookieName,
			Value:
				accessToken,
			Path: "/",
			MaxAge: int(
				AccessTokenDuration.Seconds(),
			),
			HttpOnly: true,
			Secure:
				isProduction,
			SameSite:
				func() http.SameSite{
					if isProduction {
						return http.SameSiteStrictMode
					}
					return http.SameSiteLaxMode
				}(),
		},
	)

	http.SetCookie(
		c.Writer,
		&http.Cookie{
			Name:
				refreshCookieName,
			Value:
				refreshToken,
			Path: "/",
			MaxAge: int(
				RefreshTokenDuration.Seconds(),
			),
			HttpOnly: true,
			Secure:
				isProduction,
			SameSite:
				func() http.SameSite{
					if isProduction {
						return http.SameSiteStrictMode
					}
					return http.SameSiteLaxMode
				}(),
		},
	)
}
func ClearAuthCookies(
	c *gin.Context,
	isProduction bool,
) {

	http.SetCookie(
		c.Writer,
		&http.Cookie{
			Name:
				accessCookieName,
			Value: "",
			Path: "/",
			MaxAge: -1,
			HttpOnly: true,
			Secure:
				isProduction,
			SameSite:
				func() http.SameSite{
					if isProduction {
						return http.SameSiteStrictMode
					}
					return http.SameSiteLaxMode
				}(),
		},
	)

	http.SetCookie(
		c.Writer,
		&http.Cookie{
			Name:
				refreshCookieName,
			Value: "",
			Path: "/",
			MaxAge: -1,
			HttpOnly: true,
			Secure:
				isProduction,
			SameSite:
				func() http.SameSite{
					if isProduction {
						return http.SameSiteStrictMode
					}
					return http.SameSiteLaxMode
				}(),
		},
	)
}

func GetRefreshCookie(
	c *gin.Context,
) (string, error) {

	return c.Cookie(
		refreshCookieName,
	)
}

func GetAccessCookie(
	c *gin.Context,
) (string, error) {

	return c.Cookie(
		accessCookieName,
	)
}