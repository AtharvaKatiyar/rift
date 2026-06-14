package analytics

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type Handler struct {
	Service *Service
}

func (h *Handler) GetLinkAnalytics(
	c *gin.Context,
) {

	linkID := c.Param(
		"id",
	)

	userID :=
		c.GetString(
			"user_id",
		)

	rangeParam :=
		c.DefaultQuery(
			"range",
			"all",
		)

	analytics, err :=
		h.Service.GetLinkAnalytics(
			c.Request.Context(),
			linkID,
			userID,
			rangeParam,
		)

	if err != nil {
		status :=
			http.StatusInternalServerError
		if err.Error() ==
			"unauthorized" {
			status =
				http.StatusForbidden
		}
		c.JSON(
			status,
			gin.H{
				"error":
					err.Error(),
			},
		)
		return
	}
	c.JSON(
		http.StatusOK,
		analytics,
	)
}