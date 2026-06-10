package auth_test

import (
	"testing"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"

	auth "github.com/AtharvaKatiyar/rift/internal/auth"
)

const testJWTSecret = "super-secret-test-key"

func TestGenerateAccessToken(
	t *testing.T,
) {

	userID := "user-123"
	email := "test@test.com"

	token, err :=
		auth.GenerateAccessToken(
			userID,
			email,
			testJWTSecret,
		)

	require.NoError(
		t,
		err,
	)

	require.NotEmpty(
		t,
		token,
	)

	claims, err :=
		auth.ValidateToken(
			token,
			testJWTSecret,
			"access",
		)

	require.NoError(
		t,
		err,
	)

	assert.Equal(
		t,
		userID,
		claims.UserID,
	)

	assert.Equal(
		t,
		email,
		claims.Email,
	)

	assert.Equal(
		t,
		"access",
		claims.Type,
	)

	require.NotNil(
		t,
		claims.ExpiresAt,
	)

	duration :=
		claims.ExpiresAt.Time.
			Sub(time.Now())

	assert.True(
		t,
		duration <= auth.AccessTokenDuration,
	)

	assert.True(
		t,
		duration >
			auth.AccessTokenDuration-
				time.Minute,
	)
}

func TestGenerateRefreshToken(
	t *testing.T,
) {

	userID := "user-456"
	email := "refresh@test.com"

	token, err :=
		auth.GenerateRefreshToken(
			userID,
			email,
			testJWTSecret,
		)

	require.NoError(
		t,
		err,
	)

	require.NotEmpty(
		t,
		token,
	)

	claims, err :=
		auth.ValidateToken(
			token,
			testJWTSecret,
			"refresh",
		)

	require.NoError(
		t,
		err,
	)

	assert.Equal(
		t,
		userID,
		claims.UserID,
	)

	assert.Equal(
		t,
		email,
		claims.Email,
	)

	assert.Equal(
		t,
		"refresh",
		claims.Type,
	)
}

func TestValidateToken_InvalidSecret(
	t *testing.T,
) {

	token, err :=
		auth.GenerateAccessToken(
			"user-id",
			"test@test.com",
			testJWTSecret,
		)

	require.NoError(
		t,
		err,
	)

	claims, err :=
		auth.ValidateToken(
			token,
			"wrong-secret",
			"access",
		)

	assert.Nil(
		t,
		claims,
	)

	assert.Error(
		t,
		err,
	)
}

func TestValidateToken_WrongTokenType(
	t *testing.T,
) {

	token, err :=
		auth.GenerateRefreshToken(
			"user-id",
			"test@test.com",
			testJWTSecret,
		)

	require.NoError(
		t,
		err,
	)

	claims, err :=
		auth.ValidateToken(
			token,
			testJWTSecret,
			"access",
		)

	assert.Nil(
		t,
		claims,
	)

	require.Error(
		t,
		err,
	)

	assert.Equal(
		t,
		"invalid token type",
		err.Error(),
	)
}

func TestValidateToken_TamperedToken(
	t *testing.T,
) {

	token, err :=
		auth.GenerateAccessToken(
			"user-id",
			"test@test.com",
			testJWTSecret,
		)

	require.NoError(
		t,
		err,
	)

	tampered :=
		token + "tampered"

	claims, err :=
		auth.ValidateToken(
			tampered,
			testJWTSecret,
			"access",
		)

	assert.Nil(
		t,
		claims,
	)

	assert.Error(
		t,
		err,
	)
}

func TestValidateToken_ExpiredToken(
	t *testing.T,
) {

	now := time.Now()

	claims :=
		auth.JWTClaims{
			UserID:
				"user-id",

			Email:
				"expired@test.com",

			Type:
				"access",

			RegisteredClaims:
				jwt.RegisteredClaims{
					ExpiresAt:
						jwt.NewNumericDate(
							now.Add(
								-1 *
									time.Hour,
							),
						),

					IssuedAt:
						jwt.NewNumericDate(
							now.Add(
								-2 *
									time.Hour,
							),
						),

					NotBefore:
						jwt.NewNumericDate(
							now.Add(
								-2 *
									time.Hour,
							),
						),
				},
		}

	token :=
		jwt.NewWithClaims(
			jwt.SigningMethodHS256,
			claims,
		)

	signedToken, err :=
		token.SignedString(
			[]byte(
				testJWTSecret,
			),
		)

	require.NoError(
		t,
		err,
	)

	parsedClaims, err :=
		auth.ValidateToken(
			signedToken,
			testJWTSecret,
			"access",
		)

	assert.Nil(
		t,
		parsedClaims,
	)

	assert.Error(
		t,
		err,
	)
}

func TestValidateToken_InvalidString(
	t *testing.T,
) {

	claims, err :=
		auth.ValidateToken(
			"not-a-jwt",
			testJWTSecret,
			"access",
		)

	assert.Nil(
		t,
		claims,
	)

	assert.Error(
		t,
		err,
	)
}