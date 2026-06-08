package auth

import (
	"context"
	"errors"
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

	_, err = s.Queries.GetUserByEmail(
		ctx,
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

	_, err = s.Queries.GetUserByUsername(
		ctx,
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

	user, err := s.Queries.CreateUser(
		ctx,
		db.CreateUserParams{
			Email: req.Email,
			Username: req.Username,
			PasswordHash: pgtype.Text{
				String: hashedPassword,
				Valid: true,
			},
			GoogleID: pgtype.Text{
				Valid: false,
			},
			ProfilePicture: pgtype.Text{
				Valid: false,
			},
		},
	)
	if err != nil {
		return "","", err
	}

	return s.createSession(
		ctx,
		s.Queries,
		user,
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

	user, err := s.Queries.GetUserByEmail(
		ctx,
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

	return s.createSession(
		ctx,
		s.Queries,
		user,
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

	err := s.Queries.DeleteRefreshToken(
		ctx,
		hashedToken,
	)

	if err != nil {
		return err
	}

	return nil
}