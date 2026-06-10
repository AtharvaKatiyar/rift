package auth_test

import (
	"net/http/httptest"
	"testing"

	"github.com/AtharvaKatiyar/rift/internal/auth"
	"github.com/gin-gonic/gin"
)

func TestSetCSRFCookie(
	t *testing.T,
) {

	tests := []struct {
		name           string
		ginMode        string
		expectSecure   bool
		expectHTTPOnly bool
	}{
		{
			name:
				"debug mode",
			ginMode:
				gin.DebugMode,
			expectSecure:
				false,
			expectHTTPOnly:
				false,
		},
		{
			name:
				"release mode",
			ginMode:
				gin.ReleaseMode,
			expectSecure:
				true,
			expectHTTPOnly:
				false,
		},
	}

	for _, tt := range tests {

		t.Run(
			tt.name,
			func(t *testing.T) {

				gin.SetMode(
					tt.ginMode,
				)

				recorder :=
					httptest.NewRecorder()

				c, _ :=
					gin.CreateTestContext(
						recorder,
					)

				err :=
					auth.SetCSRFCookie(
						c,
					)

				if err != nil {
					t.Fatalf(
						"unexpected error: %v",
						err,
					)
				}

				cookies :=
					recorder.Result().Cookies()

				if len(cookies) != 1 {
					t.Fatalf(
						"expected 1 cookie, got %d",
						len(cookies),
					)
				}

				cookie :=
					cookies[0]

				if cookie.Name != "csrf_token" {
					t.Errorf(
						"expected cookie name csrf_token, got %s",
						cookie.Name,
					)
				}

				if cookie.Value == "" {
					t.Fatal(
						"expected csrf token value, got empty string",
					)
				}

				if len(cookie.Value) != 64 {
					t.Errorf(
						"expected token length 64, got %d",
						len(cookie.Value),
					)
				}

				if cookie.Path != "/" {
					t.Errorf(
						"expected path '/', got %s",
						cookie.Path,
					)
				}

				if cookie.HttpOnly != tt.expectHTTPOnly {
					t.Errorf(
						"expected HttpOnly=%v, got %v",
						tt.expectHTTPOnly,
						cookie.HttpOnly,
					)
				}

				if cookie.Secure != tt.expectSecure {
					t.Errorf(
						"expected Secure=%v, got %v",
						tt.expectSecure,
						cookie.Secure,
					)
				}

				if cookie.MaxAge <= 0 {
					t.Error(
						"expected positive max age",
					)
				}
			},
		)
	}
}

func TestSetCSRFCookie_GeneratesUniqueTokens(
	t *testing.T,
) {

	gin.SetMode(
		gin.TestMode,
	)

	recorder1 :=
		httptest.NewRecorder()

	c1, _ :=
		gin.CreateTestContext(
			recorder1,
		)

	err :=
		auth.SetCSRFCookie(
			c1,
		)

	if err != nil {
		t.Fatalf(
			"unexpected error: %v",
			err,
		)
	}

	recorder2 :=
		httptest.NewRecorder()

	c2, _ :=
		gin.CreateTestContext(
			recorder2,
		)

	err =
		auth.SetCSRFCookie(
			c2,
		)

	if err != nil {
		t.Fatalf(
			"unexpected error: %v",
			err,
		)
	}

	cookies1 :=
		recorder1.Result().Cookies()

	cookies2 :=
		recorder2.Result().Cookies()

	if len(cookies1) == 0 ||
		len(cookies2) == 0 {

		t.Fatal(
			"expected csrf cookies",
		)
	}

	token1 :=
		cookies1[0].Value

	token2 :=
		cookies2[0].Value

	if token1 == token2 {
		t.Error(
			"expected unique csrf tokens",
		)
	}
}

func TestSetCSRFCookie_TokenIsHex(
	t *testing.T,
) {

	gin.SetMode(
		gin.TestMode,
	)

	recorder :=
		httptest.NewRecorder()

	c, _ :=
		gin.CreateTestContext(
			recorder,
		)

	err :=
		auth.SetCSRFCookie(
			c,
		)

	if err != nil {
		t.Fatalf(
			"unexpected error: %v",
			err,
		)
	}

	cookies :=
		recorder.Result().Cookies()

	if len(cookies) == 0 {
		t.Fatal(
			"expected csrf cookie",
		)
	}

	token :=
		cookies[0].Value

	for _, ch := range token {

		isHex :=
			(ch >= '0' && ch <= '9') ||
				(ch >= 'a' && ch <= 'f')

		if !isHex {
			t.Fatalf(
				"token contains non-hex character: %c",
				ch,
			)
		}
	}
}