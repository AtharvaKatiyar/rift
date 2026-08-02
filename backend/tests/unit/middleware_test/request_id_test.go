package middleware_test

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/AtharvaKatiyar/rift/internal/constants"
	"github.com/AtharvaKatiyar/rift/internal/httpx"
	"github.com/AtharvaKatiyar/rift/internal/middleware"
	"github.com/gin-gonic/gin"
)

func TestRequestID(
	t *testing.T,
) {

	gin.SetMode(
		gin.TestMode,
	)

	var (
		contextRequestID string
		requestContextID string
	)

	router :=
		gin.New()

	router.Use(
		middleware.RequestID(),
	)

	router.GET(
		"/",
		func(c *gin.Context) {

			requestID, exists :=
				c.Get(
					constants.RequestIDKey,
				)

			if !exists {
				t.Fatal(
					"request id missing from gin context",
				)
			}

			requestIDStr, ok :=
				requestID.(string)

			if !ok {
				t.Fatal(
					"request id is not a string",
				)
			}

			contextRequestID =
				requestIDStr

			requestContextID =
				httpx.RequestID(
					c,
				)

			c.Status(
				http.StatusOK,
			)
		},
	)

	req :=
		httptest.NewRequest(
			http.MethodGet,
			"/",
			nil,
		)

	recorder :=
		httptest.NewRecorder()

	router.ServeHTTP(
		recorder,
		req,
	)

	responseRequestID :=
		recorder.Header().Get(
			"X-Request-ID",
		)

	if responseRequestID == "" {
		t.Fatal(
			"expected X-Request-ID header",
		)
	}

	if !strings.HasPrefix(
		responseRequestID,
		"req_",
	) {
		t.Errorf(
			"expected request id to start with req_, got %s",
			responseRequestID,
		)
	}

	if contextRequestID !=
		responseRequestID {

		t.Errorf(
			"context request id mismatch: expected %s, got %s",
			responseRequestID,
			contextRequestID,
		)
	}

	if requestContextID !=
		responseRequestID {

		t.Errorf(
			"request context id mismatch: expected %s, got %s",
			responseRequestID,
			requestContextID,
		)
	}
}

func TestRequestID_UniquePerRequest(
	t *testing.T,
) {

	gin.SetMode(
		gin.TestMode,
	)

	router :=
		gin.New()

	router.Use(
		middleware.RequestID(),
	)

	router.GET(
		"/",
		func(c *gin.Context) {
			c.Status(
				http.StatusOK,
			)
		},
	)

	requestIDs :=
		make(
			map[string]bool,
		)

	const requestCount = 25

	for i := 0; i < requestCount; i++ {

		req :=
			httptest.NewRequest(
				http.MethodGet,
				"/",
				nil,
			)

		recorder :=
			httptest.NewRecorder()

		router.ServeHTTP(
			recorder,
			req,
		)

		requestID :=
			recorder.Header().Get(
				"X-Request-ID",
			)

		if requestID == "" {
			t.Fatal(
				"missing request id",
			)
		}

		if requestIDs[requestID] {
			t.Fatalf(
				"duplicate request id generated: %s",
				requestID,
			)
		}

		requestIDs[requestID] =
			true
	}
}
