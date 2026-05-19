package auth

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type Handler struct {
	Service *Service
}

func (h *Handler) Register(
	c *gin.Context,
) {

	var req RegisterRequest

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

	token, err := h.Service.Register(
		c.Request.Context(),
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
			"token": token,
		},
	)
}

func (h *Handler) Login(
	c *gin.Context,
) {

	var req LoginRequest

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

	token, err := h.Service.Login(
		c.Request.Context(),
		req,
	)

	if err != nil {

		c.JSON(
			http.StatusUnauthorized,
			gin.H{
				"error": err.Error(),
			},
		)
		return
	}

	c.JSON(
		http.StatusOK,
		gin.H{
			"token": token,
		},
	)
}

func (h *Handler) Me(
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

	email, _ := c.Get(
		"user_email",
	)

	c.JSON(
		http.StatusOK,
		gin.H{
			"user_id": userID,
			"email":  email,
		},
	)
}