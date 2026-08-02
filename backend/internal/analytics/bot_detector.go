package analytics

import "strings"

var botKeywords = []string{
	"bot",
	"crawler",
	"spider",
	"curl",
	"wget",
	"headless",
	"uptime",
	"monitor",
	"facebookexternalhit",
	"discordbot",
	"twitterbot",
	"slackbot",
	"linkedinbot",
	"whatsapp",
	"telegrambot",
	"googlebot",
	"bingbot",
}

func IsBot(
	userAgent string,
) bool {

	ua :=
		strings.ToLower(
			userAgent,
		)

	for _, keyword := range botKeywords {

		if strings.Contains(
			ua,
			keyword,
		) {
			return true
		}
	}

	return false
}
