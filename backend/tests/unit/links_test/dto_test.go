package links_test

import (
	"bytes"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/AtharvaKatiyar/rift/internal/links"
	"github.com/gin-gonic/gin"
)

func TestCreateLinkRequestBinding(
	t *testing.T,
) {

	gin.SetMode(
		gin.TestMode,
	)

	longTitle :=
		strings.Repeat(
			"a",
			101,
		)

	tests := []struct {
		name        string
		body        string
		expectError bool
	}{
		{
			name: "valid request",
			body: `{
					"title":"My Link",
					"slug":"my-link",
					"target_url":"https://example.com"
				}`,
			expectError: false,
		},
		{
			name: "missing title",
			body: `{
					"slug":"my-link",
					"target_url":"https://example.com"
				}`,
			expectError: true,
		},
		{
			name: "missing slug",
			body: `{
					"title":"My Link",
					"target_url":"https://example.com"
				}`,
			expectError: true,
		},
		{
			name: "missing target_url",
			body: `{
					"title":"My Link",
					"slug":"my-link"
				}`,
			expectError: true,
		},
		{
			name: "invalid url",
			body: `{
					"title":"My Link",
					"slug":"my-link",
					"target_url":"not-a-url"
				}`,
			expectError: true,
		},
		{
			name: "title too long",
			body: `{
					"title":"` + longTitle + `",
					"slug":"my-link",
					"target_url":"https://example.com"
				}`,
			expectError: true,
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
						http.MethodPost,
						"/",
						bytes.NewBufferString(
							tt.body,
						),
					)

				req.Header.Set(
					"Content-Type",
					"application/json",
				)

				c.Request = req

				var dto links.CreateLinkRequest

				err :=
					c.ShouldBindJSON(
						&dto,
					)

				if tt.expectError {

					if err == nil {
						t.Fatal(
							"expected binding error but got nil",
						)
					}

					return
				}

				if err != nil {
					t.Fatalf(
						"unexpected binding error: %v",
						err,
					)
				}
			},
		)
	}
}

func TestUpdateLinkRequestBinding(
	t *testing.T,
) {

	gin.SetMode(
		gin.TestMode,
	)

	longTitle :=
		strings.Repeat(
			"a",
			101,
		)

	tests := []struct {
		name        string
		body        string
		expectError bool
	}{
		{
			name: "valid request",
			body: `{
					"title":"Updated Link",
					"slug":"updated-link",
					"target_url":"https://example.com"
				}`,
			expectError: false,
		},
		{
			name: "missing title",
			body: `{
					"slug":"updated-link",
					"target_url":"https://example.com"
				}`,
			expectError: true,
		},
		{
			name: "missing slug",
			body: `{
					"title":"Updated Link",
					"target_url":"https://example.com"
				}`,
			expectError: true,
		},
		{
			name: "missing target_url",
			body: `{
					"title":"Updated Link",
					"slug":"updated-link"
				}`,
			expectError: true,
		},
		{
			name: "invalid url",
			body: `{
					"title":"Updated Link",
					"slug":"updated-link",
					"target_url":"invalid"
				}`,
			expectError: true,
		},
		{
			name: "title too long",
			body: `{
					"title":"` + longTitle + `",
					"slug":"updated-link",
					"target_url":"https://example.com"
				}`,
			expectError: true,
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
						http.MethodPut,
						"/",
						bytes.NewBufferString(
							tt.body,
						),
					)

				req.Header.Set(
					"Content-Type",
					"application/json",
				)

				c.Request = req

				var dto links.UpdateLinkRequest

				err :=
					c.ShouldBindJSON(
						&dto,
					)

				if tt.expectError {

					if err == nil {
						t.Fatal(
							"expected binding error but got nil",
						)
					}

					return
				}

				if err != nil {
					t.Fatalf(
						"unexpected binding error: %v",
						err,
					)
				}
			},
		)
	}
}
