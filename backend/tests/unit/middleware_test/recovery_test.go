package middleware_test

import (
	"net/http"
	"net/http/httptest"
	"testing"
	"github.com/AtharvaKatiyar/rift/internal/logger"
	"github.com/AtharvaKatiyar/rift/internal/middleware"
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

func TestRecovery_RecoversFromPanic(
	t *testing.T,
) {

	gin.SetMode(
		gin.TestMode,
	)

	logger.Log = zap.NewNop()

	router :=
		gin.New()

	router.Use(
		middleware.RequestID(),
	)

	router.Use(
		middleware.Recovery(),
	)

	router.GET(
		"/panic",
		func(c *gin.Context) {
			panic(
				"test panic",
			)
		},
	)

	req :=
		httptest.NewRequest(
			http.MethodGet,
			"/panic",
			nil,
		)

	recorder :=
		httptest.NewRecorder()

	router.ServeHTTP(
		recorder,
		req,
	)

	if recorder.Code !=
		http.StatusInternalServerError {

		t.Errorf(
			"expected status %d, got %d",
			http.StatusInternalServerError,
			recorder.Code,
		)
	}
}

func TestRecovery_NormalRequest(
	t *testing.T,
) {

	gin.SetMode(
		gin.TestMode,
	)
	logger.Log = zap.NewNop()

	router :=
		gin.New()

	router.Use(
		middleware.RequestID(),
	)

	router.Use(
		middleware.Recovery(),
	)

	router.GET(
		"/healthy",
		func(c *gin.Context) {

			c.JSON(
				http.StatusOK,
				gin.H{
					"message":
						"healthy",
				},
			)
		},
	)

	req :=
		httptest.NewRequest(
			http.MethodGet,
			"/healthy",
			nil,
		)

	recorder :=
		httptest.NewRecorder()

	router.ServeHTTP(
		recorder,
		req,
	)

	if recorder.Code !=
		http.StatusOK {

		t.Errorf(
			"expected status %d, got %d",
			http.StatusOK,
			recorder.Code,
		)
	}
}

func TestRecovery_AbortsAfterPanic(
	t *testing.T,
) {

	gin.SetMode(
		gin.TestMode,
	)
	logger.Log = zap.NewNop()

	router :=
		gin.New()

	router.Use(
		middleware.RequestID(),
	)

	router.Use(
		middleware.Recovery(),
	)

	executedAfterPanic :=
		false

	router.GET(
		"/panic",
		func(c *gin.Context) {

			panic(
				"panic before next handler",
			)

		},
		func(c *gin.Context) {

			executedAfterPanic =
				true

			c.Status(
				http.StatusOK,
			)
		},
	)

	req :=
		httptest.NewRequest(
			http.MethodGet,
			"/panic",
			nil,
		)

	recorder :=
		httptest.NewRecorder()

	router.ServeHTTP(
		recorder,
		req,
	)

	if executedAfterPanic {
		t.Error(
			"handler executed after panic recovery",
		)
	}

	if recorder.Code !=
		http.StatusInternalServerError {

		t.Errorf(
			"expected status %d, got %d",
			http.StatusInternalServerError,
			recorder.Code,
		)
	}
}