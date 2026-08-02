package links

type CreateLinkRequest struct {
	Title     string `json:"title" binding:"required,max=100"`
	Slug      string `json:"slug" binding:"required"`
	TargetURL string `json:"target_url" binding:"required,url"`
}

type UpdateLinkRequest struct {
	Title     string `json:"title" binding:"required,max=100"`
	Slug      string `json:"slug" binding:"required"`
	TargetURL string `json:"target_url" binding:"required,url"`
}
