package links

import (
	"context"
	"errors"
	"strings"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/redis/go-redis/v9"

	db "github.com/AtharvaKatiyar/rift/internal/database/sqlc"
	"github.com/AtharvaKatiyar/rift/internal/utils"
	"github.com/AtharvaKatiyar/rift/internal/cache"
)

const MaxKeyGenerationAttempts = 5
const FreeTierLimit = 10

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
) (*db.User, error) {

	user, err := s.Queries.GetUserByID(
		ctx,
		userID,
	)
	if err != nil {
		return nil, errors.New("user not found")
	}

	count, err := s.Queries.CountUserLinks(
		ctx,
		userID,
	)
	if err != nil {
		return nil, err
	}

	if count >= FreeTierLimit {
		return nil, errors.New(
			"free tier limit reached",
		)
	}

	err = s.ensureSlugAvailable(
		ctx,
		userID,
		slug,
	)
	if err != nil {
		return nil, err
	}

	return &user, nil
}

func (s *Service) ensureSlugAvailable(
	ctx context.Context,
	userID pgtype.UUID,
	slug string,
) error {

	_, err := s.Queries.GetLinkBySlug(
		ctx,
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

		_, err = s.Queries.GetLinkByPublicKey(
			ctx,
			publicKey,
		)

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

	user, err := s.validateLinkCreation(
		ctx,
		pgUserID,
		req.Slug,
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

	link, err := s.Queries.CreateLink(
		ctx,
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
		user.Username,
		req.Slug,
		publicKey,
	)

	return &link, publicURL, nil
}

func (s *Service) GetUserLinks(
	ctx context.Context,
	userID string,
) ([]db.CentralLink, error) {

	pgUserID, err := parseUUID(
		userID,
	)
	if err != nil {
		return nil, err
	}

	links, err := s.Queries.GetUserLinks(
		ctx,
		pgUserID,
	)
	if err != nil {
		return nil, err
	}

	return links, nil
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

	existingLink, err :=
		s.Queries.GetLinkByIDAndUserID(
			ctx,
			db.GetLinkByIDAndUserIDParams{
				ID: parsedLinkID,
				UserID: parsedUserID,
			},
		)

	if err != nil {
		return errors.New(
			"link not found",
		)
	}
	
	if existingLink.Slug != createReq.Slug {
		_,err := s.Queries.GetLinkBySlug(
			ctx,
			db.GetLinkBySlugParams{
				UserID: parsedUserID,
				Slug: createReq.Slug,
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
	
	updatedLink, err :=
		s.Queries.UpdateLink(
			ctx,
			db.UpdateLinkParams{
				ID:         parsedLinkID,
				UserID:     parsedUserID,
				Title:      createReq.Title,
				Slug:       createReq.Slug,
				TargetUrl:  createReq.TargetURL,
			},
		)

	if err != nil {
		return err
	}

	// Save history
	_ = s.Queries.CreateLinkHistory(
		ctx,
		db.CreateLinkHistoryParams{
			LinkID: existingLink.ID,
			OldTargetUrl:
				existingLink.TargetUrl,
			NewTargetUrl:
				updatedLink.TargetUrl,
		},
	)

	user, err := s.Queries.GetUserByID(
		ctx,
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
		_ = cache.DeleteRedirect(
			ctx,
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

	link, err :=
		s.Queries.GetLinkByIDAndUserID(
			ctx,
			db.GetLinkByIDAndUserIDParams{
				ID: parsedLinkID,
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

	_ = s.Queries.CreateLinkHistory(
		ctx,
		db.CreateLinkHistoryParams{
			LinkID: link.ID,
			OldTargetUrl: link.TargetUrl,
			NewTargetUrl: "",
		},
	)

	s.Queries.DeleteLink(
		ctx,
		db.DeleteLinkParams{
			ID:     link.ID,
			UserID: link.UserID,
		},
	)

	if err != nil {
		return err
	}

	user, err := s.Queries.GetUserByID(
		ctx,
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
		_ = cache.DeleteRedirect(
			ctx,
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

	_, err =
		s.Queries.ToggleLinkStatus(
			ctx,
			db.ToggleLinkStatusParams{
				ID: link.ID,
				UserID: link.UserID,
				IsActive: !link.IsActive,
			},
		)

	if err != nil {
		return err
	}

	user, err := s.Queries.GetUserByID(
		ctx,
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
		_ = cache.DeleteRedirect(
			ctx,
			s.Redis,
			cacheKey,
		)
	}

	return nil
}