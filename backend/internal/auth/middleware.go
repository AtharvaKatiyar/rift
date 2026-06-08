package auth

import (
	"net/http"
	"github.com/gin-gonic/gin"
)

func AuthMiddleware(
	secret string,
) gin.HandlerFunc {

	return func(c *gin.Context) {

		tokenString, err :=
			GetAccessCookie(c)

		if err != nil {

			c.JSON(
				http.StatusUnauthorized,
				gin.H{
					"error":
					"missing access token",
				},
			)

			c.Abort()
			return
		}

		claims, err := ValidateToken(
			tokenString,
			secret,
			"access",
		)

		if err != nil {

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