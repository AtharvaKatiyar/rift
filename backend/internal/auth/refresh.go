package auth

import (
	"context"
	"database/sql"
	"errors"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
	db "github.com/AtharvaKatiyar/rift/internal/database/sqlc"
)

func (s *Service) RefreshSession(
	ctx context.Context,
	refreshToken string,
	userAgent string,
	ipAddress string,
) (
	string,
	string,
	error,
) {

	_, err :=
		ValidateToken(
			refreshToken,
			s.Secret,
			"refresh",
		)

	if err != nil {
		return "", "",
			errors.New(
				"invalid refresh token",
			)
	}

	hashedToken :=
		HashToken(
			refreshToken,
		)

	tx, err :=
		s.DB.Begin(
			ctx,
		)

	if err != nil {
		return "", "", err
	}

	defer func() {
		_ = tx.Rollback(ctx)
	}()

	qtx :=
		s.Queries.WithTx(
			tx,
		)

	storedToken, err :=
		qtx.GetRefreshTokenForUpdate(
			ctx,
			hashedToken,
		)

	if errors.Is(
		err,
		pgx.ErrNoRows,
	) || errors.Is(
		err,
		sql.ErrNoRows,
	) {

		return "", "",
			errors.New(
				"invalid refresh token",
			)
	}

	if err != nil {
		return "", "", err
	}

	if storedToken.RevokedAt.Valid {

		err :=
			qtx.DeleteUserRefreshTokens(
				ctx,
				storedToken.UserID,
			)

		if err != nil {
			return "", "", err
		}

		err =
			tx.Commit(
				ctx,
			)

		if err != nil {
			return "", "", err
		}

		return "", "",
			errors.New(
				"refresh token reuse detected",
			)
	}

	if storedToken.ExpiresAt.Time.Before(
		time.Now(),
	) {

		return "", "",
			errors.New(
				"refresh token expired",
			)
	}

	user, err :=
		qtx.GetUserByID(
			ctx,
			storedToken.UserID,
		)

	if err != nil {
		return "", "", err
	}

	newAccessToken,
		newRefreshToken,
		err :=
		s.createSession(
			ctx,
			qtx,
			user,
			userAgent,
			ipAddress,
		)

	if err != nil {
		return "", "", err
	}

	newTokenHash :=
		HashToken(
			newRefreshToken,
		)

	err =
		qtx.ReplaceRefreshToken(
			ctx,
			db.ReplaceRefreshTokenParams{
				TokenHash:
					hashedToken,

				ReplacedByToken:
					pgtype.Text{
						String:
							newTokenHash,
						Valid:
							true,
					},
			},
		)

	if err != nil {
		return "", "", err
	}

	err =
		tx.Commit(
			ctx,
		)

	if err != nil {
		return "", "", err
	}

	return newAccessToken,
		newRefreshToken,
		nil
}