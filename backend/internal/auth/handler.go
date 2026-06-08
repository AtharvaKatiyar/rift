package auth

import (
	"net/http"
	"errors"
	"github.com/AtharvaKatiyar/rift/internal/utils"
	"github.com/AtharvaKatiyar/rift/internal/httpx"
	"github.com/gin-gonic/gin"
)

type Handler struct {
	Service 	 *Service
	IsProduction bool
}

func (h *Handler) Register(
	c *gin.Context,
) {

	var req RegisterRequest

	if err := c.ShouldBindJSON(
		&req,
	); err != nil {



		httpx.BadRequest(
			c,
			err,
		)

		return
	}

	accessToken,
	refreshToken,
	err := h.Service.Register(
		c.Request.Context(),
		req,
		c.Request.UserAgent(),
		c.ClientIP(),
	)
	
	if err != nil {
		
		httpx.BadRequest(
			c,
			err,
		)

		return
	}
	
	err = SetSessionResponse(
		c,
		accessToken,
		refreshToken,
		h.IsProduction,
	)

	if err != nil {

		HandleAuthError(
			c,
			http.StatusInternalServerError,
			err,
		)

		return
	}

	HandleAuthSuccess(
		c,
		http.StatusCreated,
		"registered successfully",
	)
}

func (h *Handler) Login(
	c *gin.Context,
) {

	var req LoginRequest

	if err := c.ShouldBindJSON(
		&req,
	); err != nil {

		httpx.BadRequest(
			c,
			err,
		)
		return
	}

	accessToken,
	refreshToken,
	err := h.Service.Login(
		c.Request.Context(),
		req,
		c.Request.UserAgent(),
		c.ClientIP(),	
	)


	if err != nil {

		httpx.Unauthorized(
			c,
			err,
		)
		return
	}

	err = SetSessionResponse(
		c,
		accessToken,
		refreshToken,
		h.IsProduction,
	)


	if err != nil {

		HandleAuthError(
			c,
			http.StatusInternalServerError,
			err,
		)

		return
	}

	HandleAuthSuccess(
		c,
		http.StatusOK,
		"logged in successfully",
	)
}

func (h *Handler) Me(
	c *gin.Context,
) {

	userID, exists := c.Get(
		"user_id",
	)

	if !exists {

		httpx.Unauthorized(
			c,
			errors.New(
				"unauthorized",
			),
		)
		return
	}

	userIDStr, ok := userID.(string)

	if !ok {

		httpx.Unauthorized(
			c,
			errors.New(
				"invalid auth context",
			),
		)
		return
	}

	pgUserID, err :=
		utils.ParseUUID(
			userIDStr,
		)

	if err != nil {

		httpx.Unauthorized(
			c,
			errors.New(
				"invalid user id",
			),
		)
		return
	}

	user, err :=
		h.Service.Queries.GetUserByID(
			c.Request.Context(),
			pgUserID,
		)

	if err != nil {

		httpx.Unauthorized(
			c,
			errors.New(
				"user not found",
			),
		)
		return
	}

	c.JSON(
		http.StatusOK,
		gin.H{
			"id": user.ID,
			"email": user.Email,
			"username":
				user.Username,
		},
	)
}

func (h *Handler) Refresh(
	c *gin.Context,
) {

	refreshToken, err :=
		GetRefreshCookie(c)

	if err != nil {

		httpx.Unauthorized(
			c,
			errors.New(
				"missing refresh token",
			),
		)

		return
	}

	accessToken,
		newRefreshToken,
		err :=
		h.Service.RefreshSession(
			c.Request.Context(),
			refreshToken,
			c.Request.UserAgent(),
			c.ClientIP(),
		)

	if err != nil {

		ClearAuthCookies(
			c,
			h.IsProduction,
		)

		httpx.Unauthorized(
			c,
			err,
		)

		return
	}

	err = SetSessionResponse(
		c,
		accessToken,
		newRefreshToken,
		h.IsProduction,
	)

	if err != nil {

		HandleAuthError(
			c,
			http.StatusInternalServerError,
			err,
		)

		return
	}

	HandleAuthSuccess(
		c,
		http.StatusOK,
		"session refreshed",
	)
	}

func (h *Handler) Logout(
	c *gin.Context,
) {

	refreshToken, err :=
		GetRefreshCookie(c)

	if err == nil {

		_ = h.Service.Logout(
			c.Request.Context(),
			refreshToken,
		)
	}

	ClearAuthCookies(
		c,
		h.IsProduction,
	)

	httpx.Success(
		c,
		http.StatusOK,
		"logged out successfully",
	)
}

func (h *Handler) LogoutAll(
	c *gin.Context,
) {

	userID, exists :=
		c.Get(
			"user_id",
		)

	if !exists {

		httpx.Unauthorized(
			c,
			errors.New(
				"unauthorized",
			),
		)

		return
	}

	userIDStr, ok :=
		userID.(string)

	if !ok {

		httpx.Unauthorized(
			c,
			errors.New(
				"invalid auth context",
			),
		)

		return
	}

	err := h.Service.LogoutAll(
		c.Request.Context(),
		userIDStr,
	)

	ClearAuthCookies(
		c,
		h.IsProduction,
	)

	if err != nil {

		httpx.InternalServerError(
			c,
			errors.New(
				"failed to logout",
			),
		)

		return
	}

	httpx.Success(
		c,
		http.StatusOK,
		"logged out from all devices",
	)
}