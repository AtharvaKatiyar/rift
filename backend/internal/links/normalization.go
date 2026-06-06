package links

import (
	"regexp"
	"strings"
)

var multipleSeparatorsRegex = regexp.MustCompile(
	`[-_]{2,}`,
)

func NormalizeSlug(
	slug string,
) string {

	slug = strings.TrimSpace(
		slug,
	)

	slug = strings.ToLower(
		slug,
	)

	slug = strings.ReplaceAll(
		slug,
		" ",
		"-",
	)

	slug = multipleSeparatorsRegex.ReplaceAllString(
		slug,
		"-",
	)

	slug = strings.Trim(
		slug,
		"-_",
	)

	return slug
}