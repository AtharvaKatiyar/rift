package clicks

import (
	"context"
	"fmt"
	"time"

	"github.com/redis/go-redis/v9"
)

type Service struct {
	Redis *redis.Client
	Queue chan string
}

func (s *Service) StartWorkers(
	ctx context.Context,
	workers int,
) {
	for i := 0; i < workers; i++ {

		go func() {

			for {
				select {

				case <-ctx.Done():
					return

				case linkID, ok :=
					<-s.Queue:

					if !ok {
						return
					}

					_ = s.IncrementClick(
						ctx,
						linkID,
					)
				}
			}
		}()
	}
}
func (s *Service) EnqueueClick(
	linkID string,
) {
	select {

	case s.Queue <- linkID:

	default:
		// drop if overloaded
	}
}

func (s *Service) IncrementClick(
	ctx context.Context,
	key string,
) error {

	redisCtx, cancel :=
		context.WithTimeout(
			ctx,
			100*time.Millisecond,
		)

	defer cancel()

	redisKey := fmt.Sprintf(
		"clicks:%s",
		key,
	)

	return s.Redis.Incr(
		redisCtx,
		redisKey,
	).Err()
}
