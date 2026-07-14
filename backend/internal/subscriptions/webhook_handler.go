package subscription

import (
	"github.com/AtharvaKatiyar/rift/internal/logger"
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
	"io"
	"net/http"
)

func (
	h *Handler,
) DodoWebhook(
	c *gin.Context,
) {

	payload, err :=
		io.ReadAll(
			c.Request.Body,
		)

	if err != nil {

		c.JSON(
			http.StatusBadRequest,
			gin.H{
				"error": "invalid payload",
			},
		)

		return
	}

	headers :=
		WebhookHeaders{
			ID: c.GetHeader(
				"webhook-id",
			),

			Signature: c.GetHeader(
				"webhook-signature",
			),

			Timestamp: c.GetHeader(
				"webhook-timestamp",
			),
		}

	if headers.ID == "" ||
		headers.Signature == "" ||
		headers.Timestamp == "" {

		logger.Log.Warn(
			"webhook missing required headers",
			zap.Bool(
				"has_webhook_id",
				headers.ID != "",
			),
			zap.Bool(
				"has_signature",
				headers.Signature != "",
			),
			zap.Bool(
				"has_timestamp",
				headers.Timestamp != "",
			),
		)

		c.JSON(
			http.StatusBadRequest,
			gin.H{
				"error": "missing required webhook headers",
			},
		)

		return
	}

	logger.Log.Info(
		"received dodo webhook",
		zap.String(
			"webhook_id",
			headers.ID,
		),
		zap.String(
			"timestamp",
			headers.Timestamp,
		),
	)

	err = h.Service.HandleWebhook(
		c.Request.Context(),
		payload,
		headers,
	)

	if err != nil {
		logger.Log.Error(
			"failed to process webhook",
			zap.Error(err),
		)

		c.JSON(
			http.StatusBadRequest,
			gin.H{
				"error": err.Error(),
			},
		)
		return
	}

	c.Status(
		http.StatusOK,
	)
}
