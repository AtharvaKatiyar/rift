package email

type PasswordResetRequest struct {
	To string

	Name string

	ResetURL string

	ExpiryMinutes int
}