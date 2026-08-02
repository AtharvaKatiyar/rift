package auth

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

func AuthMiddleware(
	secret string,
) gin.HandlerFunc {

	return func(
		c *gin.Context,
	) {

		tokenString, err :=
			GetAccessCookie(
				c,
			)

		if err != nil {

			_, refreshErr :=
				GetRefreshCookie(
					c,
				)

			if refreshErr == nil {

				c.JSON(
					http.StatusUnauthorized,
					gin.H{
						"error": "access token expired",

						"requires_refresh": true,
					},
				)

				c.Abort()

				return
			}

			c.JSON(
				http.StatusUnauthorized,
				gin.H{
					"error": "unauthorized",
				},
			)

			c.Abort()

			return
		}

		claims, err :=
			ValidateToken(
				tokenString,
				secret,
				"access",
			)

		if err != nil {

			_, refreshErr :=
				GetRefreshCookie(
					c,
				)

			if refreshErr == nil {

				c.JSON(
					http.StatusUnauthorized,
					gin.H{
						"error": "access token expired",

						"requires_refresh": true,
					},
				)

				c.Abort()

				return
			}

			c.JSON(
				http.StatusUnauthorized,
				gin.H{
					"error": "invalid token",
				},
			)

			c.Abort()

			return
		}

		c.Set(
			"user_id",
			claims.UserID,
		)

		c.Set(
			"user_email",
			claims.Email,
		)

		c.Next()
	}
}
