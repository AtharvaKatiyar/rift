package subscription

import "context"

type CheckoutSession struct {
	CheckoutID  string
	CheckoutURL string
}

type PaymentProvider interface {
	CreateCheckout(
		ctx context.Context,
		userID string,
		plan string,
	) (*CheckoutSession, error)

	ParseWebhook(
		payload []byte,
		headers WebhookHeaders,
	) (
		*WebhookEvent,
		error,
	)

	DecodeWebhook(
		payload []byte,
	) (*WebhookEvent, error)
}
