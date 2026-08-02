package utils_test

import (
	"testing"

	"github.com/AtharvaKatiyar/rift/internal/utils"
)

func TestGeneratePublicKey(
	t *testing.T,
) {

	tests := []struct {
		name string
	}{
		{
			name: "generate key",
		},
	}

	for _, tt := range tests {

		t.Run(
			tt.name,
			func(t *testing.T) {

				key, err :=
					utils.GeneratePublicKey()

				if err != nil {
					t.Fatalf(
						"unexpected error: %v",
						err,
					)
				}

				if key == "" {
					t.Fatal(
						"expected key, got empty string",
					)
				}

				if len(key) != utils.DefaultKeySize {
					t.Errorf(
						"expected key length %d, got %d",
						utils.DefaultKeySize,
						len(key),
					)
				}
			},
		)
	}
}

func TestGeneratePublicKey_UsesValidCharset(
	t *testing.T,
) {

	key, err :=
		utils.GeneratePublicKey()

	if err != nil {
		t.Fatalf(
			"unexpected error: %v",
			err,
		)
	}

	validChars :=
		"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

	for _, ch := range key {

		found := false

		for _, validCh := range validChars {

			if ch == validCh {
				found = true
				break
			}
		}

		if !found {
			t.Fatalf(
				"invalid character in key: %c",
				ch,
			)
		}
	}
}

func TestGeneratePublicKey_Unique(
	t *testing.T,
) {

	const iterations = 100

	keys :=
		make(
			map[string]bool,
		)

	for i := 0; i < iterations; i++ {

		key, err :=
			utils.GeneratePublicKey()

		if err != nil {
			t.Fatalf(
				"unexpected error: %v",
				err,
			)
		}

		if keys[key] {
			t.Fatalf(
				"duplicate key generated: %s",
				key,
			)
		}

		keys[key] = true
	}
}
