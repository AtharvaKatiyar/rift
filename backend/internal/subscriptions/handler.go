package subscription

import (
	"errors"
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
	"net/http"
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
				"error": "unauthorized",
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
				"error": "invalid auth context",
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
				"error": err.Error(),
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
				"error": "unauthorized",
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
				"error": "invalid auth context",
			},
		)

		return
	}

	var req UpgradeRequest

	if err :=
		c.ShouldBindJSON(
			&req,
		); err != nil {

		c.JSON(
			http.StatusBadRequest,
			gin.H{
				"error": "invalid request",
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

		switch {

		case errors.Is(
			err,
			ErrInvalidPlan,
		):

			c.JSON(
				http.StatusBadRequest,
				gin.H{
					"error": "invalid plan",
				},
			)

		case errors.Is(
			err,
			ErrInvalidUpgradePath,
		):

			c.JSON(
				http.StatusBadRequest,
				gin.H{
					"error": "invalid upgrade path",
				},
			)

		default:

			c.JSON(
				http.StatusInternalServerError,
				gin.H{
					"error": err.Error(),
				},
			)
		}

		return
	}

	c.JSON(
		http.StatusOK,
		gin.H{
			"message": "upgrade allowed",
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
				"error": "unauthorized",
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
				"error": "invalid auth context",
			},
		)

		return
	}

	var req CheckoutRequest

	if err :=
		c.ShouldBindJSON(
			&req,
		); err != nil {

		c.JSON(
			http.StatusBadRequest,
			gin.H{
				"error": "invalid request",
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

		switch {

		case errors.Is(
			err,
			ErrInvalidPlan,
		):

			c.JSON(
				http.StatusBadRequest,
				gin.H{
					"error": "invalid plan",
				},
			)

		case errors.Is(
			err,
			ErrInvalidUpgradePath,
		):

			c.JSON(
				http.StatusBadRequest,
				gin.H{
					"error": "invalid upgrade path",
				},
			)

		default:

			c.JSON(
				http.StatusInternalServerError,
				gin.H{
					"error": err.Error(),
				},
			)
		}

		return
	}

	c.JSON(
		http.StatusOK,
		response,
	)
}

func (
	h *Handler,
) GetCheckoutStatus(
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
				"error": "unauthorized",
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
				"error": "invalid auth context",
			},
		)

		return
	}

	checkoutID :=
		c.Param(
			"checkout_id",
		)

	response, err :=
		h.Service.
			GetCheckoutStatus(
				c.Request.Context(),
				userIDStr,
				checkoutID,
			)

	if err != nil {

		if errors.Is(
			err,
			pgx.ErrNoRows,
		) {

			c.JSON(
				http.StatusNotFound,
				gin.H{
					"error": "checkout not found",
				},
			)

			return
		}

		c.JSON(
			http.StatusInternalServerError,
			gin.H{
				"error": "internal server error",
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
) GetPlans(
	c *gin.Context,
) {

	c.JSON(
		http.StatusOK,
		h.Service.GetPlans(),
	)
}
