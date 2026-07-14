package subscription

import (
	"context"
	"errors"
	"fmt"
	"time"

	db "github.com/AtharvaKatiyar/rift/internal/database/sqlc"
	"github.com/AtharvaKatiyar/rift/internal/logger"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
	"go.uber.org/zap"
)

var ErrNoProcessableWebhooks = errors.New(
	"no processable payment webhooks",
)

func (
	s *Service,
) ProcessNextWebhook(
	ctx context.Context,
) error {

	webhook, err :=
		s.Queries.
			ClaimNextPaymentWebhook(
				ctx,
				db.ClaimNextPaymentWebhookParams{
					MaxAttempts: MaxPaymentWebhookProcessingAttempts,
					StaleTimeoutSeconds: int32(
						PaymentWebhookProcessingStaleTimeout.Seconds(),
					),
				},
			)

	if errors.Is(
		err,
		pgx.ErrNoRows,
	) {
		return ErrNoProcessableWebhooks
	}

	if err != nil {
		return fmt.Errorf(
			"claim pending payment webhook: %w",
			err,
		)
	}

	logger.Log.Info(
		"payment webhook claimed",
		zap.String(
			"webhook_id",
			webhook.ProviderEventID,
		),
		zap.String(
			"event_type",
			webhook.EventType,
		),
		zap.Int32(
			"processing_attempts",
			webhook.ProcessingAttempts,
		),
	)

	event, err :=
		s.PaymentProvider.
			DecodeWebhook(
				webhook.Payload,
			)

	if err != nil {

		return s.failPaymentWebhook(
			ctx,
			webhook.ID,
			webhook.ProcessingAttempts,
			fmt.Errorf(
				"decode stored webhook: %w",
				err,
			),
		)
	}

	err =
		s.processWebhookEvent(
			ctx,
			webhook,
			event,
		)

	if err != nil {

		return s.failPaymentWebhook(
			ctx,
			webhook.ID,
			webhook.ProcessingAttempts,
			err,
		)
	}

	logger.Log.Info(
		"payment webhook processed",
		zap.String(
			"webhook_id",
			webhook.ProviderEventID,
		),
		zap.String(
			"event_type",
			webhook.EventType,
		),
	)

	return nil
}

func (
	s *Service,
) processWebhookEvent(
	ctx context.Context,
	webhook db.PaymentWebhook,
	event *WebhookEvent,
) error {

	switch event.Type {

	case "payment.succeeded":

		return s.processPaymentSucceeded(
			ctx,
			webhook,
			event,
		)

	case "payment.failed":

		return s.processPaymentFailed(
			ctx,
			webhook,
			event,
		)

	default:

		logger.Log.Info(
			"unsupported payment webhook ignored",
			zap.String(
				"event_type",
				event.Type,
			),
		)

		_, err :=
			s.Queries.
				MarkPaymentWebhookProcessed(
					ctx,
					webhook.ID,
				)

		if err != nil {
			return fmt.Errorf(
				"mark unsupported payment webhook processed: %w",
				err,
			)
		}

		return nil
	}
}

func (
	s *Service,
) processPaymentSucceeded(
	ctx context.Context,
	webhook db.PaymentWebhook,
	event *WebhookEvent,
) error {

	checkoutID :=
		event.Data.CheckoutSessionID

	if checkoutID == "" {
		return errors.New(
			"payment.succeeded webhook missing checkout_session_id",
		)
	}

	tx, err :=
		s.DB.BeginTx(
			ctx,
			pgx.TxOptions{},
		)

	if err != nil {
		return fmt.Errorf(
			"begin payment succeeded transaction: %w",
			err,
		)
	}

	committed :=
		false

	defer func() {

		if !committed {
			_ = tx.Rollback(
				ctx,
			)
		}
	}()

	txQueries :=
		s.Queries.WithTx(
			tx,
		)

	paymentIntent, err :=
		txQueries.
			GetPaymentIntentForUpdate(
				ctx,
				db.GetPaymentIntentForUpdateParams{
					Provider: webhook.Provider,
					ProviderEventID: checkoutID,
				},
			)

	if err != nil {

		if errors.Is(
			err,
			pgx.ErrNoRows,
		) {
			return fmt.Errorf(
				"payment intent not found for checkout_id %s",
				checkoutID,
			)
		}

		return fmt.Errorf(
			"get payment intent for update: %w",
			err,
		)
	}

	switch paymentIntent.Status {

	case db.PaymentIntentStatusSucceeded:

		_, err =
			txQueries.
				MarkPaymentWebhookProcessed(
					ctx,
					webhook.ID,
				)

		if err != nil {
			return fmt.Errorf(
				"mark duplicate payment webhook processed: %w",
				err,
			)
		}

		err =
			tx.Commit(
				ctx,
			)

		if err != nil {
			return fmt.Errorf(
				"commit duplicate payment webhook transaction: %w",
				err,
			)
		}

		committed =
			true

		logger.Log.Info(
			"payment intent already succeeded",
			zap.String(
				"checkout_id",
				checkoutID,
			),
			zap.String(
				"webhook_id",
				webhook.ProviderEventID,
			),
		)

		return nil

	case db.PaymentIntentStatusPending:

		// Valid transition:
		// pending -> succeeded

	default:

		return fmt.Errorf(
			"cannot process payment.succeeded for payment intent in status %s",
			paymentIntent.Status,
		)
	}

	if !paymentIntent.UserID.Valid {
		return errors.New(
			"payment intent has no user_id",
		)
	}

	if !paymentIntent.Plan.Valid {
		return ErrInvalidPaymentPlan
	}

	plan :=
		paymentIntent.Plan.
			SubscriptionPlan

	switch plan {

	case db.SubscriptionPlanStarter,
		db.SubscriptionPlanPro:

	default:

		return ErrInvalidPaymentPlan
	}

	_, err =
		txQueries.
			ActivateUserSubscriptionPlan(
				ctx,
				db.ActivateUserSubscriptionPlanParams{
					UserID: paymentIntent.UserID,

					Plan: plan,
				},
			)

	if err != nil {
		return fmt.Errorf(
			"activate user subscription plan: %w",
			err,
		)
	}

	_, err =
		txQueries.
			MarkPaymentIntentSucceededByID(
				ctx,
				paymentIntent.ID,
			)

	if err != nil {
		return fmt.Errorf(
			"mark payment intent succeeded: %w",
			err,
		)
	}

	_, err =
		txQueries.
			MarkPaymentWebhookProcessed(
				ctx,
				webhook.ID,
			)

	if err != nil {
		return fmt.Errorf(
			"mark payment webhook processed: %w",
			err,
		)
	}

	err =
		tx.Commit(
			ctx,
		)

	if err != nil {
		return fmt.Errorf(
			"commit payment succeeded transaction: %w",
			err,
		)
	}

	committed =
		true

	logger.Log.Info(
		"payment succeeded transaction committed",
		zap.String(
			"payment_intent_id",
			paymentIntent.ID.String(),
		),
		zap.String(
			"webhook_id",
			webhook.ProviderEventID,
		),
		zap.String(
			"payment_id",
			event.Data.PaymentID,
		),
		zap.String(
			"checkout_id",
			checkoutID,
		),
		zap.String(
			"plan",
			string(
				plan,
			),
		),
	)

	return nil
}

func (
	s *Service,
) processPaymentFailed(
	ctx context.Context,
	webhook db.PaymentWebhook,
	event *WebhookEvent,
) error {

	checkoutID :=
		event.Data.CheckoutSessionID

	if checkoutID == "" {
		return errors.New(
			"payment.failed webhook missing checkout_session_id",
		)
	}

	tx, err :=
		s.DB.BeginTx(
			ctx,
			pgx.TxOptions{},
		)

	if err != nil {
		return fmt.Errorf(
			"begin payment failed transaction: %w",
			err,
		)
	}

	committed :=
		false

	defer func() {

		if !committed {
			_ = tx.Rollback(
				ctx,
			)
		}
	}()

	txQueries :=
		s.Queries.WithTx(
			tx,
		)

	paymentIntent, err :=
		txQueries.
			GetPaymentIntentForUpdate(
				ctx,
				db.GetPaymentIntentForUpdateParams{
					Provider: webhook.Provider,
					ProviderEventID: checkoutID,
				},
			)

	if err != nil {

		if errors.Is(
			err,
			pgx.ErrNoRows,
		) {
			return fmt.Errorf(
				"payment intent not found for checkout_id %s",
				checkoutID,
			)
		}

		return fmt.Errorf(
			"get payment intent for update: %w",
			err,
		)
	}

	switch paymentIntent.Status {

	case db.PaymentIntentStatusFailed:

		// This payment intent was already marked failed.
		// Treat this webhook as an idempotent duplicate.

		_, err =
			txQueries.
				MarkPaymentWebhookProcessed(
					ctx,
					webhook.ID,
				)

		if err != nil {
			return fmt.Errorf(
				"mark duplicate payment.failed webhook processed: %w",
				err,
			)
		}

		err =
			tx.Commit(
				ctx,
			)

		if err != nil {
			return fmt.Errorf(
				"commit duplicate payment.failed transaction: %w",
				err,
			)
		}

		committed =
			true

		logger.Log.Info(
			"payment intent already failed",
			zap.String(
				"checkout_id",
				checkoutID,
			),
			zap.String(
				"webhook_id",
				webhook.ProviderEventID,
			),
		)

		return nil

	case db.PaymentIntentStatusPending:

		// Valid transition:
		// pending -> failed

	default:

		return fmt.Errorf(
			"cannot process payment.failed for payment intent in status %s",
			paymentIntent.Status,
		)
	}

	_, err =
		txQueries.
			MarkPaymentIntentFailedByID(
				ctx,
				paymentIntent.ID,
			)

	if err != nil {
		return fmt.Errorf(
			"mark payment intent failed: %w",
			err,
		)
	}

	_, err =
		txQueries.
			MarkPaymentWebhookProcessed(
				ctx,
				webhook.ID,
			)

	if err != nil {
		return fmt.Errorf(
			"mark payment.failed webhook processed: %w",
			err,
		)
	}

	err =
		tx.Commit(
			ctx,
		)

	if err != nil {
		return fmt.Errorf(
			"commit payment failed transaction: %w",
			err,
		)
	}

	committed =
		true

	logger.Log.Info(
		"payment failed transaction committed",
		zap.String(
			"payment_intent_id",
			paymentIntent.ID.String(),
		),
		zap.String(
			"webhook_id",
			webhook.ProviderEventID,
		),
		zap.String(
			"payment_id",
			event.Data.PaymentID,
		),
		zap.String(
			"checkout_id",
			checkoutID,
		),
	)

	return nil
}

func (
	s *Service,
) failPaymentWebhook(
	ctx context.Context,
	webhookID pgtype.UUID,
	processingAttempts int32,
	processingErr error,
) error {

	var nextRetryAt pgtype.Timestamptz

	retryDelay,
		shouldRetry :=
		paymentWebhookRetryDelay(
			processingAttempts,
		)

	if shouldRetry {

		nextRetryAt =
			pgtype.Timestamptz{
				Time: time.Now().
					Add(
						retryDelay,
					),

				Valid: true,
			}
	}

	webhook, err :=
		s.Queries.
			MarkPaymentWebhookFailed(
				ctx,
				db.MarkPaymentWebhookFailedParams{
					ID: webhookID,

					LastError: pgtype.Text{
						String: processingErr.Error(),

						Valid: true,
					},

					NextRetryAt: nextRetryAt,
				},
			)

	if err != nil {

		logger.Log.Error(
			"failed to mark payment webhook as failed",
			zap.Int32(
				"processing_attempts",
				processingAttempts,
			),
			zap.Error(
				err,
			),
			zap.NamedError(
				"processing_error",
				processingErr,
			),
		)

		return fmt.Errorf(
			"process payment webhook: %v; mark webhook failed: %w",
			processingErr,
			err,
		)
	}

	if shouldRetry {

		logger.Log.Warn(
			"payment webhook processing failed; retry scheduled",
			zap.String(
				"webhook_id",
				webhook.ProviderEventID,
			),
			zap.Int32(
				"processing_attempts",
				processingAttempts,
			),
			zap.Duration(
				"retry_delay",
				retryDelay,
			),
			zap.Time(
				"next_retry_at",
				nextRetryAt.Time,
			),
			zap.Error(
				processingErr,
			),
		)

	} else {

		logger.Log.Error(
			"payment webhook processing failed permanently",
			zap.String(
				"webhook_id",
				webhook.ProviderEventID,
			),
			zap.Int32(
				"processing_attempts",
				processingAttempts,
			),
			zap.Error(
				processingErr,
			),
		)
	}

	return processingErr
}

func paymentWebhookRetryDelay(
	attempt int32,
) (
	time.Duration,
	bool,
) {

	switch attempt {

	case 1:

		return 30 * time.Second,
			true

	case 2:

		return 2 * time.Minute,
			true

	case 3:

		return 10 * time.Minute,
			true

	case 4:

		return 30 * time.Minute,
			true

	default:

		return 0,
			false
	}
}
