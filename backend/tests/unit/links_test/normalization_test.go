package links_test

import (
	"testing"

	"github.com/AtharvaKatiyar/rift/internal/links"
)

func TestNormalizeSlug(
	t *testing.T,
) {

	tests := []struct {
		name     string
		input    string
		expected string
	}{
		{
			name:
				"already normalized",
			input:
				"my-slug",
			expected:
				"my-slug",
		},
		{
			name:
				"trim spaces",
			input:
				"   my-slug   ",
			expected:
				"my-slug",
		},
		{
			name:
				"convert uppercase to lowercase",
			input:
				"My-Slug",
			expected:
				"my-slug",
		},
		{
			name:
				"replace spaces with hyphens",
			input:
				"my custom slug",
			expected:
				"my-custom-slug",
		},
		{
			name:
				"collapse multiple hyphens",
			input:
				"my---slug",
			expected:
				"my-slug",
		},
		{
			name:
				"collapse multiple underscores",
			input:
				"my___slug",
			expected:
				"my-slug",
		},
		{
			name:
				"collapse mixed separators",
			input:
				"my-_--__slug",
			expected:
				"my-slug",
		},
		{
			name:
				"trim leading separators",
			input:
				"---my-slug",
			expected:
				"my-slug",
		},
		{
			name:
				"trim trailing separators",
			input:
				"my-slug___",
			expected:
				"my-slug",
		},
		{
			name:
				"trim both sides",
			input:
				"___my-slug---",
			expected:
				"my-slug",
		},
		{
			name:
				"mixed ugly slug",
			input:
				"  My___Awesome---SLUG  ",
			expected:
				"my-awesome-slug",
		},
		{
			name:
				"single word",
			input:
				"Rift",
			expected:
				"rift",
		},
		{
			name:
				"empty string",
			input:
				"",
			expected:
				"",
		},
		{
			name:
				"spaces only",
			input:
				"     ",
			expected:
				"",
		},
	}

	for _, tt := range tests {

		t.Run(
			tt.name,
			func(t *testing.T) {

				result :=
					links.NormalizeSlug(
						tt.input,
					)

				if result != tt.expected {
					t.Errorf(
						"expected %q, got %q",
						tt.expected,
						result,
					)
				}
			},
		)
	}
}