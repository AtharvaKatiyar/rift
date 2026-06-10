package middleware_test

import (
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/AtharvaKatiyar/rift/internal/middleware"
	"github.com/AtharvaKatiyar/rift/tests/helpers"
	"github.com/gin-gonic/gin"
)

func TestRateLimit_WithinLimit(
	t *testing.T,
) {

	gin.SetMode(
		gin.TestMode,
	)

	rdb :=
		helpers.SharedTestRedis(
			t,
		)

	router :=
		gin.New()

	router.Use(
		middleware.RateLimit(
			rdb,
			3,
			time.Minute,
			"test",
		),
	)

	router.GET(
		"/",
		func(c *gin.Context) {
			c.Status(
				http.StatusOK,
			)
		},
	)

	for i := 0; i < 3; i++ {

		req :=
			httptest.NewRequest(
				http.MethodGet,
				"/",
				nil,
			)

		req.RemoteAddr =
			"192.168.1.1:12345"

		recorder :=
			httptest.NewRecorder()

		router.ServeHTTP(
			recorder,
			req,
		)

		if recorder.Code !=
			http.StatusOK {

			t.Fatalf(
				"expected status %d, got %d on request %d",
				http.StatusOK,
				recorder.Code,
				i+1,
			)
		}
	}
}

func TestRateLimit_ExceedsLimit(
	t *testing.T,
) {

	gin.SetMode(
		gin.TestMode,
	)

	rdb :=
		helpers.SharedTestRedis(
			t,
		)

	router :=
		gin.New()

	router.Use(
		middleware.RateLimit(
			rdb,
			2,
			time.Minute,
			"test",
		),
	)

	router.GET(
		"/",
		func(c *gin.Context) {
			c.Status(
				http.StatusOK,
			)
		},
	)

	for i := 0; i < 2; i++ {

		req :=
			httptest.NewRequest(
				http.MethodGet,
				"/",
				nil,
			)

		req.RemoteAddr =
			"192.168.1.1:12345"

		recorder :=
			httptest.NewRecorder()

		router.ServeHTTP(
			recorder,
			req,
		)

		if recorder.Code !=
			http.StatusOK {

			t.Fatalf(
				"expected status %d, got %d",
				http.StatusOK,
				recorder.Code,
			)
		}
	}

	req :=
		httptest.NewRequest(
			http.MethodGet,
			"/",
			nil,
		)

	req.RemoteAddr =
		"192.168.1.1:12345"

	recorder :=
		httptest.NewRecorder()

	router.ServeHTTP(
		recorder,
		req,
	)

	if recorder.Code !=
		http.StatusTooManyRequests {

		t.Fatalf(
			"expected status %d, got %d",
			http.StatusTooManyRequests,
			recorder.Code,
		)
	}
}

func TestRateLimit_DifferentIPsHaveSeparateLimits(
	t *testing.T,
) {

	gin.SetMode(
		gin.TestMode,
	)

	rdb :=
		helpers.SharedTestRedis(
			t,
		)

	router :=
		gin.New()

	router.Use(
		middleware.RateLimit(
			rdb,
			1,
			time.Minute,
			"test",
		),
	)

	router.GET(
		"/",
		func(c *gin.Context) {
			c.Status(
				http.StatusOK,
			)
		},
	)

	req1 :=
		httptest.NewRequest(
			http.MethodGet,
			"/",
			nil,
		)

	req1.RemoteAddr =
		"192.168.1.1:12345"

	recorder1 :=
		httptest.NewRecorder()

	router.ServeHTTP(
		recorder1,
		req1,
	)

	if recorder1.Code !=
		http.StatusOK {

		t.Fatalf(
			"expected status %d, got %d",
			http.StatusOK,
			recorder1.Code,
		)
	}

	req2 :=
		httptest.NewRequest(
			http.MethodGet,
			"/",
			nil,
		)

	req2.RemoteAddr =
		"192.168.1.2:12345"

	recorder2 :=
		httptest.NewRecorder()

	router.ServeHTTP(
		recorder2,
		req2,
	)

	if recorder2.Code !=
		http.StatusOK {

		t.Fatalf(
			"expected separate IP to bypass limit, got %d",
			recorder2.Code,
		)
	}
}

func TestRateLimit_ResetsAfterWindow(
	t *testing.T,
) {

	gin.SetMode(
		gin.TestMode,
	)

	rdb :=
		helpers.SharedTestRedis(
			t,
		)

	window :=
		2 * time.Second

	router :=
		gin.New()

	router.Use(
		middleware.RateLimit(
			rdb,
			1,
			window,
			"test",
		),
	)

	router.GET(
		"/",
		func(c *gin.Context) {
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

	req.RemoteAddr =
		"192.168.1.1:12345"

	recorder :=
		httptest.NewRecorder()

	router.ServeHTTP(
		recorder,
		req,
	)

	if recorder.Code !=
		http.StatusOK {

		t.Fatalf(
			"expected status %d, got %d",
			http.StatusOK,
			recorder.Code,
		)
	}

	req2 :=
		httptest.NewRequest(
			http.MethodGet,
			"/",
			nil,
		)

	req2.RemoteAddr =
		"192.168.1.1:12345"

	recorder2 :=
		httptest.NewRecorder()

	router.ServeHTTP(
		recorder2,
		req2,
	)

	if recorder2.Code !=
		http.StatusTooManyRequests {

		t.Fatalf(
			"expected rate limit, got %d",
			recorder2.Code,
		)
	}

	time.Sleep(
		window +
			500*time.Millisecond,
	)

	req3 :=
		httptest.NewRequest(
			http.MethodGet,
			"/",
			nil,
		)

	req3.RemoteAddr =
		"192.168.1.1:12345"

	recorder3 :=
		httptest.NewRecorder()

	router.ServeHTTP(
		recorder3,
		req3,
	)

	if recorder3.Code !=
		http.StatusOK {

		t.Fatalf(
			"expected rate limit reset, got %d",
			recorder3.Code,
		)
	}
}