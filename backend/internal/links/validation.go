package links

import (
	"errors"
	"net/url"
	"regexp"
)

var slugRegex = regexp.MustCompile(
	`^[a-z0-9_-]{3,50}$`,
)

func ValidateSlug(
	slug string,
) error {

	if !slugRegex.MatchString(
		slug,
	) {
		return errors.New(
			"invalid slug",
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

	return nil
}