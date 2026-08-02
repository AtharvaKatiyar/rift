package health

import (
	"context"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/redis/go-redis/v9"
)

type Handler struct {
	Postgres  *pgxpool.Pool
	Redis     *redis.Client
	StartTime time.Time
	Instance  string
	Workers   bool
}

func (h *Handler) Health(
	c *gin.Context,
) {

	ctx, cancel :=
		context.WithTimeout(
			context.Background(),
			2*time.Second,
		)
	defer cancel()

	postgresStatus := "healthy"
	redisStatus := "healthy"

	if err := h.Postgres.Ping(ctx); err != nil {
		postgresStatus =
			"unhealthy"
	}

	if err := h.Redis.Ping(ctx).Err(); err != nil {
		redisStatus =
			"unhealthy"
	}

	status := "ok"

	if postgresStatus != "healthy" ||
		redisStatus != "healthy" {

		status = "degraded"
	}

	c.JSON(
		http.StatusOK,
		gin.H{
			"status":   status,
			"postgres": postgresStatus,
			"redis":    redisStatus,
			"uptime": time.Since(
				h.StartTime,
			).String(),
			"instance": h.Instance,

			"workers": h.Workers,
		},
	)
}
