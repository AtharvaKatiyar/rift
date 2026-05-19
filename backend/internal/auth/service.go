package auth

import (
	"context"
	"errors"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
	db "github.com/AtharvaKatiyar/rift/internal/database/sqlc"
	"strings"
)

type Service struct {
	Queries *db.Queries
	Secret  string
}

func (s *Service) Register( ctx context.Context, req RegisterRequest, ) (string, error) {

	req.Email = strings.TrimSpace(
		strings.ToLower(req.Email),
	)

	req.Username = strings.TrimSpace(
		strings.ToLower(req.Username),
	)

	err := ValidateUsername(req.Username)
	if err != nil {
		return "", err
	}

	err = ValidatePassword(req.Password)
	if err != nil {
		return "", err
	}

	err = ValidateEmail(req.Email)
	if err != nil {
		return "", err
	}

	_, err = s.Queries.GetUserByEmail(
		ctx,
		req.Email,
	)

	if err == nil {
		return "", errors.New(
			"user already exists",
		)
	}

	if !errors.Is(err, pgx.ErrNoRows) {
		return "", err
	}

	_, err = s.Queries.GetUserByUsername(
		ctx,
		req.Username,
	)

	if err == nil {
		return "", errors.New(
			"username already taken",
		)
	}

	if !errors.Is(err, pgx.ErrNoRows) {
		return "", err
	}

	hashedPassword, err := HashPassword(
		req.Password,
	)

	if err != nil {
		return "", err
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
		return "", err
	}

	token, err := GenerateJWT(
		user.ID.String(),
		user.Email,
		s.Secret,
	)
	if err != nil {
		return "", err
	}

	return token, nil
}

func (s *Service) Login(
	ctx context.Context,
	req LoginRequest,
) (string, error) {

	user, err := s.Queries.GetUserByEmail(
		ctx,
		req.Email,
	)
	if errors.Is(err, pgx.ErrNoRows) {
		return "", errors.New(
			"invalid credentials",
		)
	}

	if err != nil {
		return "", err
	}

	if !user.PasswordHash.Valid {
		return "", errors.New(
			"invalid credentials",
		)
	}

	err = CheckPassword(
		user.PasswordHash.String,
		req.Password,
	)

	if err != nil {
		return "", errors.New(
			"invalid credentials",
		)
	}

	token, err := GenerateJWT(
		user.ID.String(),
		user.Email,
		s.Secret,
	)
	if err != nil {
		return "", err
	}

	return token, nil
}