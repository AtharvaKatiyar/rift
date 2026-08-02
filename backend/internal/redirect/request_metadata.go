package redirect

import (
	"strings"

	"github.com/gin-gonic/gin"
)

func getReferrer(
	c *gin.Context,
) string {

	referrer :=
		c.Request.Referer()

	if referrer == "" {
		return "direct"
	}

	return referrer
}

func getDevice(
	userAgent string,
) string {

	ua :=
		strings.ToLower(
			userAgent,
		)

	switch {

	case strings.Contains(
		ua,
		"mobile",
	):
		return "mobile"

	case strings.Contains(
		ua,
		"tablet",
	):
		return "tablet"

	default:
		return "desktop"
	}
}
