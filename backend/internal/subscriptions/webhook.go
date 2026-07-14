package subscription

type WebhookHeaders struct {
	ID        string `json:"webhook_id"`
	Signature string `json:"webhook_signature"`
	Timestamp string `json:"webhook_timestamp"`
}

type WebhookEvent struct {
	ID   string           `json:"id"`
	Type string           `json:"type"`
	Data WebhookEventData `json:"data"`
}

type WebhookEventData struct {
	PaymentID         string            `json:"payment_id"`
	CheckoutSessionID string            `json:"checkout_session_id"`
	Status            string            `json:"status"`
	Customer          WebhookCustomer   `json:"customer"`
	ProductCart       []WebhookProduct  `json:"product_cart"`
	Metadata          map[string]string `json:"metadata"`
}

type WebhookCustomer struct {
	CustomerID string `json:"customer_id"`
	Email      string `json:"email"`
	Name       string `json:"name"`
}

type WebhookProduct struct {
	ProductID string `json:"product_id"`
	Quantity  int64  `json:"quantity"`
}

type WebhookResult struct {
	Processed bool
	Message   string
}
