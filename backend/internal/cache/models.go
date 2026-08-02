package cache

type RedirectCache struct {
	LinkID    string `json:"link_id"`
	TargetURL string `json:"target_url"`
	Username  string `json:"username"`
	Slug      string `json:"slug"`
	IsActive  bool   `json:"is_active"`
}
