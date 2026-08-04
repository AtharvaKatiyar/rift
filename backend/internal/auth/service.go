package auth

import (
	"context"
	"errors"
	db "github.com/AtharvaKatiyar/rift/internal/database/sqlc"
	email "github.com/AtharvaKatiyar/rift/internal/email"
	"github.com/AtharvaKatiyar/rift/internal/logger"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/jackc/pgx/v5/pgxpool"
	"go.uber.org/zap"
	"strings"
	"time"
)

type Service struct {
	Queries     *db.Queries
	DB          *pgxpool.Pool
	Secret      string
	Email       email.Service
	FrontendURL string
}

const (
	authDBTimeout = 3 * time.Second

	authTokenTimeout = 2 * time.Second
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
		return "", "", err
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
		return "", "", errors.New(
			"user already exists",
		)
	}

	if !errors.Is(err, pgx.ErrNoRows) {
		return "", "", err
	}

	usernameCtx, cancel :=
		dbTimeoutContext(ctx)

	defer cancel()

	_, err = s.Queries.GetUserByUsername(
		usernameCtx,
		req.Username,
	)

	if err == nil {
		return "", "", errors.New(
			"username already taken",
		)
	}

	if !errors.Is(err, pgx.ErrNoRows) {
		return "", "", err
	}

	hashedPassword, err := HashPassword(
		req.Password,
	)

	if err != nil {
		return "", "", err
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

	accessToken,
		refreshToken,
		err :=
		s.createSession(
			sessionCtx,
			s.Queries,
			SessionUser{
				ID:    user.ID,
				Email: user.Email,
			},
			userAgent,
			ipAddress,
		)

	if err != nil {
		return "", "", err
	}

	go func() {

		logger.Log.Info(
			"SendVerificationEmail called",
			zap.String("email", req.Email),
		)

		if err := s.SendVerificationEmail(
			context.Background(),
			SendVerificationEmailRequest{
				Email: user.Email,
			},
		); err != nil {

			logger.Log.Warn(
				"failed to send verification email",
				zap.String(
					"email",
					user.Email,
				),
				zap.Error(err),
			)
		}

	}()

	return accessToken,
		refreshToken,
		nil
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

		_ = CheckPassword(DummyPasswordHash, req.Password)

		return "", "", errors.New(
			"invalid credentials",
		)
	}

	if err != nil {
		return "", "", err
	}

	if !user.PasswordHash.Valid {
		return "", "", errors.New(
			"invalid credentials",
		)
	}

	err = CheckPassword(
		user.PasswordHash.String,
		req.Password,
	)

	if err != nil {
		return "", "", errors.New(
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
			ID:    user.ID,
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

func (s *Service) ForgotPassword(
	ctx context.Context,
	req ForgotPasswordRequest,
) error {

	req.Email = strings.TrimSpace(
		strings.ToLower(req.Email),
	)

	if err := ValidateEmail(
		req.Email,
	); err != nil {
		return err
	}

	logger.Log.Info("ForgotPassword: validated email")

	dbCtx,
		cancel :=
		dbTimeoutContext(ctx)

	defer cancel()

	user, err :=
		s.Queries.GetUserByEmail(
			dbCtx,
			req.Email,
		)

	if errors.Is(err, pgx.ErrNoRows) {
		_ = CheckPassword(
			DummyPasswordHash,
			dummyPassword,
		)
		return nil
	}

	if err != nil {
		return err
	}
	logger.Log.Info(
		"ForgotPassword: found user",
		zap.String("email", user.Email),
	)

	tx,
		err :=
		s.DB.BeginTx(
			dbCtx,
			pgx.TxOptions{},
		)

	if err != nil {

		logger.Log.Error(
			"BeginTx failed",
			zap.Error(err),
		)

		return err
	}

	logger.Log.Info("ForgotPassword: transaction started")

	defer func() {
		_ = tx.Rollback(dbCtx)
	}()

	txQueries :=
		s.Queries.WithTx(
			tx,
		)

	err = txQueries.DeleteExpiredPasswordResetTokens(
		dbCtx,
	)

	if err != nil {

		logger.Log.Error(
			"DeleteExpiredPasswordResetTokens failed",
			zap.Error(err),
		)

		return err
	}

	logger.Log.Info("Deleted expired tokens")

	err =
		txQueries.DeletePasswordResetTokensForUser(
			dbCtx,
			user.ID,
		)
	logger.Log.Info("Deleted previous tokens")
	if err != nil {
		return err
	}

	rawToken,
		tokenHash,
		err :=
		GeneratePasswordResetToken()

	if err != nil {

		return err
	}

	logger.Log.Info("Generated reset token")
	err =
		txQueries.CreatePasswordResetToken(
			dbCtx,
			db.CreatePasswordResetTokenParams{

				UserID: user.ID,

				TokenHash: tokenHash,

				ExpiresAt: pgtype.Timestamptz{
					Time: time.Now().UTC().Add(
						PasswordResetTokenTTL,
					),
					Valid: true,
				},
			},
		)

	if err != nil {

		return err
	}

	logger.Log.Info("Inserted reset token")
	err =
		tx.Commit(
			dbCtx,
		)

	if err != nil {

		return err
	}

	logger.Log.Info("Committed transaction")
	resetURL :=
		s.FrontendURL +
			"/reset-password?token=" +
			rawToken

	emailCtx,
		cancel :=
		context.WithTimeout(
			context.Background(),
			15*time.Second,
		)

	defer cancel()
	logger.Log.Info("About to send email")
	err = s.Email.SendPasswordResetEmail(
		emailCtx,
		email.PasswordResetRequest{

			To: user.Email,

			Name: user.Username,

			ResetURL: resetURL,

			ExpiryMinutes: int(
				PasswordResetTokenTTL.Minutes(),
			),
		},
	)
	if err != nil {
		logger.Log.Error(
			"failed to send password reset email",
			zap.String("email", user.Email),
			zap.Error(err),
		)

		return err
	}
	return nil
}

func (s *Service) ResetPassword(
	ctx context.Context,
	req ResetPasswordRequest,
) error {
	req.Token = strings.TrimSpace(req.Token)

	if req.Token == "" {
		return errors.New(
			"invalid or expired reset token",
		)
	}

	if err := ValidatePassword(
		req.Password,
	); err != nil {
		return err
	}

	dbCtx,
		cancel :=
		dbTimeoutContext(ctx)

	defer cancel()

	tokenHash :=
		HashPasswordResetToken(
			req.Token,
		)

	resetToken,
		err :=
		s.Queries.GetValidPasswordResetToken(
			dbCtx,
			tokenHash,
		)

	if errors.Is(
		err,
		pgx.ErrNoRows,
	) {

		return errors.New(
			"invalid or expired reset token",
		)
	}

	if err != nil {

		return err
	}

	hashedPassword,
		err :=
		HashPassword(
			req.Password,
		)

	if err != nil {

		return err
	}

	tx,
		err :=
		s.DB.BeginTx(
			dbCtx,
			pgx.TxOptions{},
		)

	if err != nil {

		return err
	}

	defer func() {
		_ = tx.Rollback(dbCtx)
	}()

	txQueries :=
		s.Queries.WithTx(
			tx,
		)

	if err := txQueries.DeleteExpiredPasswordResetTokens(
		dbCtx,
	); err != nil {
		return err
	}

	err =
		txQueries.UpdateUserPassword(
			dbCtx,
			db.UpdateUserPasswordParams{

				ID: resetToken.UserID,

				PasswordHash: pgtype.Text{
					String: hashedPassword,
					Valid:  true,
				},
			},
		)

	if err != nil {

		return err
	}

	err = txQueries.DeletePasswordResetToken(
		dbCtx,
		db.DeletePasswordResetTokenParams{
			ID:     resetToken.ID,
			UserID: resetToken.UserID,
		},
	)

	if err != nil {

		return err
	}

	err =
		txQueries.DeletePasswordResetTokensForUser(
			dbCtx,
			resetToken.UserID,
		)

	if err != nil {

		return err
	}

	err =
		txQueries.DeleteRefreshTokensByUser(
			dbCtx,
			resetToken.UserID,
		)

	if err != nil {

		return err
	}

	err =
		tx.Commit(
			dbCtx,
		)

	if err != nil {

		return err
	}

	logger.Log.Info(
		"password reset completed",
		zap.String("user_id", resetToken.UserID.String()),
	)

	return nil
}

func (s *Service) SendVerificationEmail(
	ctx context.Context,
	req SendVerificationEmailRequest,
) error {

	req.Email = strings.TrimSpace(
		strings.ToLower(req.Email),
	)

	if err := ValidateEmail(
		req.Email,
	); err != nil {
		return err
	}

	dbCtx,
		cancel :=
		dbTimeoutContext(ctx)

	defer cancel()

	user, err :=
		s.Queries.GetUserByEmail(
			dbCtx,
			req.Email,
		)

	logger.Log.Info(
		"ForgotPassword: GetUserByEmail finished",
	)

	if err != nil {

		logger.Log.Error(
			"ForgotPassword: GetUserByEmail error",
			zap.Error(err),
		)
	}

	if errors.Is(
		err,
		pgx.ErrNoRows,
	) {
		return nil
	}

	if user.EmailVerified {
		return nil
	}

	tx,
		err :=
		s.DB.BeginTx(
			dbCtx,
			pgx.TxOptions{},
		)

	if err != nil {

		return err
	}

	defer func() {
		_ = tx.Rollback(dbCtx)
	}()

	txQueries :=
		s.Queries.WithTx(
			tx,
		)

	if err := txQueries.DeleteExpiredEmailVerificationTokens(
		dbCtx,
	); err != nil {
		return err
	}

	if err := txQueries.DeleteEmailVerificationTokensForUser(
		dbCtx,
		user.ID,
	); err != nil {
		return err
	}

	rawToken,
		tokenHash,
		err :=
		GenerateEmailVerificationToken()

	if err != nil {

		return err
	}

	if err := txQueries.CreateEmailVerificationToken(
		dbCtx,
		db.CreateEmailVerificationTokenParams{

			UserID: user.ID,

			TokenHash: tokenHash,

			ExpiresAt: pgtype.Timestamptz{
				Time: time.Now().
					UTC().
					Add(
						EmailVerificationTokenTTL,
					),

				Valid: true,
			},
		},
	); err != nil {
		return err
	}

	if err := tx.Commit(
		dbCtx,
	); err != nil {
		return err
	}

	verifyURL :=
		s.FrontendURL +
			"/verify-email?token=" +
			rawToken

	emailCtx,
		cancel :=
		context.WithTimeout(
			context.Background(),
			15*time.Second,
		)

	defer cancel()

	err = s.Email.SendEmailVerificationEmail(
		emailCtx,
		email.EmailVerificationRequest{

			To: user.Email,

			Name: user.Username,

			VerificationURL: verifyURL,

			ExpiryHours: int(
				EmailVerificationTokenTTL.Hours(),
			),
		},
	)

	if err != nil {

		logger.Log.Error(
			"failed to send verification email",
			zap.String(
				"email",
				user.Email,
			),
			zap.Error(err),
		)

		return err
	}

	return nil
}

func (s *Service) VerifyEmail(
	ctx context.Context,
	req VerifyEmailRequest,
) error {

	req.Token = strings.TrimSpace(
		req.Token,
	)

	if req.Token == "" {
		return ErrInvalidVerificationToken
	}

	dbCtx,
		cancel :=
		dbTimeoutContext(ctx)

	defer cancel()

	tokenHash :=
		HashEmailVerificationToken(
			req.Token,
		)

	verifyToken,
		err :=
		s.Queries.GetValidEmailVerificationToken(
			dbCtx,
			tokenHash,
		)

	if errors.Is(
		err,
		pgx.ErrNoRows,
	) {

		return ErrInvalidVerificationToken
	}

	if err != nil {

		return err
	}

	tx,
		err :=
		s.DB.BeginTx(
			dbCtx,
			pgx.TxOptions{},
		)

	if err != nil {

		return err
	}

	defer func() {
		_ = tx.Rollback(
			dbCtx,
		)
	}()

	txQueries :=
		s.Queries.WithTx(
			tx,
		)

	if err := txQueries.DeleteExpiredEmailVerificationTokens(
		dbCtx,
	); err != nil {
		return err
	}

	if err := txQueries.VerifyUserEmail(
		dbCtx,
		verifyToken.UserID,
	); err != nil {
		return err
	}

	if err := txQueries.DeleteEmailVerificationToken(
		dbCtx,
		db.DeleteEmailVerificationTokenParams{
			ID:     verifyToken.ID,
			UserID: verifyToken.UserID,
		},
	); err != nil {
		return err
	}

	if err := txQueries.DeleteEmailVerificationTokensForUser(
		dbCtx,
		verifyToken.UserID,
	); err != nil {
		return err
	}

	if err := tx.Commit(
		dbCtx,
	); err != nil {
		return err
	}

	logger.Log.Info(
		"email verified",
		zap.String(
			"user_id",
			verifyToken.UserID.String(),
		),
	)

	return nil
}
