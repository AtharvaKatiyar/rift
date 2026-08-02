package auth

import (
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"encoding/hex"
	"time"
)

const (
	EmailVerificationTokenTTL = 24 * time.Hour

	emailVerificationTokenLength = 32
)

func GenerateEmailVerificationToken() (
	rawToken string,
	tokenHash string,
	err error,
) {

	token := make(
		[]byte,
		emailVerificationTokenLength,
	)

	_, err = rand.Read(
		token,
	)

	if err != nil {
		return "", "", err
	}

	rawToken = base64.RawURLEncoding.EncodeToString(
		token,
	)

	tokenHash = HashEmailVerificationToken(
		rawToken,
	)

	return
}

func HashEmailVerificationToken(
	token string,
) string {

	sum := sha256.Sum256(
		[]byte(token),
	)

	return hex.EncodeToString(
		sum[:],
	)
}
