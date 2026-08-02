package analytics

import (
	"strings"

	"github.com/gin-gonic/gin"
)

type ParsedAnalytics struct {
	Referrer  string
	Browser   string
	OS        string
	Device    string
	IPAddress string
}

func ParseRequest(
	c *gin.Context,
) ParsedAnalytics {

	userAgent :=
		c.Request.UserAgent()

	return ParsedAnalytics{
		Referrer: c.Request.Referer(),

		Browser: parseBrowser(
			userAgent,
		),

		OS: parseOS(
			userAgent,
		),

		Device: parseDevice(
			userAgent,
		),

		IPAddress: c.ClientIP(),
	}
}

func parseBrowser(
	ua string,
) string {

	switch {

	case strings.Contains(
		ua,
		"Edg",
	):
		return "Edge"

	case strings.Contains(
		ua,
		"Chrome",
	):
		return "Chrome"

	case strings.Contains(
		ua,
		"Firefox",
	):
		return "Firefox"

	case strings.Contains(
		ua,
		"Safari",
	):
		return "Safari"

	case strings.Contains(
		ua,
		"curl",
	):
		return "curl"

	default:
		return "Unknown"
	}
}

func parseOS(
	ua string,
) string {

	switch {

	case strings.Contains(
		ua,
		"Android",
	):
		return "Android"

	case strings.Contains(
		ua,
		"iPhone",
	):
		return "iOS"

	case strings.Contains(
		ua,
		"Windows",
	):
		return "Windows"

	case strings.Contains(
		ua,
		"Mac OS",
	):
		return "macOS"

	case strings.Contains(
		ua,
		"Linux",
	):
		return "Linux"

	default:
		return "Unknown"
	}
}
func parseDevice(
	ua string,
) string {

	switch {

	case strings.Contains(
		ua,
		"Mobile",
	):
		return "mobile"

	case strings.Contains(
		ua,
		"Tablet",
	):
		return "tablet"

	default:
		return "desktop"
	}
}
