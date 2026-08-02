package middleware

import (
	"bytes"
	"context"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"

	"github.com/AtharvaKatiyar/rift/internal/logger"
	"go.uber.org/zap"
)

const (
	IdentifierEmail    = "email"
	IdentifierToken    = "token"
	IdentifierUsername = "username"
)

type AuthRateLimitConfig struct {
	IPLimit         int64
	IdentifierLimit int64
	PairLimit       int64
	Window          time.Duration
	Prefix          string
	IdentifierField string
}

func hashIdentifier(
	value string,
) string {

	sum := sha256.Sum256(
		[]byte(value),
	)

	return hex.EncodeToString(
		sum[:],
	)
}

func extractIdentifier(
	body []byte,
	field string,
) string {

	var payload map[string]json.RawMessage

	if err := json.Unmarshal(
		body,
		&payload,
	); err != nil {

		return ""
	}

	raw, ok := payload[field]

	if !ok {

		return ""
	}

	var identifier string

	if err := json.Unmarshal(
		raw,
		&identifier,
	); err != nil {

		return ""
	}

	identifier = strings.TrimSpace(
		identifier,
	)

	if field == IdentifierEmail {

		identifier = strings.ToLower(
			identifier,
		)
	}

	return identifier
}

func AuthRateLimit(
	rdb *redis.Client,
	cfg AuthRateLimitConfig,
) gin.HandlerFunc {

	if (cfg.IdentifierLimit > 0 || cfg.PairLimit > 0) &&
		cfg.IdentifierField == "" {

		panic(
			"IdentifierField is required",
		)
	}

	if cfg.IPLimit < 0 ||
		cfg.IdentifierLimit < 0 ||
		cfg.PairLimit < 0 {

		panic(
			"invalid rate limit configuration",
		)
	}

	return func(c *gin.Context) {

		ctx := c.Request.Context()

		ip := c.ClientIP()

		ipKey := fmt.Sprintf(
			"rl:%s:ip:%s",
			cfg.Prefix,
			ip,
		)

		if incrementAndCheckLimit(
			ctx,
			rdb,
			ipKey,
			cfg.IPLimit,
			cfg.Window,
		) {

			blockRateLimit(
				c,
				cfg.Window,
			)
			return
		}

		if cfg.IdentifierLimit > 0 || cfg.PairLimit > 0 {

			body, err := io.ReadAll(
				c.Request.Body,
			)

			if err != nil {

				c.JSON(
					http.StatusBadRequest,
					gin.H{
						"error": "invalid request body",
					},
				)

				c.Abort()
				return
			}

			identifier :=
				extractIdentifier(
					body,
					cfg.IdentifierField,
				)

			if identifier != "" {

				identifierHash :=
					hashIdentifier(
						identifier,
					)

				pairKey := fmt.Sprintf(
					"rl:%s:pair:%s:%s",
					cfg.Prefix,
					identifierHash,
					ip,
				)

				identifierKey := fmt.Sprintf(
					"rl:%s:id:%s",
					cfg.Prefix,
					identifierHash,
				)

				if incrementAndCheckLimit(
					ctx,
					rdb,
					identifierKey,
					cfg.IdentifierLimit,
					cfg.Window,
				) {

					blockRateLimit(
						c,
						cfg.Window,
					)

					return
				}

				if incrementAndCheckLimit(
					ctx,
					rdb,
					pairKey,
					cfg.PairLimit,
					cfg.Window,
				) {

					blockRateLimit(
						c,
						cfg.Window,
					)

					return
				}
			}

			c.Request.Body = io.NopCloser(
				bytes.NewBuffer(body),
			)

		}
		c.Next()

	}
}

func blockRateLimit(
	c *gin.Context,
	window time.Duration,
) {

	c.Header(
		"Retry-After",
		strconv.FormatInt(
			int64(window.Seconds()),
			10,
		),
	)

	c.JSON(
		http.StatusTooManyRequests,
		gin.H{
			"error": "too many requests",
		},
	)

	c.Abort()
}

func incrementAndCheckLimit(
	ctx context.Context,
	rdb *redis.Client,
	key string,
	limit int64,
	window time.Duration,
) bool {

	count, err := rdb.Incr(
		ctx,
		key,
	).Result()

	if err != nil {

		logger.Log.Warn(
			"rate limiter unavailable",
			zap.Error(err),
			zap.String("key", key),
		)

		return false
	}

	if count == 1 {

		if err := rdb.Expire(
			ctx,
			key,
			window,
		).Err(); err != nil {

			logger.Log.Warn(
				"failed to set rate limit expiry",
				zap.Error(err),
				zap.String("key", key),
			)
		}
	}

	return count > limit
}
