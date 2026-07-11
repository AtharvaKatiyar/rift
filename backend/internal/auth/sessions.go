package auth

import (
	"context"
	"time"

	"github.com/jackc/pgx/v5/pgtype"

	db "github.com/AtharvaKatiyar/rift/internal/database/sqlc"
)

type SessionUser struct {
	ID pgtype.UUID
	Email string
}

func (s *Service) createSession(
	ctx context.Context,
	q *db.Queries,
	user SessionUser,
	userAgent string,
	ipAddress string,
) (string, string, error) {

	accessToken, err :=
		GenerateAccessToken(
			user.ID.String(),
			user.Email,
			s.Secret,
		)

	if err != nil {
		return "", "", err
	}

	refreshToken, err :=
		GenerateRefreshToken(
			user.ID.String(),
			user.Email,
			s.Secret,
		)

	if err != nil {
		return "", "", err
	}

	hashedRefreshToken :=
		HashToken(
			refreshToken,
		)

	dbCtx, cancel :=
		dbTimeoutContext(ctx)

	defer cancel()

	err = q.CreateRefreshToken(
		dbCtx,
		db.CreateRefreshTokenParams{
			UserID: user.ID,
			TokenHash:
				hashedRefreshToken,
			ExpiresAt:
				pgtype.Timestamptz{
					Time: time.Now().Add(
						RefreshTokenDuration,
					),
					Valid: true,
				},

			UserAgent:
				pgtype.Text{
					String:
						userAgent,
					Valid:
						userAgent != "",
				},

			IpAddress:
				pgtype.Text{
					String:
						ipAddress,
					Valid:
						ipAddress != "",
				},

		},
	)

	if err != nil {
		return "", "", err
	}

	return accessToken,
		refreshToken,
		nil
}