package middleware

import (
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
)

func RateLimit(
	rdb *redis.Client,
	limit int64,
	window time.Duration,
	prefix string,
) gin.HandlerFunc {

	return func(c *gin.Context) {

		ip := c.ClientIP()

		key := fmt.Sprintf(
			"rate_limit:%s:%s",
			prefix,
			ip,
		)

		count, err := rdb.Incr(
			c.Request.Context(),
			key,
		).Result()

		if err != nil {

			c.JSON(
				http.StatusInternalServerError,
				gin.H{
					"error": "rate limiter unavailable",
				},
			)

			c.Abort()
			return
		}

		// first request
		if count == 1 {

			err = rdb.Expire(
				c.Request.Context(),
				key,
				window,
			).Err()

			if err != nil {

				c.JSON(
					http.StatusInternalServerError,
					gin.H{
						"error": "rate limiter unavailable",
					},
				)

				c.Abort()
				return
			}
		}

		if count > limit {

			c.JSON(
				http.StatusTooManyRequests,
				gin.H{
					"error": "rate limit exceeded",
				},
			)

			c.Abort()
			return
		}

		c.Next()
	}
}
