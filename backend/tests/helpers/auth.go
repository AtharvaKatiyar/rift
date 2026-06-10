package helpers

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/require"
)

type AuthResult struct {
	Cookies []*http.Cookie
	Email   string
}

func RegisterAndLogin(
	t *testing.T,
	router *gin.Engine,
) *AuthResult {

	registerReq :=
		TestRegisterRequest()

	body, err :=
		json.Marshal(
			registerReq,
		)

	require.NoError(
		t,
		err,
	)

	req :=
		httptest.NewRequest(
			http.MethodPost,
			"/api/v1/auth/register",
			bytes.NewBuffer(
				body,
			),
		)

	req.Header.Set(
		"Content-Type",
		"application/json",
	)

	w :=
		httptest.NewRecorder()

	router.ServeHTTP(
		w,
		req,
	)

	require.Equal(
		t,
		http.StatusCreated,
		w.Code,
	)

	return &AuthResult{
		Cookies:
			w.Result().Cookies(),
		Email:
			registerReq.Email,
	}
}