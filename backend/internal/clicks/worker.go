package clicks

import (
	"context"
	"time"

	db "github.com/AtharvaKatiyar/rift/internal/database/sqlc"
)

func StartFlushWorker(
	ctx context.Context,
	queries *db.Queries,
	service *Service,
) {

	ticker :=
		time.NewTicker(
			30 * time.Second,
		)

	go func() {

		defer ticker.Stop()

		for {

			select {

			case <-ticker.C:

				flushClicks(
					ctx,
					queries,
					service,
				)

			case <-ctx.Done():
				return
			}
		}
	}()
}
