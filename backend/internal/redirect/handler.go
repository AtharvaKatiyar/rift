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

	targetURL, err :=
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

	c.Redirect(
		http.StatusTemporaryRedirect,
		targetURL,
	)
}