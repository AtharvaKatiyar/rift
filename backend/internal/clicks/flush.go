package clicks

import (
	"context"
	"strings"
	"time"

	db "github.com/AtharvaKatiyar/rift/internal/database/sqlc"
	"github.com/AtharvaKatiyar/rift/internal/logger"
	"github.com/AtharvaKatiyar/rift/internal/utils"

	"go.uber.org/zap"
)

func flushClicks(
	ctx context.Context,
	queries *db.Queries,
	service *Service,
) {
	acquired, err :=
		service.Redis.SetNX(
			ctx,
			"click_flush_lock",
			"locked",
			30*time.Second,
		).Result()

	if err != nil {
		return
	}

	if !acquired {
		return
	}

	keys, err :=
		service.Redis.Keys(
			ctx,
			"clicks:*",
		).Result()

	if err != nil {
		return
	}

	for _, redisKey := range keys {

		flushClickKey(
			ctx,
			queries,
			service,
			redisKey,
		)
	}
}

func flushClickKey(
	ctx context.Context,
	queries *db.Queries,
	service *Service,
	redisKey string,
) {
	start := time.Now()

	count, err :=
		service.Redis.Get(
			ctx,
			redisKey,
		).Int64()

	if err != nil {
		return
	}

	linkIDStr :=
		strings.TrimPrefix(
			redisKey,
			"clicks:",
		)

	linkID, err :=
		utils.ParseUUID(
			linkIDStr,
		)

	if err != nil {
		return
	}

	err =
		queries.IncrementClickCountBy(
			ctx,
			db.IncrementClickCountByParams{
				ID: linkID,

				IncrementBy: count,
			},
		)

	if err != nil {
		return
	}

	_ = service.Redis.Del(
		ctx,
		redisKey,
	)

	logger.Log.Info(
		"click count flushed",

		zap.String(
			"link_id",
			linkID.String(),
		),

		zap.Int64(
			"count",
			count,
		),

		zap.Duration(
			"latency",
			time.Since(start),
		),
	)
}
