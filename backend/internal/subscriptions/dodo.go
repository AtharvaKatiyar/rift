package subscription

import (
	"context"
	"encoding/json"
	"net/http"

	standardwebhooks "github.com/standard-webhooks/standard-webhooks/libraries/go"

	"github.com/dodopayments/dodopayments-go"
)

type DodoProvider struct {
	Client *dodopayments.Client

	StarterProductID string
	ProProductID     string

	SuccessURL string

	WebhookSecret string
}

func (
	p *DodoProvider,
) CreateCheckout(
	ctx context.Context,
	userID string,
	plan string,
) (
	*CheckoutSession,
	error,
) {

	productID :=
		p.getProductID(
			plan,
		)

	if productID == "" {
		return nil,
			ErrInvalidPlan
	}

	res, err :=
		p.Client.
			CheckoutSessions.
			New(
				ctx,
				dodopayments.CheckoutSessionNewParams{
					CheckoutSessionRequest: dodopayments.CheckoutSessionRequestParam{

						ProductCart: dodopayments.F(
							[]dodopayments.ProductItemReqParam{
								{
									ProductID: dodopayments.F(
										productID,
									),

									Quantity: dodopayments.F(
										int64(1),
									),
								},
							},
						),

						ReturnURL: dodopayments.F(
							p.SuccessURL,
						),
					},
				},
			)

	if err != nil {
		return nil, err
	}

	return &CheckoutSession{
		CheckoutID: res.SessionID,

		CheckoutURL: res.CheckoutURL,
	}, nil
}

// func (
// 	p *DodoProvider,
// ) VerifyWebhook(
// 	payload []byte,
// 	signature string,
// ) error {

// 	return nil
// }

func (
	p *DodoProvider,
) ParseWebhook(
	payload []byte,
	headers WebhookHeaders,
) (
	*WebhookEvent,
	error,
) {

	verifier, err :=
		standardwebhooks.NewWebhook(
			p.WebhookSecret,
		)

	if err != nil {
		return nil, err
	}

	httpHeaders :=
		http.Header{}

	httpHeaders.Set(
		standardwebhooks.HeaderWebhookID,
		headers.ID,
	)

	httpHeaders.Set(
		standardwebhooks.HeaderWebhookSignature,
		headers.Signature,
	)

	httpHeaders.Set(
		standardwebhooks.HeaderWebhookTimestamp,
		headers.Timestamp,
	)

	err =
		verifier.Verify(
			payload,
			httpHeaders,
		)

	if err != nil {
		return nil, err
	}

	return p.DecodeWebhook(
		payload,
	)
}

func (
	p *DodoProvider,
) DecodeWebhook(
	payload []byte,
) (
	*WebhookEvent,
	error,
) {

	var event WebhookEvent

	err :=
		json.Unmarshal(
			payload,
			&event,
		)

	if err != nil {
		return nil, err
	}

	return &event, nil
}

func (
	p *DodoProvider,
) getProductID(
	plan string,
) string {

	switch plan {

	case PlanStarter:
		return p.StarterProductID

	case PlanPro:
		return p.ProProductID

	default:
		return ""
	}
}
