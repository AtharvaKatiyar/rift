package auth_test

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/AtharvaKatiyar/rift/internal/auth"
	"github.com/gin-gonic/gin"
)

func TestSetAuthCookies(
	t *testing.T,
) {

	tests := []struct {
		name           string
		isProduction   bool
		expectSecure   bool
		expectHTTPOnly bool
	}{
		{
			name:
				"development mode",
			isProduction:
				false,
			expectSecure:
				false,
			expectHTTPOnly:
				true,
		},
		{
			name:
				"production mode",
			isProduction:
				true,
			expectSecure:
				true,
			expectHTTPOnly:
				true,
		},
	}

	for _, tt := range tests {

		t.Run(
			tt.name,
			func(t *testing.T) {

				recorder :=
					httptest.NewRecorder()

				c, _ :=
					gin.CreateTestContext(
						recorder,
					)

				auth.SetAuthCookies(
					c,
					"access-token-value",
					"refresh-token-value",
					tt.isProduction,
				)

				cookies :=
					recorder.Result().Cookies()

				if len(cookies) != 2 {
					t.Fatalf(
						"expected 2 cookies, got %d",
						len(cookies),
					)
				}

				cookieMap :=
					make(
						map[string]*http.Cookie,
					)

				for _, cookie := range cookies {
					cookieMap[cookie.Name] =
						cookie
				}

				accessCookie, exists :=
					cookieMap["access_token"]

				if !exists {
					t.Fatal(
						"access_token cookie not found",
					)
				}

				refreshCookie, exists :=
					cookieMap["refresh_token"]

				if !exists {
					t.Fatal(
						"refresh_token cookie not found",
					)
				}

				tests := []struct {
					name   string
					cookie *http.Cookie
					value  string
				}{
					{
						name:
							"access cookie",
						cookie:
							accessCookie,
						value:
							"access-token-value",
					},
					{
						name:
							"refresh cookie",
						cookie:
							refreshCookie,
						value:
							"refresh-token-value",
					},
				}

				for _, tc := range tests {

					t.Run(
						tc.name,
						func(t *testing.T) {

							if tc.cookie.Value != tc.value {
								t.Errorf(
									"expected value %s, got %s",
									tc.value,
									tc.cookie.Value,
								)
							}

							if tc.cookie.Path != "/" {
								t.Errorf(
									"expected path '/', got %s",
									tc.cookie.Path,
								)
							}

							if tc.cookie.HttpOnly != tt.expectHTTPOnly {
								t.Errorf(
									"expected HttpOnly=%v, got %v",
									tt.expectHTTPOnly,
									tc.cookie.HttpOnly,
								)
							}

							if tc.cookie.Secure != tt.expectSecure {
								t.Errorf(
									"expected Secure=%v, got %v",
									tt.expectSecure,
									tc.cookie.Secure,
								)
							}

							if tc.cookie.MaxAge <= 0 {
								t.Error(
									"expected positive max age",
								)
							}

							if tc.cookie.SameSite != http.SameSiteLaxMode {
								t.Errorf(
									"expected SameSiteLaxMode, got %v",
									tc.cookie.SameSite,
								)
							}
						},
					)
				}
			},
		)
	}
}

func TestClearAuthCookies(
	t *testing.T,
) {

	tests := []struct {
		name         string
		isProduction bool
		expectSecure bool
	}{
		{
			name:
				"development mode",
			isProduction:
				false,
			expectSecure:
				false,
		},
		{
			name:
				"production mode",
			isProduction:
				true,
			expectSecure:
				true,
		},
	}

	for _, tt := range tests {

		t.Run(
			tt.name,
			func(t *testing.T) {

				recorder :=
					httptest.NewRecorder()

				c, _ :=
					gin.CreateTestContext(
						recorder,
					)

				auth.ClearAuthCookies(
					c,
					tt.isProduction,
				)

				cookies :=
					recorder.Result().Cookies()

				if len(cookies) != 2 {
					t.Fatalf(
						"expected 2 cookies, got %d",
						len(cookies),
					)
				}

				for _, cookie := range cookies {

					if cookie.Value != "" {
						t.Errorf(
							"expected empty cookie value, got %s",
							cookie.Value,
						)
					}

					if cookie.MaxAge != -1 {
						t.Errorf(
							"expected MaxAge=-1, got %d",
							cookie.MaxAge,
						)
					}

					if cookie.Path != "/" {
						t.Errorf(
							"expected path '/', got %s",
							cookie.Path,
						)
					}

					if cookie.HttpOnly != true {
						t.Error(
							"expected HttpOnly=true",
						)
					}

					if cookie.Secure != tt.expectSecure {
						t.Errorf(
							"expected Secure=%v, got %v",
							tt.expectSecure,
							cookie.Secure,
						)
					}
				}
			},
		)
	}
}

func TestGetAccessCookie(
	t *testing.T,
) {

	tests := []struct {
		name        string
		setupCookie bool
		expectError bool
	}{
		{
			name:
				"cookie exists",
			setupCookie:
				true,
			expectError:
				false,
		},
		{
			name:
				"cookie missing",
			setupCookie:
				false,
			expectError:
				true,
		},
	}

	for _, tt := range tests {

		t.Run(
			tt.name,
			func(t *testing.T) {

				recorder :=
					httptest.NewRecorder()

				c, _ :=
					gin.CreateTestContext(
						recorder,
					)

				req :=
					httptest.NewRequest(
						http.MethodGet,
						"/",
						nil,
					)

				if tt.setupCookie {

					req.AddCookie(
						&http.Cookie{
							Name:
								"access_token",
							Value:
								"test-access-token",
						},
					)
				}

				c.Request = req

				token, err :=
					auth.GetAccessCookie(
						c,
					)

				if tt.expectError {

					if err == nil {
						t.Fatal(
							"expected error but got nil",
						)
					}

					return
				}

				if err != nil {
					t.Fatalf(
						"unexpected error: %v",
						err,
					)
				}

				if token != "test-access-token" {
					t.Errorf(
						"expected token test-access-token, got %s",
						token,
					)
				}
			},
		)
	}
}

func TestGetRefreshCookie(
	t *testing.T,
) {

	tests := []struct {
		name        string
		setupCookie bool
		expectError bool
	}{
		{
			name:
				"cookie exists",
			setupCookie:
				true,
			expectError:
				false,
		},
		{
			name:
				"cookie missing",
			setupCookie:
				false,
			expectError:
				true,
		},
	}

	for _, tt := range tests {

		t.Run(
			tt.name,
			func(t *testing.T) {

				recorder :=
					httptest.NewRecorder()

				c, _ :=
					gin.CreateTestContext(
						recorder,
					)

				req :=
					httptest.NewRequest(
						http.MethodGet,
						"/",
						nil,
					)

				if tt.setupCookie {

					req.AddCookie(
						&http.Cookie{
							Name:
								"refresh_token",
							Value:
								"test-refresh-token",
						},
					)
				}

				c.Request = req

				token, err :=
					auth.GetRefreshCookie(
						c,
					)

				if tt.expectError {

					if err == nil {
						t.Fatal(
							"expected error but got nil",
						)
					}

					return
				}

				if err != nil {
					t.Fatalf(
						"unexpected error: %v",
						err,
					)
				}

				if token != "test-refresh-token" {
					t.Errorf(
						"expected token test-refresh-token, got %s",
						token,
					)
				}
			},
		)
	}
}