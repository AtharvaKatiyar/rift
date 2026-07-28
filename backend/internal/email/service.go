package email

import (
	"context"
)

type Service interface {
	SendPasswordResetEmail(
		ctx context.Context,
		request PasswordResetRequest,
	) error

	SendEmailVerificationEmail(
		ctx context.Context,
		req	EmailVerificationRequest,
	) error
}