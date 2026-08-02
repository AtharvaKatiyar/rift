package middleware_test

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/AtharvaKatiyar/rift/internal/middleware"
	"github.com/gin-gonic/gin"
)

func TestSecurityHeaders(
	t *testing.T,
) {

	gin.SetMode(
		gin.TestMode,
	)

	router :=
		gin.New()

	router.Use(
		middleware.SecurityHeaders(),
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

	recorder :=
		httptest.NewRecorder()

	router.ServeHTTP(
		recorder,
		req,
	)

	tests := []struct {
		name     string
		header   string
		expected string
	}{
		{
			name:     "x frame options",
			header:   "X-Frame-Options",
			expected: "DENY",
		},
		{
			name:     "x content type options",
			header:   "X-Content-Type-Options",
			expected: "nosniff",
		},
		{
			name:     "referrer policy",
			header:   "Referrer-Policy",
			expected: "strict-origin-when-cross-origin",
		},
		{
			name:     "content security policy",
			header:   "Content-Security-Policy",
			expected: "default-src 'self'; frame-ancestors 'none'; base-uri 'self';",
		},
		{
			name:     "permissions policy",
			header:   "Permissions-Policy",
			expected: "camera=(), microphone=(), geolocation=()",
		},
		{
			name:     "hsts",
			header:   "Strict-Transport-Security",
			expected: "max-age=31536000; includeSubDomains",
		},
	}

	for _, tt := range tests {

		t.Run(
			tt.name,
			func(t *testing.T) {

				actual :=
					recorder.Header().Get(
						tt.header,
					)

				if actual != tt.expected {
					t.Errorf(
						"expected header %s to be %q, got %q",
						tt.header,
						tt.expected,
						actual,
					)
				}
			},
		)
	}
}
