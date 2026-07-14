package subscription

import "time"

const (
	PlanFree    = "free"
	PlanStarter = "starter"
	PlanPro     = "pro"
)

const (
	PriceFree    int64 = 0
	PriceStarter int64 = 899
	PricePro     int64 = 1499
)

const (
	FreePlanLimit    int64 = 10
	StarterPlanLimit int64 = 50
	ProPlanLimit     int64 = 100
)

const (
	SubscriptionStatusActive = "active"
)

const (
	EventCheckoutCreated = "checkout_created"
)

const (
	MaxPaymentWebhookProcessingAttempts int32 = 5
)

const (
	PaymentWebhookProcessingStaleTimeout = 5 * time.Minute
)
