package auth_test

import (
	"context"
	"testing"

	authpkg "github.com/AtharvaKatiyar/rift/internal/auth"
)

func TestLogout(
	t *testing.T,
) {

	tests := []struct {
		name          string
		setupLogin    bool
		tokenModifier func(
			token string,
		) string
		expectError bool
	}{
		{
			name:
				"successful logout",
			setupLogin:
				true,
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

				var refreshToken string

				if tt.setupLogin {

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
							"register failed: %v",
							err,
						)
					}

					_, refreshToken,
						err =
						service.Login(
							context.Background(),
							authpkg.LoginRequest{
								Email:
									"user@example.com",
								Password:
									"StrongPass123!",
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

				err :=
					service.Logout(
						context.Background(),
						refreshToken,
					)

				if err != nil {
					t.Fatalf(
						"unexpected error: %v",
						err,
					)
				}

				hashedToken :=
					authpkg.HashToken(
						refreshToken,
					)

				_, err =
					service.Queries.
						GetRefreshTokenForUpdate(
							context.Background(),
							hashedToken,
						)

				if err == nil {
					t.Fatal(
						"expected token deletion after logout",
					)
				}
			},
		)
	}
}

func TestLogout_InvalidatesSession(
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
			"register failed: %v",
			err,
		)
	}

	_, refreshToken,
		err :=
		service.Login(
			context.Background(),
			authpkg.LoginRequest{
				Email:
					"user@example.com",
				Password:
					"StrongPass123!",
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

	err =
		service.Logout(
			context.Background(),
			refreshToken,
		)

	if err != nil {
		t.Fatalf(
			"logout failed: %v",
			err,
		)
	}

	_, _, err =
		service.RefreshSession(
			context.Background(),
			refreshToken,
			"refresh-agent",
			"127.0.0.1",
		)

	if err == nil {
		t.Fatal(
			"expected refresh failure after logout",
		)
	}
}