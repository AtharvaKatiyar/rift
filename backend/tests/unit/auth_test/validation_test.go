package auth_test

import (
	"testing"

	"github.com/AtharvaKatiyar/rift/internal/auth"
)

func TestValidateUsername(
	t *testing.T,
) {

	tests := []struct {
		name        string
		username    string
		expectError bool
	}{
		{
			name:
				"valid username",
			username:
				"atharva_123",
			expectError:
				false,
		},
		{
			name:
				"valid with hyphen",
			username:
				"rift-user",
			expectError:
				false,
		},
		{
			name:
				"minimum length",
			username:
				"abc",
			expectError:
				false,
		},
		{
			name:
				"too short",
			username:
				"ab",
			expectError:
				true,
		},
		{
			name:
				"too long",
			username:
				"thisusernameiswaytoolong123",
			expectError:
				true,
		},
		{
			name:
				"contains uppercase",
			username:
				"RiftUser",
			expectError:
				true,
		},
		{
			name:
				"contains special characters",
			username:
				"user@name",
			expectError:
				true,
		},
		{
			name:
				"contains spaces",
			username:
				"rift user",
			expectError:
				true,
		},
		{
			name:
				"reserved admin",
			username:
				"admin",
			expectError:
				true,
		},
		{
			name:
				"reserved login",
			username:
				"login",
			expectError:
				true,
		},
		{
			name:
				"reserved auth",
			username:
				"auth",
			expectError:
				true,
		},
	}

	for _, tt := range tests {

		t.Run(
			tt.name,
			func(t *testing.T) {

				err :=
					auth.ValidateUsername(
						tt.username,
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

func TestValidateEmail(
	t *testing.T,
) {

	tests := []struct {
		name        string
		email       string
		expectError bool
	}{
		{
			name:
				"valid email",
			email:
				"user@example.com",
			expectError:
				false,
		},
		{
			name:
				"valid uppercase email",
			email:
				"USER@EXAMPLE.COM",
			expectError:
				false,
		},
		{
			name:
				"valid with spaces",
			email:
				"  user@example.com  ",
			expectError:
				false,
		},
		{
			name:
				"missing at symbol",
			email:
				"userexample.com",
			expectError:
				true,
		},
		{
			name:
				"missing domain",
			email:
				"user@",
			expectError:
				true,
		},
		{
			name:
				"missing username",
			email:
				"@example.com",
			expectError:
				true,
		},
		{
			name:
				"missing top level domain",
			email:
				"user@example",
			expectError:
				true,
		},
		{
			name:
				"empty email",
			email:
				"",
			expectError:
				true,
		},
		{
			name:
				"spaces only",
			email:
				"   ",
			expectError:
				true,
		},
	}

	for _, tt := range tests {

		t.Run(
			tt.name,
			func(t *testing.T) {

				err :=
					auth.ValidateEmail(
						tt.email,
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

func TestValidatePassword(
	t *testing.T,
) {

	tests := []struct {
		name        string
		password    string
		expectError bool
	}{
		{
			name:
				"valid password",
			password:
				"StrongPass123!",
			expectError:
				false,
		},
		{
			name:
				"minimum valid password",
			password:
				"Abc123!d",
			expectError:
				false,
		},
		{
			name:
				"too short",
			password:
				"A1!abc",
			expectError:
				true,
		},
		{
			name:
				"missing lowercase",
			password:
				"STRONG123!",
			expectError:
				true,
		},
		{
			name:
				"missing uppercase",
			password:
				"strong123!",
			expectError:
				true,
		},
		{
			name:
				"missing number",
			password:
				"StrongPass!",
			expectError:
				true,
		},
		{
			name:
				"missing special character",
			password:
				"StrongPass123",
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
				"spaces only",
			password:
				"        ",
			expectError:
				true,
		},
	}

	for _, tt := range tests {

		t.Run(
			tt.name,
			func(t *testing.T) {

				err :=
					auth.ValidatePassword(
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