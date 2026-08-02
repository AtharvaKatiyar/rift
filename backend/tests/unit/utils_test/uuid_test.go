package utils_test

import (
	"testing"

	"github.com/AtharvaKatiyar/rift/internal/utils"
)

func TestParseUUID(
	t *testing.T,
) {

	tests := []struct {
		name        string
		input       string
		expectError bool
	}{
		{
			name:        "valid uuid",
			input:       "123e4567-e89b-12d3-a456-426614174000",
			expectError: false,
		},
		{
			name:        "invalid uuid",
			input:       "invalid-uuid",
			expectError: true,
		},
		{
			name:        "empty string",
			input:       "",
			expectError: true,
		},
		{
			name:        "malformed uuid",
			input:       "12345",
			expectError: true,
		},
		{
			name:        "missing sections",
			input:       "123e4567-e89b",
			expectError: true,
		},
	}

	for _, tt := range tests {

		t.Run(
			tt.name,
			func(t *testing.T) {

				parsedUUID, err :=
					utils.ParseUUID(
						tt.input,
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

				if !parsedUUID.Valid {
					t.Error(
						"expected UUID to be valid",
					)
				}
			},
		)
	}
}

func TestParseUUID_CorrectBytes(
	t *testing.T,
) {

	input :=
		"123e4567-e89b-12d3-a456-426614174000"

	parsedUUID, err :=
		utils.ParseUUID(
			input,
		)

	if err != nil {
		t.Fatalf(
			"unexpected error: %v",
			err,
		)
	}

	if !parsedUUID.Valid {
		t.Fatal(
			"expected UUID to be valid",
		)
	}

	result :=
		parsedUUID.String()

	if result != input {
		t.Errorf(
			"expected UUID %s, got %s",
			input,
			result,
		)
	}
}
