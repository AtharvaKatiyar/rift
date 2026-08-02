package auth_test

import (
	"context"
	"testing"

	authpkg "github.com/AtharvaKatiyar/rift/internal/auth"
	"github.com/AtharvaKatiyar/rift/tests/helpers"
)

func setupAuthService(
	t *testing.T,
) *authpkg.Service {

	testDB :=
		helpers.SharedTestDatabase(
			t,
		)

	return &authpkg.Service{
		Queries: testDB.Queries,
		DB:      testDB.Pool,
		Secret:  "test-secret-key",
	}
}

func TestRegister(
	t *testing.T,
) {

	tests := []struct {
		name        string
		req         authpkg.RegisterRequest
		expectError bool
		errorMsg    string
	}{
		{
			name: "successful registration",
			req: authpkg.RegisterRequest{
				Email:    "user@example.com",
				Username: "riftuser",
				Password: "StrongPass123!",
			},
			expectError: false,
		},
		{
			name: "invalid email",
			req: authpkg.RegisterRequest{
				Email:    "invalid-email",
				Username: "riftuser2",
				Password: "StrongPass123!",
			},
			expectError: true,
		},
		{
			name: "invalid password",
			req: authpkg.RegisterRequest{
				Email:    "user2@example.com",
				Username: "riftuser3",
				Password: "weak",
			},
			expectError: true,
		},
		{
			name: "reserved username",
			req: authpkg.RegisterRequest{
				Email:    "user3@example.com",
				Username: "admin",
				Password: "StrongPass123!",
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

				accessToken,
					refreshToken,
					err :=
					service.Register(
						context.Background(),
						tt.req,
						"test-agent",
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

				user, err :=
					service.Queries.
						GetUserByEmail(
							context.Background(),
							tt.req.Email,
						)

				if err != nil {
					t.Fatalf(
						"user not persisted: %v",
						err,
					)
				}

				if user.Email !=
					tt.req.Email {

					t.Errorf(
						"expected email %s, got %s",
						tt.req.Email,
						user.Email,
					)
				}

				if user.Username !=
					tt.req.Username {

					t.Errorf(
						"expected username %s, got %s",
						tt.req.Username,
						user.Username,
					)
				}

				if !user.PasswordHash.Valid {
					t.Fatal(
						"password hash missing",
					)
				}

				err =
					authpkg.CheckPassword(
						user.PasswordHash.String,
						tt.req.Password,
					)

				if err != nil {
					t.Error(
						"password not hashed correctly",
					)
				}

				claims, err :=
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

				if claims.UserID !=
					user.ID.String() {

					t.Errorf(
						"expected refresh token user id %s, got %s",
						user.ID.String(),
						claims.UserID,
					)
				}

				hashedToken :=
					authpkg.HashToken(
						refreshToken,
					)

				storedToken, err :=
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

				if storedToken.UserID !=
					user.ID {

					t.Error(
						"refresh token linked to wrong user",
					)
				}
			},
		)
	}
}

func TestRegister_DuplicateEmail(
	t *testing.T,
) {

	service :=
		setupAuthService(
			t,
		)

	req :=
		authpkg.RegisterRequest{
			Email:    "duplicate@example.com",
			Username: "user1",
			Password: "StrongPass123!",
		}

	_, _, err :=
		service.Register(
			context.Background(),
			req,
			"test-agent",
			"127.0.0.1",
		)

	if err != nil {
		t.Fatalf(
			"unexpected error: %v",
			err,
		)
	}

	req.Username =
		"user2"

	_, _, err =
		service.Register(
			context.Background(),
			req,
			"test-agent",
			"127.0.0.1",
		)

	if err == nil {
		t.Fatal(
			"expected duplicate email error",
		)
	}
}

func TestRegister_DuplicateUsername(
	t *testing.T,
) {

	service :=
		setupAuthService(
			t,
		)

	req :=
		authpkg.RegisterRequest{
			Email:    "usera@example.com",
			Username: "sameuser",
			Password: "StrongPass123!",
		}

	_, _, err :=
		service.Register(
			context.Background(),
			req,
			"test-agent",
			"127.0.0.1",
		)

	if err != nil {
		t.Fatalf(
			"unexpected error: %v",
			err,
		)
	}

	req.Email =
		"userb@example.com"

	_, _, err =
		service.Register(
			context.Background(),
			req,
			"test-agent",
			"127.0.0.1",
		)

	if err == nil {
		t.Fatal(
			"expected duplicate username error",
		)
	}
}

func TestRegister_NormalizesInput(
	t *testing.T,
) {

	service :=
		setupAuthService(
			t,
		)

	req :=
		authpkg.RegisterRequest{
			Email:    "  USER@EXAMPLE.COM ",
			Username: "  TestUser ",
			Password: "StrongPass123!",
		}

	_, _, err :=
		service.Register(
			context.Background(),
			req,
			"test-agent",
			"127.0.0.1",
		)

	if err != nil {
		t.Fatalf(
			"unexpected error: %v",
			err,
		)
	}

	user, err :=
		service.Queries.
			GetUserByEmail(
				context.Background(),
				"user@example.com",
			)

	if err != nil {
		t.Fatalf(
			"failed to get user: %v",
			err,
		)
	}

	if user.Username !=
		"testuser" {

		t.Errorf(
			"expected normalized username testuser, got %s",
			user.Username,
		)
	}
}
