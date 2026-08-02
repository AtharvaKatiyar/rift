package auth_test

import (
	"context"
	"testing"

	authpkg "github.com/AtharvaKatiyar/rift/internal/auth"
)

func TestRefreshSession_ReuseDetection(
	t *testing.T,
) {

	service :=
		setupAuthService(
			t,
		)

	_, _, err :=
		service.Register(
			context.Background(),
			authpkg.RegisterRequest{
				Email:    "user@example.com",
				Username: "testuser",
				Password: "StrongPass123!",
			},
			"register-agent",
			"127.0.0.1",
		)

	if err != nil {
		t.Fatalf(
			"register failed: %v",
			err,
		)
	}

	_, originalRefresh,
		err :=
		service.Login(
			context.Background(),
			authpkg.LoginRequest{
				Email:    "user@example.com",
				Password: "StrongPass123!",
			},
			"login-agent",
			"127.0.0.1",
		)

	if err != nil {
		t.Fatalf(
			"login failed: %v",
			err,
		)
	}

	_, rotatedRefresh,
		err :=
		service.RefreshSession(
			context.Background(),
			originalRefresh,
			"refresh-agent",
			"127.0.0.1",
		)

	if err != nil {
		t.Fatalf(
			"refresh failed: %v",
			err,
		)
	}

	if rotatedRefresh == "" {
		t.Fatal(
			"expected rotated refresh token",
		)
	}

	/*
		Attempt reuse of the
		original refresh token.
	*/

	_, _, err =
		service.RefreshSession(
			context.Background(),
			originalRefresh,
			"attacker-agent",
			"192.168.1.1",
		)

	if err == nil {
		t.Fatal(
			"expected reuse detection error",
		)
	}

	if err.Error() !=
		"refresh token reuse detected" {

		t.Fatalf(
			"expected reuse detection error, got %q",
			err.Error(),
		)
	}

	/*
		After reuse detection,
		all sessions should
		be invalidated.
	*/

	_, _, err =
		service.RefreshSession(
			context.Background(),
			rotatedRefresh,
			"refresh-agent",
			"127.0.0.1",
		)

	if err == nil {
		t.Fatal(
			"expected session invalidation",
		)
	}

	if err.Error() !=
		"invalid refresh token" {

		t.Fatalf(
			"expected invalid refresh token, got %q",
			err.Error(),
		)
	}
}
