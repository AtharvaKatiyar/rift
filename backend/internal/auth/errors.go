package auth

import "errors"

var (

	ErrInvalidCredentials = errors.New(
		"invalid credentials",
	)

	ErrInvalidResetToken = errors.New(
		"invalid or expired reset token",
	)

	ErrInvalidVerificationToken = errors.New(
		"invalid or expired verification token",
	)

	ErrUserAlreadyExists = errors.New(
		"user already exists",
	)

	ErrUsernameTaken = errors.New(
		"username already taken",
	)
)