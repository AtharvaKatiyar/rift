package auth

import (
	"context"
	"github.com/AtharvaKatiyar/rift/internal/utils"
)

func (s *Service) LogoutAll(
	ctx context.Context,
	userID string,
) error {

	pgUserID, err :=
		utils.ParseUUID(
			userID,
		)

	if err != nil {
		return err
	}

	logoutCtx, cancel :=
		dbTimeoutContext(ctx)

	defer cancel()

	return s.Queries.
		DeleteUserRefreshTokens(
			logoutCtx,
			pgUserID,
		)
}