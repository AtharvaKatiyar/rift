package auth_test

import (
	"testing"

	"github.com/AtharvaKatiyar/rift/internal/auth"
)

func TestHashPassword(
	t *testing.T,
) {

	tests := []struct {
		name     string
		password string
	}{
		{
			name:
				"valid password",
			password:
				"StrongPass123!",
		},
		{
			name:
				"empty password",
			password:
				"",
		},
		{
			name:
				"long password",
			password:
				"ThisIsAVeryLongPassword123!@#$%^&*()",
		},
	}

	for _, tt := range tests {

		t.Run(
			tt.name,
			func(t *testing.T) {

				hashedPassword, err :=
					auth.HashPassword(
						tt.password,
					)

				if err != nil {
					t.Fatalf(
						"unexpected error: %v",
						err,
					)
				}

				if hashedPassword == "" {
					t.Fatal(
						"expected hashed password, got empty string",
					)
				}

				if hashedPassword == tt.password {
					t.Error(
						"hashed password should not equal plaintext password",
					)
				}
			},
		)
	}
}

func TestHashPassword_GeneratesDifferentHashes(
	t *testing.T,
) {

	password :=
		"StrongPassword123!"

	hash1, err :=
		auth.HashPassword(
			password,
		)

	if err != nil {
		t.Fatalf(
			"failed to hash password: %v",
			err,
		)
	}

	hash2, err :=
		auth.HashPassword(
			password,
		)

	if err != nil {
		t.Fatalf(
			"failed to hash password: %v",
			err,
		)
	}

	if hash1 == hash2 {
		t.Error(
			"expected different hashes for same password due to bcrypt salt",
		)
	}
}

func TestCheckPassword(
	t *testing.T,
) {

	validPassword :=
		"StrongPassword123!"

	hashedPassword, err :=
		auth.HashPassword(
			validPassword,
		)

	if err != nil {
		t.Fatalf(
			"failed to hash password: %v",
			err,
		)
	}

	tests := []struct {
		name        string
		password    string
		expectError bool
	}{
		{
			name:
				"correct password",
			password:
				validPassword,
			expectError:
				false,
		},
		{
			name:
				"wrong password",
			password:
				"WrongPassword123!",
			expectError:
				true,
		},
		{
			name:
				"empty password",
			password:
				"",
			expectError:
				true,
		},
		{
			name:
				"close but incorrect password",
			password:
				"strongpassword123!",
			expectError:
				true,
		},
	}

	for _, tt := range tests {

		t.Run(
			tt.name,
			func(t *testing.T) {

				err :=
					auth.CheckPassword(
						hashedPassword,
						tt.password,
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
			},
		)
	}
}