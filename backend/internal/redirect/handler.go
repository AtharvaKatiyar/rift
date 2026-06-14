package redirect

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type Handler struct {
	Service *Service
}

func (h *Handler) Redirect(
	c *gin.Context,
) {

	username := c.Param(
		"username",
	)

	slug := c.Param(
		"slug",
	)

	key := c.Param(
		"key",
	)

	targetURL,
	linkID,
	err :=
		h.Service.ResolveRedirect(
			c.Request.Context(),
			username,
			slug,
			key,
		)

	if err != nil {

		status := http.StatusNotFound

		if err.Error() == "invalid link" {
			status = http.StatusBadRequest
		}

		c.JSON(
			status,
			gin.H{
				"error": err.Error(),
			},
		)

		return
	}

	if h.Service.Analytics != nil {

		go h.Service.Analytics.TrackClick(
			c.Request.Context(),
			linkID,
			c,
		)
	}

	c.Redirect(
		http.StatusTemporaryRedirect,
		targetURL,
	)
}