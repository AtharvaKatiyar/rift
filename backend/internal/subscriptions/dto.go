package subscription

type SubscriptionResponse struct {
	Plan string `json:"plan"`
	Status string `json:"status"`
	LinkLimit int64 `json:"link_limit"`
	LinksUsed int64 `json:"links_used"`
	LinksRemaining int64 `json:"links_remaining"`
	CanCreateLinks bool `json:"can_create_links"`
	CanUpgradeTo []string `json:"can_upgrade_to"`
}

type UpgradeRequest struct {
	Plan string `json:"plan"`
}

type CheckoutRequest struct {
	Plan string `json:"plan"`
}

type CheckoutResponse struct {
	CheckoutID string `json:"checkout_id"`
	Plan string `json:"plan"`
	Price int64 `json:"price"`
	Message string `json:"message"`
}