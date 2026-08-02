package auth_test

import (
	"context"
	"testing"

	authpkg "github.com/AtharvaKatiyar/rift/internal/auth"
)

func TestRefreshSession(
	t *testing.T,
) {

	tests := []struct {
		name        string
		setupLogin  bool
		refreshFunc func(
			token string,
		) string
		expectError bool
	}{
		{
			name:        "successful refresh",
			setupLogin:  true,
			expectError: false,
		},
		{
			name:       "invalid token",
			setupLogin: false,
			refreshFunc: func(
				token string,
			) string {

				return "invalid-token"
			},
			expectError: true,
		},
		{
			name:       "tampered token",
			setupLogin: true,
			refreshFunc: func(
				token string,
			) string {

				return token +
					"tampered"
			},
			expectError: true,
		},
	}

	for _, tt := range tests {

		t.Run(
			tt.name,
			func(t *testing.T) {

				service :=
					setupAuthService(
						t,
					)

				var refreshToken string

				if tt.setupLogin {

					_, _, err :=
						service.Register(
							context.Background(),
							authpkg.RegisterRequest{
								Email:    "user@example.com",
								Username: "testuser",
								Password: "StrongPass123!",
							},
							"register-agent",
							"127.0.0.1",
						)

					if err != nil {
						t.Fatalf(
							"register failed: %v",
							err,
						)
					}

					_, refreshToken,
						err =
						service.Login(
							context.Background(),
							authpkg.LoginRequest{
								Email:    "user@example.com",
								Password: "StrongPass123!",
							},
							"login-agent",
							"127.0.0.1",
						)

					if err != nil {
						t.Fatalf(
							"login failed: %v",
							err,
						)
					}
				}

				if tt.refreshFunc != nil {

					refreshToken =
						tt.refreshFunc(
							refreshToken,
						)
				}

				newAccessToken,
					newRefreshToken,
					err :=
					service.RefreshSession(
						context.Background(),
						refreshToken,
						"refresh-agent",
						"127.0.0.1",
					)

				if tt.expectError {

					if err == nil {
						t.Fatal(
							"expected error but got nil",
						)
					}

					return
				}

				if err != nil {
					t.Fatalf(
						"unexpected error: %v",
						err,
					)
				}

				if newAccessToken == "" {
					t.Error(
						"expected access token",
					)
				}

				if newRefreshToken == "" {
					t.Error(
						"expected refresh token",
					)
				}

				_, err =
					authpkg.ValidateToken(
						newAccessToken,
						service.Secret,
						"access",
					)

				if err != nil {
					t.Fatalf(
						"invalid access token: %v",
						err,
					)
				}

				refreshClaims,
					err :=
					authpkg.ValidateToken(
						newRefreshToken,
						service.Secret,
						"refresh",
					)

				if err != nil {
					t.Fatalf(
						"invalid refresh token: %v",
						err,
					)
				}

				if refreshClaims.Email !=
					"user@example.com" {

					t.Errorf(
						"expected email user@example.com got %s",
						refreshClaims.Email,
					)
				}

				newHash :=
					authpkg.HashToken(
						newRefreshToken,
					)

				_, err =
					service.Queries.
						GetRefreshTokenForUpdate(
							context.Background(),
							newHash,
						)

				if err != nil {
					t.Fatalf(
						"new refresh token not stored: %v",
						err,
					)
				}
			},
		)
	}
}

func TestRefreshSession_RotatesToken(
	t *testing.T,
) {

	service :=
		setupAuthService(
			t,
		)

	_, _, err :=
		service.Register(
			context.Background(),
			authpkg.RegisterRequest{
				Email:    "user@example.com",
				Username: "testuser",
				Password: "StrongPass123!",
			},
			"register-agent",
			"127.0.0.1",
		)

	if err != nil {
		t.Fatalf(
			"register failed: %v",
			err,
		)
	}

	_, refreshToken,
		err :=
		service.Login(
			context.Background(),
			authpkg.LoginRequest{
				Email:    "user@example.com",
				Password: "StrongPass123!",
			},
			"login-agent",
			"127.0.0.1",
		)

	if err != nil {
		t.Fatalf(
			"login failed: %v",
			err,
		)
	}

	_, rotatedToken,
		err :=
		service.RefreshSession(
			context.Background(),
			refreshToken,
			"refresh-agent",
			"127.0.0.1",
		)

	if err != nil {
		t.Fatalf(
			"refresh failed: %v",
			err,
		)
	}

	if rotatedToken == "" {

		t.Fatal(
			"expected refresh token",
		)
	}

	oldHash :=
		authpkg.HashToken(
			refreshToken,
		)

	oldStoredToken,
		err :=
		service.Queries.
			GetRefreshTokenForUpdate(
				context.Background(),
				oldHash,
			)

	if err != nil {
		t.Fatalf(
			"failed fetching old token: %v",
			err,
		)
	}

	if !oldStoredToken.
		ReplacedByToken.Valid {

		t.Fatal(
			"expected replaced_by_token to be set",
		)
	}

	newHash :=
		authpkg.HashToken(
			rotatedToken,
		)

	if oldStoredToken.
		ReplacedByToken.String !=
		newHash {

		t.Fatalf(
			"expected replacement hash %s got %s",
			newHash,
			oldStoredToken.
				ReplacedByToken.String,
		)
	}
}
