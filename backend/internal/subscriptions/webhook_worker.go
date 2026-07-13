package subscription

import (
	"context"
	"errors"
	"time"

	"github.com/AtharvaKatiyar/rift/internal/logger"

	"go.uber.org/zap"
)

const (
	webhookWorkerIdleDelay =
		2 * time.Second

	webhookWorkerErrorDelay =
		5 * time.Second
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
			ErrNoPendingWebhooks,
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