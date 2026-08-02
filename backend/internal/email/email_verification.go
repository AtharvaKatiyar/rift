package email

type EmailVerificationRequest struct {
	To string

	Name string

	VerificationURL string

	ExpiryHours int
}
