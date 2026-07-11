package auth

import (
	"context"
	"errors"
	"time"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
	db "github.com/AtharvaKatiyar/rift/internal/database/sqlc"
	"github.com/jackc/pgx/v5/pgxpool"
	"strings"
)

type Service struct {
	Queries *db.Queries
	DB      *pgxpool.Pool
	Secret  string
}

const (
	authDBTimeout =
		3 * time.Second

	authTokenTimeout =
		2 * time.Second
)

func (s *Service) Register( 
	ctx context.Context, 
	req RegisterRequest, 
	userAgent string,
	ipAddress string,
) (string, string, error) {

	req.Email = strings.TrimSpace(
		strings.ToLower(req.Email),
	)

	req.Username = strings.TrimSpace(
		strings.ToLower(req.Username),
	)

	err := ValidateUsername(req.Username)
	if err != nil {
		return "","", err
	}

	err = ValidatePassword(req.Password)
	if err != nil {
		return "", "", err
	}

	err = ValidateEmail(req.Email)
	if err != nil {
		return "", "", err
	}

	emailCtx, cancel :=
		dbTimeoutContext(ctx)

	defer cancel()

	_, err = s.Queries.GetUserByEmail(
		emailCtx,
		req.Email,
	)

	if err == nil {
		return "","", errors.New(
			"user already exists",
		)
	}

	if !errors.Is(err, pgx.ErrNoRows) {
		return "","", err
	}

	usernameCtx, cancel :=
		dbTimeoutContext(ctx)

	defer cancel()

	_, err = s.Queries.GetUserByUsername(
		usernameCtx,
		req.Username,
	)

	if err == nil {
		return "","", errors.New(
			"username already taken",
		)
	}

	if !errors.Is(err, pgx.ErrNoRows) {
		return "","", err
	}

	hashedPassword, err := HashPassword(
		req.Password,
	)

	if err != nil {
		return "","", err
	}

	createCtx, cancel :=
		dbTimeoutContext(ctx)

	defer cancel()

	tx, err :=
		s.DB.BeginTx(
			createCtx,
			pgx.TxOptions{},
		)

	if err != nil {
		return "", "", err
	}

	defer tx.Rollback(
		createCtx,
	)

	txQueries :=
		s.Queries.WithTx(
			tx,
		)

	user, err :=
		txQueries.CreateUser(
			createCtx,
			db.CreateUserParams{
				Email:
					req.Email,

				Username:
					req.Username,

				PasswordHash:
					pgtype.Text{
						String:
							hashedPassword,

						Valid:
							true,
					},

				GoogleID:
					pgtype.Text{
						Valid:
							false,
					},

				ProfilePicture:
					pgtype.Text{
						Valid:
							false,
					},
			},
		)

	if err != nil {
		return "", "", err
	}

	_, err =
		txQueries.CreateUserSubscription(
			createCtx,
			user.ID,
		)

	if err != nil {
		return "", "", err
	}

	err =
		tx.Commit(
			createCtx,
		)

	if err != nil {
		return "", "", err
	}

	sessionCtx, cancel :=
		tokenTimeoutContext(ctx)

	defer cancel()

	return s.createSession(
		sessionCtx,
		s.Queries,
		SessionUser{
			ID: user.ID,
			Email: user.Email,
		},
		userAgent,
		ipAddress,

	)
}

func (s *Service) Login(
	ctx context.Context,
	req LoginRequest,
	userAgent string,
	ipAddress string,
) (string, string, error) {

	req.Email = strings.TrimSpace(
		strings.ToLower(req.Email),
	)
	emailCtx, cancel :=
		dbTimeoutContext(ctx)

	defer cancel()

	user, err := s.Queries.GetUserByEmail(
		emailCtx,
		req.Email,
	)
	if errors.Is(err, pgx.ErrNoRows) {
		return  "", "", errors.New(
			"invalid credentials",
		)
	}

	if err != nil {
		return "","", err
	}

	if !user.PasswordHash.Valid {
		return "","", errors.New(
			"invalid credentials",
		)
	}

	err = CheckPassword(
		user.PasswordHash.String,
		req.Password,
	)

	if err != nil {
		return "","", errors.New(
			"invalid credentials",
		)
	}

	sessionCtx, cancel :=
		tokenTimeoutContext(ctx)

	defer cancel()

	return s.createSession(
		sessionCtx,
		s.Queries,
		SessionUser{
			ID: user.ID,
			Email: user.Email,
		},
		userAgent,
		ipAddress,

	)
}

func (s *Service) Logout(
	ctx context.Context,
	refreshToken string,
) error {

	hashedToken :=
		HashToken(
			refreshToken,
		)

	logoutCtx, cancel :=
		dbTimeoutContext(ctx)

	defer cancel()

	err := s.Queries.DeleteRefreshToken(
		logoutCtx,
		hashedToken,
	)

	if err != nil {
		return err
	}

	return nil
}