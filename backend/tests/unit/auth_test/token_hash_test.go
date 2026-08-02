package auth_test

import (
	"testing"

	"github.com/AtharvaKatiyar/rift/internal/auth"
)

func TestHashToken(
	t *testing.T,
) {

	tests := []struct {
		name      string
		token     string
		expectLen int
	}{
		{
			name:      "normal token",
			token:     "sample-refresh-token",
			expectLen: 64,
		},
		{
			name:      "empty token",
			token:     "",
			expectLen: 64,
		},
		{
			name:      "long token",
			token:     "this-is-a-very-long-refresh-token-used-for-testing-purposes",
			expectLen: 64,
		},
	}

	for _, tt := range tests {

		t.Run(
			tt.name,
			func(t *testing.T) {

				hash :=
					auth.HashToken(
						tt.token,
					)

				if hash == "" {
					t.Fatal(
						"expected hash, got empty string",
					)
				}

				if len(hash) != tt.expectLen {
					t.Errorf(
						"expected hash length %d, got %d",
						tt.expectLen,
						len(hash),
					)
				}
			},
		)
	}
}

func TestHashToken_Deterministic(
	t *testing.T,
) {

	token :=
		"same-token"

	hash1 :=
		auth.HashToken(
			token,
		)

	hash2 :=
		auth.HashToken(
			token,
		)

	if hash1 != hash2 {
		t.Error(
			"expected same input to generate same hash",
		)
	}
}

func TestHashToken_DifferentInputs(
	t *testing.T,
) {

	hash1 :=
		auth.HashToken(
			"token-1",
		)

	hash2 :=
		auth.HashToken(
			"token-2",
		)

	if hash1 == hash2 {
		t.Error(
			"expected different inputs to generate different hashes",
		)
	}
}

func TestHashToken_HexOutput(
	t *testing.T,
) {

	hash :=
		auth.HashToken(
			"test-token",
		)

	for _, ch := range hash {

		isHex :=
			(ch >= '0' && ch <= '9') ||
				(ch >= 'a' && ch <= 'f')

		if !isHex {
			t.Fatalf(
				"hash contains non-hex character: %c",
				ch,
			)
		}
	}
}
