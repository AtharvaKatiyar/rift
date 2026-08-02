package metrics

import (
	"net/http"
	"runtime"

	clickspkg "github.com/AtharvaKatiyar/rift/internal/clicks"
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/redis/go-redis/v9"
)

type Handler struct {
	Postgres *pgxpool.Pool
	Redis    *redis.Client
	Clicks   *clickspkg.Service
}

func (h *Handler) Metrics(
	c *gin.Context,
) {

	pgStats :=
		h.Postgres.Stat()

	redisStats :=
		h.Redis.PoolStats()

	var mem runtime.MemStats

	runtime.ReadMemStats(
		&mem,
	)

	c.JSON(
		http.StatusOK,
		gin.H{
			"postgres": gin.H{
				"acquired_conns": pgStats.AcquiredConns(),

				"idle_conns": pgStats.IdleConns(),

				"total_conns": pgStats.TotalConns(),

				"max_conns": pgStats.MaxConns(),

				"empty_acquire_count": pgStats.EmptyAcquireCount(),
			},

			"redis": gin.H{
				"hits": redisStats.Hits,

				"misses": redisStats.Misses,

				"timeouts": redisStats.Timeouts,

				"total_conns": redisStats.TotalConns,

				"idle_conns": redisStats.IdleConns,

				"stale_conns": redisStats.StaleConns,
			},

			"go_runtime": gin.H{
				"goroutines": runtime.NumGoroutine(),

				"memory_mb": mem.Alloc /
					1024 /
					1024,

				"heap_objects": mem.HeapObjects,

				"gc_runs": mem.NumGC,
			},

			"clicks": gin.H{
				"queue_size": len(h.Clicks.Queue),

				"queue_capacity": cap(h.Clicks.Queue),
			},
		},
	)
}
