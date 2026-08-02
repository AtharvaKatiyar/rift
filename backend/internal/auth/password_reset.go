package auth

import (
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"encoding/hex"
	"time"
)

const (
	PasswordResetTokenBytes = 32

	PasswordResetTokenTTL = 30 * time.Minute
)

func GeneratePasswordResetToken() (
	rawToken string,
	tokenHash string,
	err error,
) {

	randomBytes := make(
		[]byte,
		PasswordResetTokenBytes,
	)

	_, err = rand.Read(
		randomBytes,
	)

	if err != nil {
		return "", "", err
	}

	rawToken =
		base64.RawURLEncoding.EncodeToString(
			randomBytes,
		)

	hash := sha256.Sum256(
		[]byte(rawToken),
	)

	tokenHash =
		hex.EncodeToString(
			hash[:],
		)

	return
}

func HashPasswordResetToken(
	token string,
) string {

	sum := sha256.Sum256(
		[]byte(token),
	)

	return hex.EncodeToString(
		sum[:],
	)
}
