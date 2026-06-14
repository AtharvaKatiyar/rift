package subscription

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type Handler struct {
	Service *Service
}

func (
	h *Handler,
) GetSubscription(
	c *gin.Context,
) {

	userID, exists :=
		c.Get(
			"user_id",
		)

	if !exists {

		c.JSON(
			http.StatusUnauthorized,
			gin.H{
				"error":
					"unauthorized",
			},
		)

		return
	}

	userIDStr, ok :=
		userID.(string)

	if !ok {

		c.JSON(
			http.StatusUnauthorized,
			gin.H{
				"error":
					"invalid auth context",
			},
		)

		return
	}

	response, err :=
		h.Service.GetSubscription(
			c.Request.Context(),
			userIDStr,
		)

	if err != nil {

		c.JSON(
			http.StatusInternalServerError,
			gin.H{
				"error":
					err.Error(),
			},
		)

		return
	}

	c.JSON(
		http.StatusOK,
		response,
	)
}

func (
	h *Handler,
) CreateUpgradeIntent(
	c *gin.Context,
) {

	userID, exists :=
		c.Get(
			"user_id",
		)

	if !exists {

		c.JSON(
			http.StatusUnauthorized,
			gin.H{
				"error":
					"unauthorized",
			},
		)

		return
	}

	userIDStr :=
		userID.(string)

	var req UpgradeRequest

	if err :=
		c.ShouldBindJSON(
			&req,
		); err != nil {

		c.JSON(
			http.StatusBadRequest,
			gin.H{
				"error":
					"invalid request",
			},
		)

		return
	}

	err :=
		h.Service.
			CreateUpgradeIntent(
				c.Request.Context(),
				userIDStr,
				req.Plan,
			)

	if err != nil {

		c.JSON(
			http.StatusBadRequest,
			gin.H{
				"error":
					err.Error(),
			},
		)

		return
	}

	c.JSON(
		http.StatusOK,
		gin.H{
			"message":
				"upgrade allowed",
		},
	)
}

func (
	h *Handler,
) CreateCheckout(
	c *gin.Context,
) {

	userID, exists :=
		c.Get(
			"user_id",
		)

	if !exists {

		c.JSON(
			http.StatusUnauthorized,
			gin.H{
				"error":
					"unauthorized",
			},
		)

		return
	}

	userIDStr :=
		userID.(string)

	var req CheckoutRequest

	if err :=
		c.ShouldBindJSON(
			&req,
		); err != nil {

		c.JSON(
			http.StatusBadRequest,
			gin.H{
				"error":
					"invalid request",
			},
		)

		return
	}

	response, err :=
		h.Service.
			CreateCheckout(
				c.Request.Context(),
				userIDStr,
				req.Plan,
			)

	if err != nil {

		c.JSON(
			http.StatusBadRequest,
			gin.H{
				"error":
					err.Error(),
			},
		)

		return
	}

	c.JSON(
		http.StatusOK,
		response,
	)
}