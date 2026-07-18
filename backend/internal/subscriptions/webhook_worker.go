package subscription

import (
	"context"
	"errors"
	"time"

	db "github.com/AtharvaKatiyar/rift/internal/database/sqlc"
	"github.com/AtharvaKatiyar/rift/internal/logger"
	"go.uber.org/zap"
)

const (
	webhookWorkerIdleDelay = 2 * time.Second

	webhookWorkerErrorDelay = 5 * time.Second
)

func (
	s *Service,
) RunWebhookWorker(
	ctx context.Context,
) {

	logger.Log.Info(
		"payment webhook worker started",
	)

	defer logger.Log.Info(
		"payment webhook worker stopped",
	)

	for {

		select {

		case <-ctx.Done():

			return

		default:
		}

		err :=
			s.ProcessNextWebhook(
				ctx,
			)

		if err == nil {

			// A webhook was successfully processed.
			// Continue immediately so the worker can drain
			// the remaining queue without unnecessary delay.

			continue
		}

		if errors.Is(
			err,
			ErrNoProcessableWebhooks,
		) {

			if !waitForWebhookWorker(
				ctx,
				webhookWorkerIdleDelay,
			) {
				return
			}

			continue
		}

		logger.Log.Error(
			"payment webhook worker error",
			zap.Error(
				err,
			),
		)

		if !waitForWebhookWorker(
			ctx,
			webhookWorkerErrorDelay,
		) {
			return
		}
	}
}
 
func waitForWebhookWorker(
	ctx context.Context,
	delay time.Duration,
) bool {

	timer :=
		time.NewTimer(
			delay,
		)

	defer timer.Stop()

	select {

	case <-ctx.Done():

		return false

	case <-timer.C:

		return true
	}
}

func (
	s *Service,
) RunWebhookRecoveryWorker(
	ctx context.Context,
) {

	ticker :=
		time.NewTicker(
			1 * time.Minute,
		)

	defer ticker.Stop()

	logger.Log.Info(
		"payment webhook recovery worker started",
	)

	for {

		select {

		case <-ctx.Done():

			logger.Log.Info(
				"payment webhook recovery worker stopped",
			)

			return

		case <-ticker.C:

			recovered, err :=
				s.Queries.
					FailExhaustedStalePaymentWebhooks(
						ctx,
						db.FailExhaustedStalePaymentWebhooksParams{
							StaleTimeoutSeconds: int32(
								PaymentWebhookProcessingStaleTimeout.
									Seconds(),
							),

							MaxAttempts: MaxPaymentWebhookProcessingAttempts,
						},
					)

			if err != nil {

				logger.Log.Error(
					"failed to recover exhausted stale payment webhooks",
					zap.Error(
						err,
					),
				)

				continue
			}

			if recovered > 0 {

				logger.Log.Warn(
					"exhausted stale payment webhooks marked failed",
					zap.Int64(
						"count",
						recovered,
					),
				)
			}
		}
	}
}
