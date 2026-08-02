package links_test

import (
	"testing"

	"github.com/AtharvaKatiyar/rift/internal/links"
)

func TestValidateSlug(
	t *testing.T,
) {

	tests := []struct {
		name        string
		slug        string
		expectError bool
	}{
		{
			name:        "valid slug",
			slug:        "my-slug",
			expectError: false,
		},
		{
			name:        "valid underscore slug",
			slug:        "my_slug",
			expectError: false,
		},
		{
			name:        "valid mixed slug",
			slug:        "my-slug_123",
			expectError: false,
		},
		{
			name:        "uppercase gets normalized",
			slug:        "My-Slug",
			expectError: false,
		},
		{
			name:        "spaces get normalized",
			slug:        "my custom slug",
			expectError: false,
		},
		{
			name:        "multiple separators normalized",
			slug:        "my---slug___test",
			expectError: false,
		},
		{
			name:        "leading trailing separators normalized",
			slug:        "___my-slug---",
			expectError: false,
		},
		{
			name:        "contains invalid special character",
			slug:        "my@slug",
			expectError: true,
		},
		{
			name:        "contains slash",
			slug:        "my/slug",
			expectError: true,
		},
		{
			name:        "contains punctuation",
			slug:        "my.slug",
			expectError: true,
		},
		{
			name:        "empty slug",
			slug:        "",
			expectError: true,
		},
		{
			name:        "spaces only",
			slug:        "    ",
			expectError: true,
		},
		{
			name:        "only separators",
			slug:        "---___---",
			expectError: true,
		},
		{
			name:        "reserved api",
			slug:        "api",
			expectError: true,
		},
		{
			name:        "reserved auth",
			slug:        "auth",
			expectError: true,
		},
		{
			name:        "reserved login",
			slug:        "login",
			expectError: true,
		},
		{
			name:        "reserved register",
			slug:        "register",
			expectError: true,
		},
		{
			name:        "reserved admin",
			slug:        "admin",
			expectError: true,
		},
	}

	for _, tt := range tests {

		t.Run(
			tt.name,
			func(t *testing.T) {

				err :=
					links.ValidateSlug(
						tt.slug,
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

func TestValidateURL(
	t *testing.T,
) {

	tests := []struct {
		name        string
		rawURL      string
		expectError bool
	}{
		{
			name:        "valid https url",
			rawURL:      "https://example.com",
			expectError: false,
		},
		{
			name:        "valid http url",
			rawURL:      "http://example.com",
			expectError: false,
		},
		{
			name:        "valid url with path",
			rawURL:      "https://example.com/test/path",
			expectError: false,
		},
		{
			name:        "valid localhost",
			rawURL:      "http://localhost:3000",
			expectError: false,
		},
		{
			name:        "valid ip address",
			rawURL:      "http://127.0.0.1:8080",
			expectError: false,
		},
		{
			name:        "missing scheme",
			rawURL:      "example.com",
			expectError: true,
		},
		{
			name:        "unsupported ftp scheme",
			rawURL:      "ftp://example.com",
			expectError: true,
		},
		{
			name:        "unsupported javascript scheme",
			rawURL:      "javascript:alert(1)",
			expectError: true,
		},
		{
			name:        "missing host",
			rawURL:      "https://",
			expectError: true,
		},
		{
			name:        "malformed url",
			rawURL:      "http://[invalid",
			expectError: true,
		},
		{
			name:        "empty url",
			rawURL:      "",
			expectError: true,
		},
		{
			name:        "spaces only",
			rawURL:      "     ",
			expectError: true,
		},
	}

	for _, tt := range tests {

		t.Run(
			tt.name,
			func(t *testing.T) {

				err :=
					links.ValidateURL(
						tt.rawURL,
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
