package auth

import (
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

const (
	AccessTokenDuration  = 15 * time.Minute
	RefreshTokenDuration = 7 * 24 * time.Hour
)

type JWTClaims struct {
	UserID string `json:"user_id"`
	Email  string `json:"email"`
	Type   string `json:"type"`

	jwt.RegisteredClaims
}

func GenerateAccessToken(
	userID string,
	email string,
	secret string,
) (string, error) {

	return generateToken(
		userID,
		email,
		"access",
		AccessTokenDuration,
		secret,
	)
}

func GenerateRefreshToken(
	userID string,
	email string,
	secret string,
) (string, error) {

	return generateToken(
		userID,
		email,
		"refresh",
		RefreshTokenDuration,
		secret,
	)
}

func generateToken(
	userID string,
	email string,
	tokenType string,
	duration time.Duration,
	secret string,
) (string, error) {

	now := time.Now()

	claims := JWTClaims{
		UserID: userID,
		Email:  email,
		Type:   tokenType,

		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(
				now.Add(duration),
			),
			IssuedAt: jwt.NewNumericDate(
				now,
			),
			NotBefore: jwt.NewNumericDate(
				now,
			),
		},
	}

	token := jwt.NewWithClaims(
		jwt.SigningMethodHS256,
		claims,
	)

	return token.SignedString(
		[]byte(secret),
	)
}

func ValidateToken(
	tokenString string,
	secret string,
	expectedType string,
) (*JWTClaims, error) {

	token, err := jwt.ParseWithClaims(
		tokenString,
		&JWTClaims{},
		func(token *jwt.Token) (
			interface{},
			error,
		) {

			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil,
					errors.New(
						"unexpected signing method",
					)
			}

			return []byte(secret),
				nil
		},
	)

	if err != nil {
		return nil, err
	}

	claims, ok := token.Claims.(*JWTClaims)

	if !ok || !token.Valid {
		return nil,
			errors.New("invalid token")
	}

	if claims.Type != expectedType {
		return nil,
			errors.New("invalid token type")
	}

	return claims, nil
}
