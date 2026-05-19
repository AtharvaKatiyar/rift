package auth

import (
	"errors"
	"regexp"
	"strings"
)

var usernameRegex = regexp.MustCompile(
	`^[a-z0-9_-]{3,20}$`,
)

var emailRegex = regexp.MustCompile(
	`^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$`,
)

var lowercaseRegex = regexp.MustCompile(
	`[a-z]`,
)

var uppercaseRegex = regexp.MustCompile(
	`[A-Z]`,
)

var numberRegex = regexp.MustCompile(
	`[0-9]`,
)

var specialCharRegex = regexp.MustCompile(
	`[@$!%*?&]`,
)

var reservedUsernames = map[string]bool{
	"admin":     true,
	"login":     true,
	"api":       true,
	"settings":  true,
	"dashboard": true,
	"auth":      true,
	"u":         true,
}

func ValidateUsername(
	username string,
) error {

	if !usernameRegex.MatchString(
		username,
	) {
		return errors.New(
			"username must be 3-20 lowercase characters, numbers, or underscores",
		)
	}

	if reservedUsernames[username] {
		return errors.New(
			"username unavailable",
		)
	}

	return nil
}

func ValidateEmail(
	email string,
) error {

	email = strings.TrimSpace(
		strings.ToLower(email),
	)

	if !emailRegex.MatchString(
		email,
	) {
		return errors.New(
			"invalid email format",
		)
	}

	return nil
}

func ValidatePassword(
	password string,
) error {

	if len(password) < 8 {
		return errors.New(
			"password must be at least 8 characters",
		)
	}

	if !lowercaseRegex.MatchString(
		password,
	) {
		return errors.New(
			"password must contain a lowercase letter",
		)
	}

	if !uppercaseRegex.MatchString(
		password,
	) {
		return errors.New(
			"password must contain an uppercase letter",
		)
	}

	if !numberRegex.MatchString(
		password,
	) {
		return errors.New(
			"password must contain a number",
		)
	}

	if !specialCharRegex.MatchString(
		password,
	) {
		return errors.New(
			"password must contain a special character",
		)
	}

	return nil
}