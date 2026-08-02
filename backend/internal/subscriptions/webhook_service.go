package subscription

import (
	"context"
	"encoding/json"
	"fmt"

	db "github.com/AtharvaKatiyar/rift/internal/database/sqlc"
	"github.com/AtharvaKatiyar/rift/internal/logger"
	"go.uber.org/zap"
)

func (
	s *Service,
) HandleWebhook(
	ctx context.Context,
	payload []byte,
	headers WebhookHeaders,
) error {

	event, err :=
		s.PaymentProvider.
			ParseWebhook(
				payload,
				headers,
			)

	if err != nil {

		logger.Log.Warn(
			"webhook verification failed",
			zap.String(
				"webhook_id",
				headers.ID,
			),
			zap.Error(err),
		)

		return fmt.Errorf(
			"verify webhook: %w",
			err,
		)
	}

	storedHeaders :=
		struct {
			ID        string `json:"webhook_id"`
			Timestamp string `json:"webhook_timestamp"`
		}{
			ID: headers.ID,

			Timestamp: headers.Timestamp,
		}

	headersJSON, err :=
		json.Marshal(
			storedHeaders,
		)

	if err != nil {

		return fmt.Errorf(
			"marshal webhook headers: %w",
			err,
		)
	}

	err =
		s.Queries.
			CreatePaymentWebhook(
				ctx,
				db.CreatePaymentWebhookParams{
					Provider: db.PaymentProviderDodo,

					ProviderEventID: headers.ID,

					EventType: event.Type,

					Headers: headersJSON,

					Payload: payload,
				},
			)

	if err != nil {

		logger.Log.Error(
			"failed to persist payment webhook",
			zap.String(
				"webhook_id",
				headers.ID,
			),
			zap.String(
				"event_type",
				event.Type,
			),
			zap.Error(err),
		)

		return fmt.Errorf(
			"persist payment webhook: %w",
			err,
		)
	}

	logger.Log.Info(
		"payment webhook persisted",
		zap.String(
			"webhook_id",
			headers.ID,
		),
		zap.String(
			"event_type",
			event.Type,
		),
	)

	return nil
}
