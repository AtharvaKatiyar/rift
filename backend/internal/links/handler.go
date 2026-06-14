package links

import (
	"net/http"
	"strconv"
	"github.com/gin-gonic/gin"
)

type Handler struct {
	Service *Service
}

func (h *Handler) CreateLink(
	c *gin.Context,
) {

	var req CreateLinkRequest

	if err := c.ShouldBindJSON(
		&req,
	); err != nil {

		c.JSON(
			http.StatusBadRequest,
			gin.H{
				"error": err.Error(),
			},
		)
		return
	}

	userID, exists := c.Get(
		"user_id",
	)

	if !exists {

		c.JSON(
			http.StatusUnauthorized,
			gin.H{
				"error": "unauthorized",
			},
		)
		return
	}

	userIDStr, ok := userID.(string)
	if !ok {

		c.JSON(
			http.StatusUnauthorized,
			gin.H{
				"error": "invalid auth context",
			},
		)
		return
	}

	_, publicURL, err :=
		h.Service.CreateLink(
			c.Request.Context(),
			userIDStr,
			req,
		)

	if err != nil {

		c.JSON(
			http.StatusBadRequest,
			gin.H{
				"error": err.Error(),
			},
		)
		return
	}

	c.JSON(
		http.StatusCreated,
		gin.H{
			"message": "link created",
			"url": publicURL,
		},
	)
}

func (h *Handler) GetUserLinks(
	c *gin.Context,
) {

	userID, exists := c.Get(
		"user_id",
	)

	if !exists {

		c.JSON(
			http.StatusUnauthorized,
			gin.H{
				"error": "unauthorized",
			},
		)
		return
	}

	userIDStr, ok := userID.(string)
	if !ok {

		c.JSON(
			http.StatusUnauthorized,
			gin.H{
				"error": "invalid auth context",
			},
		)
		return
	}
	page := int32(1)
	pageSize := int32(10)

	if pageQuery :=
		c.Query(
			"page",
		); pageQuery != "" {

		parsedPage, err :=
			strconv.Atoi(
				pageQuery,
			)

		if err != nil ||
			parsedPage < 1 {

			c.JSON(
				http.StatusBadRequest,
				gin.H{
					"error":
						"invalid page",
				},
			)

			return
		}

		page =
			int32(
				parsedPage,
			)
	}

	if pageSizeQuery :=
		c.Query(
			"page_size",
		); pageSizeQuery != "" {

		parsedPageSize, err :=
			strconv.Atoi(
				pageSizeQuery,
			)

		if err != nil {

			c.JSON(
				http.StatusBadRequest,
				gin.H{
					"error":
						"invalid page_size",
				},
			)

			return
		}

		switch {

		case parsedPageSize < 10:

			parsedPageSize = 10

		case parsedPageSize > 100:

			parsedPageSize = 100

		case parsedPageSize%10 != 0:

			parsedPageSize =
				((parsedPageSize / 10) + 1) * 10
		}

		pageSize =
			int32(
				parsedPageSize,
			)
	}


	links, totalItems, correctPage, err :=
		h.Service.GetUserLinks(
			c.Request.Context(),
			userIDStr,
			page,
			pageSize,
		)

	if err != nil {

		c.JSON(
			http.StatusInternalServerError,
			gin.H{
				"error": err.Error(),
			},
		)
		return
	}

	totalPages :=
		(totalItems +
			int64(pageSize) - 1) /
			int64(pageSize)

	c.JSON(
		http.StatusOK,

		gin.H{
			"links":
				links,

			"pagination":
				gin.H{
					"page":
						correctPage,

					"page_size":
						pageSize,

					"total_items":
						totalItems,

					"total_pages":
						totalPages,

					"has_next":
						correctPage <
							int32(totalPages),

					"has_previous":
						correctPage > 1,
				},
		},
	)
}

func (h *Handler) UpdateLink(
	c *gin.Context,
) {

	linkID := c.Param(
		"id",
	)

	userID, exists := c.Get(
		"user_id",
	)

	if !exists {

		c.JSON(
			http.StatusUnauthorized,
			gin.H{
				"error": "unauthorized",
			},
		)
		return
	}

	var req UpdateLinkRequest

	if err := c.ShouldBindJSON(
		&req,
	); err != nil {

		c.JSON(
			http.StatusBadRequest,
			gin.H{
				"error": err.Error(),
			},
		)
		return
	}

	userIDStr, ok := userID.(string)
	if !ok {

		c.JSON(
			http.StatusUnauthorized,
			gin.H{
				"error": "invalid auth context",
			},
		)
		return
	}

	err := h.Service.UpdateLink(
		c.Request.Context(),
		userIDStr,
		linkID,
		req,
	)

	if err != nil {

		c.JSON(
			http.StatusBadRequest,
			gin.H{
				"error": err.Error(),
			},
		)

		return
	}

	c.JSON(
		http.StatusOK,
		gin.H{
			"message":
			"link updated successfully",
		},
	)
}

func (h *Handler) GetLink(
	c *gin.Context,
) {

	linkID := c.Param("id")

	userID, exists := c.Get(
		"user_id",
	)

	if !exists {

		c.JSON(
			http.StatusUnauthorized,
			gin.H{
				"error": "unauthorized",
			},
		)
		return
	}

	userIDStr, ok := userID.(string)
	if !ok {

		c.JSON(
			http.StatusUnauthorized,
			gin.H{
				"error": "invalid auth context",
			},
		)
		return
	}

	link, err :=
		h.Service.GetLink(
			c.Request.Context(),
			userIDStr,
			linkID,
		)

	if err != nil {

		c.JSON(
			http.StatusNotFound,
			gin.H{
				"error": err.Error(),
			},
		)

		return
	}

	c.JSON(
		http.StatusOK,
		gin.H{
			"link": link,
		},
	)
}

func (h *Handler) DeleteLink(
	c *gin.Context,
) {

	linkID := c.Param("id")

	userID, exists := c.Get(
		"user_id",
	)

	if !exists {

		c.JSON(
			http.StatusUnauthorized,
			gin.H{
				"error": "unauthorized",
			},
		)
		return
	}

	userIDStr, ok := userID.(string)
	if !ok {

		c.JSON(
			http.StatusUnauthorized,
			gin.H{
				"error": "invalid auth context",
			},
		)
		return
	}

	err :=
		h.Service.DeleteLink(
			c.Request.Context(),
			userIDStr,
			linkID,
		)

	if err != nil {

		c.JSON(
			http.StatusBadRequest,
			gin.H{
				"error": err.Error(),
			},
		)

		return
	}

	c.JSON(
		http.StatusOK,
		gin.H{
			"message":
				"link deleted successfully",
		},
	)
}

func (h *Handler) ToggleStatus(
	c *gin.Context,
) {

	linkID := c.Param("id")

	userID, exists := c.Get(
		"user_id",
	)

	if !exists {

		c.JSON(
			http.StatusUnauthorized,
			gin.H{
				"error": "unauthorized",
			},
		)
		return
	}

	userIDStr, ok := userID.(string)
	if !ok {

		c.JSON(
			http.StatusUnauthorized,
			gin.H{
				"error": "invalid auth context",
			},
		)
		return
	}

	err :=
		h.Service.ToggleLinkStatus(
			c.Request.Context(),
			userIDStr,
			linkID,
		)

	if err != nil {

		c.JSON(
			http.StatusBadRequest,
			gin.H{
				"error": err.Error(),
			},
		)

		return
	}

	c.JSON(
		http.StatusOK,
		gin.H{
			"message":
				"link status updated",
		},
	)
}