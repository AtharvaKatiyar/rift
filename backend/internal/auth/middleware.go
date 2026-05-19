package auth

import (
	"net/http"
	"strings"
	"log"
	"github.com/gin-gonic/gin"
)

func AuthMiddleware(
	secret string,
) gin.HandlerFunc {

	return func(c *gin.Context) {

		authHeader := c.GetHeader(
			"Authorization",
		)

		log.Println(
			"Authorization Header:",
			authHeader,
		)

		if authHeader == "" {

			c.JSON(
				http.StatusUnauthorized,
				gin.H{
					"error": "missing token",
				},
			)

			c.Abort()
			return
		}

		if !strings.HasPrefix(
			authHeader,
			"Bearer ",
		) {

			c.JSON(
				http.StatusUnauthorized,
				gin.H{
					"error": "invalid token format",
				},
			)

			c.Abort()
			return
		}

		tokenString := strings.TrimPrefix(
			authHeader,
			"Bearer ",
		)

		log.Println(
			"Token String:",
			tokenString,
		)

		claims, err := ValidateJWT(
			tokenString,
			secret,
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