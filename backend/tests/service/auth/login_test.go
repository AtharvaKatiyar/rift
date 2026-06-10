package auth_test

import (
	"context"
	"testing"

	authpkg "github.com/AtharvaKatiyar/rift/internal/auth"
)

func TestLogin(
	t *testing.T,
) {

	tests := []struct {
		name          string
		setupUser     bool
		loginReq      authpkg.LoginRequest
		expectError   bool
		expectedError string
	}{
		{
			name:
				"successful login",
			setupUser:
				true,
			loginReq:
				authpkg.LoginRequest{
					Email:
						"user@example.com",
					Password:
						"StrongPass123!",
				},
			expectError:
				false,
		},
		{
			name:
				"wrong password",
			setupUser:
				true,
			loginReq:
				authpkg.LoginRequest{
					Email:
						"user@example.com",
					Password:
						"WrongPassword123!",
				},
			expectError:
				true,
			expectedError:
				"invalid credentials",
		},
		{
			name:
				"nonexistent user",
			setupUser:
				false,
			loginReq:
				authpkg.LoginRequest{
					Email:
						"nouser@example.com",
					Password:
						"StrongPass123!",
				},
			expectError:
				true,
			expectedError:
				"invalid credentials",
		},
		{
			name:
				"email normalization",
			setupUser:
				true,
			loginReq:
				authpkg.LoginRequest{
					Email:
						"  USER@EXAMPLE.COM ",
					Password:
						"StrongPass123!",
				},
			expectError:
				false,
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

				if tt.setupUser {

					_, _, err :=
						service.Register(
							context.Background(),
							authpkg.RegisterRequest{
								Email:
									"user@example.com",
								Username:
									"testuser",
								Password:
									"StrongPass123!",
							},
							"register-agent",
							"127.0.0.1",
						)

					if err != nil {
						t.Fatalf(
							"failed to setup user: %v",
							err,
						)
					}
				}

				accessToken,
					refreshToken,
					err :=
					service.Login(
						context.Background(),
						tt.loginReq,
						"login-agent",
						"127.0.0.1",
					)

				if tt.expectError {

					if err == nil {
						t.Fatal(
							"expected error but got nil",
						)
					}

					if err.Error() !=
						tt.expectedError {

						t.Fatalf(
							"expected error %q got %q",
							tt.expectedError,
							err.Error(),
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

				if accessToken == "" {
					t.Error(
						"expected access token",
					)
				}

				if refreshToken == "" {
					t.Error(
						"expected refresh token",
					)
				}

				accessClaims,
					err :=
					authpkg.ValidateToken(
						accessToken,
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
						refreshToken,
						service.Secret,
						"refresh",
					)

				if err != nil {
					t.Fatalf(
						"invalid refresh token: %v",
						err,
					)
				}

				if accessClaims.Email !=
					"user@example.com" {

					t.Errorf(
						"expected email user@example.com, got %s",
						accessClaims.Email,
					)
				}

				if refreshClaims.Email !=
					"user@example.com" {

					t.Errorf(
						"expected refresh email user@example.com, got %s",
						refreshClaims.Email,
					)
				}

				hashedToken :=
					authpkg.HashToken(
						refreshToken,
					)

				storedToken,
					err :=
					service.Queries.
						GetRefreshTokenForUpdate(
							context.Background(),
							hashedToken,
						)

				if err != nil {
					t.Fatalf(
						"refresh token not persisted: %v",
						err,
					)
				}

				if !storedToken.UserAgent.Valid {
					t.Error(
						"user agent missing",
					)
				}

				if storedToken.UserAgent.String !=
					"login-agent" {

					t.Errorf(
						"expected user agent login-agent got %s",
						storedToken.UserAgent.String,
					)
				}

				if !storedToken.IpAddress.Valid {
					t.Error(
						"ip address missing",
					)
				}

				if storedToken.IpAddress.String !=
					"127.0.0.1" {

					t.Errorf(
						"expected ip 127.0.0.1 got %s",
						storedToken.IpAddress.String,
					)
				}
			},
		)
	}
}

func TestLogin_CreatesNewSessionEachTime(
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
				Email:
					"user@example.com",
				Username:
					"testuser",
				Password:
					"StrongPass123!",
			},
			"register-agent",
			"127.0.0.1",
		)

	if err != nil {
		t.Fatalf(
			"setup failed: %v",
			err,
		)
	}

	_, refresh1, err :=
		service.Login(
			context.Background(),
			authpkg.LoginRequest{
				Email:
					"user@example.com",
				Password:
					"StrongPass123!",
			},
			"agent-1",
			"127.0.0.1",
		)

	if err != nil {
		t.Fatalf(
			"login 1 failed: %v",
			err,
		)
	}

	_, refresh2, err :=
		service.Login(
			context.Background(),
			authpkg.LoginRequest{
				Email:
					"user@example.com",
				Password:
					"StrongPass123!",
			},
			"agent-2",
			"127.0.0.2",
		)

	if err != nil {
		t.Fatalf(
			"login 2 failed: %v",
			err,
		)
	}

	if refresh1 ==
		refresh2 {

		t.Fatal(
			"expected unique refresh tokens",
		)
	}
}