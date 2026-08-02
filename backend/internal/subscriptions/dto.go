package subscription

type SubscriptionResponse struct {
	Plan           string   `json:"plan"`
	Status         string   `json:"status"`
	Price          int64    `json:"price"`
	LinkLimit      int64    `json:"link_limit"`
	LinksUsed      int64    `json:"links_used"`
	LinksRemaining int64    `json:"links_remaining"`
	UsagePercent   int64    `json:"usage_percent"`
	CanCreateLinks bool     `json:"can_create_links"`
	CanUpgradeTo   []string `json:"can_upgrade_to"`
	Features       []string `json:"features"`
}

type UpgradeRequest struct {
	Plan string `json:"plan"`
}

type CheckoutRequest struct {
	Plan string `json:"plan"`
}

type CheckoutResponse struct {
	CheckoutID  string `json:"checkout_id"`
	CheckoutURL string `json:"checkout_url"`
	Plan        string `json:"plan"`
	Price       int64  `json:"price"`
	Message     string `json:"message"`
}

type PaymentStatusResponse struct {
	CheckoutID string `json:"checkout_id"`
	Plan       string `json:"plan"`
	Status     string `json:"status"`
}

type CompleteCheckoutRequest struct {
	CheckoutID string `json:"checkout_id"`
}

type PlanResponse struct {
	Name      string `json:"name"`
	Price     int64  `json:"price"`
	LinkLimit int64  `json:"link_limit"`
}

type PlansResponse struct {
	Plans []PlanResponse `json:"plans"`
}
