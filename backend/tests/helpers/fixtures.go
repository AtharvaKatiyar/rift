package helpers

import (
	"fmt"
	"time"

	"github.com/google/uuid"

	"github.com/AtharvaKatiyar/rift/internal/auth"
	"github.com/AtharvaKatiyar/rift/internal/links"
)

func TestRegisterRequest() auth.RegisterRequest {

	id :=
		time.Now().
			UnixNano()

	return auth.RegisterRequest{
		Username:
			fmt.Sprintf(
				"user_%d",
				id,
			),
		Email:
			fmt.Sprintf(
				"user_%d@test.com",
				id,
			),
		Password:
			"StrongPass123!",
	}
}

func TestLoginRequest(
	email string,
) auth.LoginRequest {

	return auth.LoginRequest{
		Email: email,
		Password:
			"StrongPass123!",
	}
}

func TestCreateLinkRequest() links.CreateLinkRequest {

	return links.CreateLinkRequest{
		Title:
			"Google",
		Slug:
			uuid.NewString()[:8],
		TargetURL:
			"https://google.com",
	}
}