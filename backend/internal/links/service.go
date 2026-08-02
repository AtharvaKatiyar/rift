package links

import (
	"context"
	"errors"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/redis/go-redis/v9"

	"github.com/AtharvaKatiyar/rift/internal/cache"
	db "github.com/AtharvaKatiyar/rift/internal/database/sqlc"
	subscriptionpkg "github.com/AtharvaKatiyar/rift/internal/subscriptions"
	"github.com/AtharvaKatiyar/rift/internal/utils"
)

const (
	MaxKeyGenerationAttempts = 5

	linksDBTimeout = 3 * time.Second

	linksRedisTimeout = 500 * time.Millisecond
)

type Service struct {
	Queries *db.Queries
	BaseURL string
	Redis   *redis.Client
}

func sanitizeRequest(
	req CreateLinkRequest,
) CreateLinkRequest {

	req.Slug = NormalizeSlug(
		req.Slug,
	)

	req.Title = strings.TrimSpace(
		req.Title,
	)

	req.TargetURL = strings.TrimSpace(
		req.TargetURL,
	)

	return req
}

func validateRequest(
	req CreateLinkRequest,
) error {

	if err := ValidateSlug(req.Slug); err != nil {
		return err
	}

	if err := ValidateURL(req.TargetURL); err != nil {
		return err
	}

	return nil
}

func parseUUID(
	userID string,
) (pgtype.UUID, error) {

	parsedUserID, err := uuid.Parse(userID)
	if err != nil {
		return pgtype.UUID{}, err
	}

	return pgtype.UUID{
		Bytes: parsedUserID,
		Valid: true,
	}, nil
}

func (s *Service) validateLinkCreation(
	ctx context.Context,
	userID pgtype.UUID,
	slug string,
	plan string,
) (string, error) {

	userCtx, cancel :=
		dbTimeoutContext(ctx)

	defer cancel()

	user, err := s.Queries.GetUserByID(
		userCtx,
		userID,
	)
	if err != nil {
		return "", errors.New("user not found")
	}

	countCtx, cancel :=
		dbTimeoutContext(ctx)

	defer cancel()

	count, err := s.Queries.CountUserLinks(
		countCtx,
		userID,
	)
	if err != nil {
		return "", err
	}

	planLimit :=
		subscriptionpkg.GetPlanLimit(
			plan,
		)

	if count >= planLimit {

		return "",
			errors.New(
				"plan limit reached",
			)
	}

	err = s.ensureSlugAvailable(
		ctx,
		userID,
		slug,
	)
	if err != nil {
		return "", err
	}

	return user.Username, nil
}

func (s *Service) ensureSlugAvailable(
	ctx context.Context,
	userID pgtype.UUID,
	slug string,
) error {

	slugCtx, cancel :=
		dbTimeoutContext(ctx)

	defer cancel()

	_, err := s.Queries.GetLinkBySlug(
		slugCtx,
		db.GetLinkBySlugParams{
			UserID: userID,
			Slug:   slug,
		},
	)

	if err == nil {
		return errors.New(
			"slug already exists",
		)
	}

	if !errors.Is(err, pgx.ErrNoRows) {
		return err
	}

	return nil
}

func (s *Service) generateUniquePublicKey(
	ctx context.Context,
) (string, error) {

	for i := 0; i < MaxKeyGenerationAttempts; i++ {

		publicKey, err :=
			utils.GeneratePublicKey()
		if err != nil {
			return "", err
		}

		keyCtx, cancel :=
			dbTimeoutContext(ctx)

		_, err = s.Queries.GetLinkByPublicKey(
			keyCtx,
			publicKey,
		)
		cancel()

		if errors.Is(
			err,
			pgx.ErrNoRows,
		) {
			return publicKey, nil
		}

		if err != nil {
			return "", err
		}
	}

	return "", errors.New(
		"failed to generate unique public key",
	)
}

func (s *Service) buildPublicURL(
	username string,
	slug string,
	publicKey string,
) string {

	return s.BaseURL +
		"/u/" +
		username +
		"/" +
		slug +
		"/" +
		publicKey
}

func (s *Service) CreateLink(
	ctx context.Context,
	userID string,
	req CreateLinkRequest,
) (*db.CentralLink, string, error) {

	req = sanitizeRequest(req)

	if err := validateRequest(req); err != nil {
		return nil, "", err
	}

	pgUserID, err := parseUUID(userID)
	if err != nil {
		return nil, "", err
	}

	subscription, err :=
		s.Queries.GetUserSubscription(
			ctx,
			pgUserID,
		)

	if err != nil {
		return nil, "",
			err
	}

	username, err := s.validateLinkCreation(
		ctx,
		pgUserID,
		req.Slug,
		string(subscription.Plan),
	)
	if err != nil {
		return nil, "", err
	}

	publicKey, err := s.generateUniquePublicKey(
		ctx,
	)
	if err != nil {
		return nil, "", err
	}

	createCtx, cancel :=
		dbTimeoutContext(ctx)

	defer cancel()

	link, err := s.Queries.CreateLink(
		createCtx,
		db.CreateLinkParams{
			UserID:    pgUserID,
			Title:     req.Title,
			Slug:      req.Slug,
			UniqueID:  publicKey,
			TargetUrl: req.TargetURL,
		},
	)
	if err != nil {
		return nil, "", err
	}

	publicURL := s.buildPublicURL(
		username,
		req.Slug,
		publicKey,
	)

	return &link, publicURL, nil
}

func (s *Service) GetUserLinks(
	ctx context.Context,
	userID string,
	page int32,
	pageSize int32,
) ([]db.CentralLink, int64, int32, error) {

	pgUserID, err := parseUUID(
		userID,
	)
	if err != nil {
		return nil, 0, 0, err
	}

	linksCtx, cancel :=
		dbTimeoutContext(ctx)

	defer cancel()

	totalItems, err :=
		s.Queries.CountUserLinks(
			linksCtx,
			pgUserID,
		)
	if err != nil {
		return nil,
			0,
			0,
			err
	}

	totalPages :=
		(totalItems +
			int64(pageSize) - 1) /
			int64(pageSize)

	if totalPages == 0 {

		totalPages = 1
	}

	if int64(page) >
		totalPages {

		page =
			int32(
				totalPages,
			)
	}

	offset :=
		(page - 1) *
			pageSize

	links, err :=
		s.Queries.GetUserLinks(
			linksCtx,

			db.GetUserLinksParams{
				UserID: pgUserID,

				Limit: pageSize,

				Offset: offset,
			},
		)

	if err != nil {
		return nil, 0, 0, err
	}

	return links, totalItems, page, nil
}

func (s *Service) UpdateLink(
	ctx context.Context,
	userID string,
	linkID string,
	req UpdateLinkRequest,
) error {

	createReq := CreateLinkRequest{
		Title:     req.Title,
		Slug:      req.Slug,
		TargetURL: req.TargetURL,
	}

	createReq = sanitizeRequest(
		createReq,
	)

	if err := validateRequest(
		createReq,
	); err != nil {
		return err
	}

	parsedUserID, err := parseUUID(
		userID,
	)

	if err != nil {
		return err
	}

	parsedLinkID, err := parseUUID(
		linkID,
	)

	if err != nil {
		return err
	}
	getLinkCtx, cancel :=
		dbTimeoutContext(ctx)

	defer cancel()

	existingLink, err :=
		s.Queries.GetLinkByIDAndUserID(
			getLinkCtx,
			db.GetLinkByIDAndUserIDParams{
				ID:     parsedLinkID,
				UserID: parsedUserID,
			},
		)

	if err != nil {
		return errors.New(
			"link not found",
		)
	}

	if existingLink.Slug != createReq.Slug {
		slugCtx, cancel :=
			dbTimeoutContext(ctx)

		defer cancel()

		_, err := s.Queries.GetLinkBySlug(
			slugCtx,
			db.GetLinkBySlugParams{
				UserID: parsedUserID,
				Slug:   createReq.Slug,
			},
		)

		if err == nil {
			return errors.New(
				"slug already exists",
			)
		}
		if !errors.Is(
			err,
			pgx.ErrNoRows,
		) {
			return err
		}
	}
	updateCtx, cancel :=
		dbTimeoutContext(ctx)

	defer cancel()

	updatedLink, err :=
		s.Queries.UpdateLink(
			updateCtx,
			db.UpdateLinkParams{
				ID:        parsedLinkID,
				UserID:    parsedUserID,
				Title:     createReq.Title,
				Slug:      createReq.Slug,
				TargetUrl: createReq.TargetURL,
			},
		)

	if err != nil {
		return err
	}

	historyCtx, cancel :=
		dbTimeoutContext(ctx)

	defer cancel()
	// Save history
	_ = s.Queries.CreateLinkHistory(
		historyCtx,
		db.CreateLinkHistoryParams{
			LinkID:       existingLink.ID,
			OldTargetUrl: existingLink.TargetUrl,
			NewTargetUrl: updatedLink.TargetUrl,
		},
	)

	userCtx, cancel :=
		dbTimeoutContext(ctx)

	defer cancel()

	user, err := s.Queries.GetUserByID(
		userCtx,
		parsedUserID,
	)

	if err != nil {
		return err
	}

	// CRITICAL:
	// delete redis cache
	cacheKey :=
		user.Username +
			":" +
			existingLink.Slug +
			":" +
			existingLink.UniqueID

	if s.Redis != nil {
		redisCtx, cancel :=
			redisTimeoutContext(ctx)

		defer cancel()

		_ = cache.DeleteRedirect(
			redisCtx,
			s.Redis,
			cacheKey,
		)
	}

	return nil
}

func (s *Service) GetLink(
	ctx context.Context,
	userID string,
	linkID string,
) (*db.CentralLink, error) {

	parsedUserID, err := parseUUID(
		userID,
	)

	if err != nil {
		return nil, err
	}

	parsedLinkID, err := parseUUID(
		linkID,
	)

	if err != nil {
		return nil, err
	}

	getLinkCtx, cancel :=
		dbTimeoutContext(ctx)

	defer cancel()

	link, err :=
		s.Queries.GetLinkByIDAndUserID(
			getLinkCtx,
			db.GetLinkByIDAndUserIDParams{
				ID:     parsedLinkID,
				UserID: parsedUserID,
			},
		)

	if err != nil {
		return nil,
			errors.New("link not found")
	}

	return &link, nil
}

func (s *Service) DeleteLink(
	ctx context.Context,
	userID string,
	linkID string,
) error {

	link, err := s.GetLink(
		ctx,
		userID,
		linkID,
	)

	if err != nil {
		return err
	}
	historyCtx, cancel :=
		dbTimeoutContext(ctx)

	defer cancel()

	_ = s.Queries.CreateLinkHistory(
		historyCtx,
		db.CreateLinkHistoryParams{
			LinkID:       link.ID,
			OldTargetUrl: link.TargetUrl,
			NewTargetUrl: "",
		},
	)

	deleteCtx, deleteCancel :=
		dbTimeoutContext(ctx)

	defer deleteCancel()

	err = s.Queries.DeleteLink(
		deleteCtx,
		db.DeleteLinkParams{
			ID:     link.ID,
			UserID: link.UserID,
		},
	)

	if err != nil {
		return err
	}
	userCtx, userCancel :=
		dbTimeoutContext(ctx)

	defer userCancel()

	user, err := s.Queries.GetUserByID(
		userCtx,
		link.UserID,
	)

	if err != nil {
		return err
	}

	cacheKey :=
		user.Username +
			":" +
			link.Slug +
			":" +
			link.UniqueID

	if s.Redis != nil {
		redisCtx, redisCancel :=
			redisTimeoutContext(ctx)

		defer redisCancel()

		_ = cache.DeleteRedirect(
			redisCtx,
			s.Redis,
			cacheKey,
		)
	}

	return nil
}

func (s *Service) ToggleLinkStatus(
	ctx context.Context,
	userID string,
	linkID string,
) error {

	link, err := s.GetLink(
		ctx,
		userID,
		linkID,
	)

	if err != nil {
		return err
	}

	toggleCtx, toggleCancel :=
		dbTimeoutContext(ctx)

	defer toggleCancel()

	_, err =
		s.Queries.ToggleLinkStatus(
			toggleCtx,
			db.ToggleLinkStatusParams{
				ID:       link.ID,
				UserID:   link.UserID,
				IsActive: !link.IsActive,
			},
		)

	if err != nil {
		return err
	}
	userCtx, userCancel :=
		dbTimeoutContext(ctx)

	defer userCancel()
	user, err := s.Queries.GetUserByID(
		userCtx,
		link.UserID,
	)

	if err != nil {
		return err
	}

	cacheKey :=
		user.Username +
			":" +
			link.Slug +
			":" +
			link.UniqueID

	if s.Redis != nil {
		redisCtx, redisCancel :=
			redisTimeoutContext(ctx)

		defer redisCancel()
		_ = cache.DeleteRedirect(
			redisCtx,
			s.Redis,
			cacheKey,
		)
	}

	return nil
}
