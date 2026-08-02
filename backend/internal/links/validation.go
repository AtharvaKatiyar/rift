package links

import (
	"errors"
	"net/url"
	"regexp"
)

var slugRegex = regexp.MustCompile(
	`^[a-z0-9]+(?:[-_][a-z0-9]+)*$`,
)

var reservedSlugs = map[string]bool{
	"api":       true,
	"auth":      true,
	"login":     true,
	"register":  true,
	"dashboard": true,
	"admin":     true,
	"settings":  true,
	"health":    true,
}

func ValidateSlug(
	slug string,
) error {

	slug = NormalizeSlug(
		slug,
	)

	if !slugRegex.MatchString(
		slug,
	) {
		return errors.New(
			"invalid slug",
		)
	}

	if reservedSlugs[slug] {
		return errors.New(
			"slug unavailable",
		)
	}

	return nil
}

func ValidateURL(
	rawURL string,
) error {

	parsedURL, err := url.ParseRequestURI(
		rawURL,
	)

	if err != nil {
		return errors.New(
			"invalid URL",
		)
	}

	if parsedURL.Scheme != "http" &&
		parsedURL.Scheme != "https" {

		return errors.New(
			"only http/https URLs allowed",
		)
	}

	if parsedURL.Host == "" {
		return errors.New(
			"invalid URL host",
		)
	}

	return nil
}
