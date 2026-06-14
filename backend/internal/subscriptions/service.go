package subscription

import (
	"context"
	"errors"
	"fmt"
	"github.com/jackc/pgx/v5/pgtype"
	db "github.com/AtharvaKatiyar/rift/internal/database/sqlc"
)

type Service struct {
	Queries *db.Queries
}

func (
	s *Service,
) GetSubscription(
	ctx context.Context,
	userID string,
) (
	*SubscriptionResponse,
	error,
) {

	pgUserID, err :=
		parseUUID(
			userID,
		)

	if err != nil {
		return nil, err
	}

	subscription, err :=
		s.Queries.GetUserSubscription(
			ctx,
			pgUserID,
		)

	if err != nil {
		return nil, err
	}

	linksUsed, err :=
		s.Queries.
			CountUserLinksForSubscription(
				ctx,
				pgUserID,
			)

	if err != nil {
		return nil, err
	}

	plan :=
		GetPlan(
			string(
				subscription.Plan,
			),
		)

	remaining :=
		plan.Limit -
			linksUsed

	if remaining < 0 {
		remaining = 0
	}

	canCreate :=
		linksUsed <
			plan.Limit

	return &SubscriptionResponse{
		Plan:
			plan.Name,

		Status:
			string(
				subscription.Status,
			),

		LinkLimit:
			plan.Limit,

		LinksUsed:
			linksUsed,

		LinksRemaining:
			remaining,

		CanCreateLinks:
			canCreate,

		CanUpgradeTo:
			GetAllowedUpgrades(
				plan.Name,
			),
	}, nil
}

func (
	s *Service,
) CreateUpgradeIntent(
	ctx context.Context,
	userID string,
	targetPlan string,
) error {

	err :=
		ValidateUpgradePlan(
			targetPlan,
		)

	if err != nil {
		return err
	}

	pgUserID, err :=
		parseUUID(
			userID,
		)

	if err != nil {
		return err
	}

	currentSubscription,
		err :=
		s.Queries.
			GetUserSubscription(
				ctx,
				pgUserID,
			)

	if err != nil {
		return err
	}

	currentPlan :=
		string(
			currentSubscription.Plan,
		)

	if !CanUpgrade(
		currentPlan,
		targetPlan,
	) {

		return errors.New(
			"invalid upgrade path",
		)
	}

	return nil
}

func (
	s *Service,
) CreateCheckout(
	ctx context.Context,
	userID string,
	targetPlan string,
) (
	*CheckoutResponse,
	error,
) {

	err :=
		ValidateUpgradePlan(
			targetPlan,
		)

	if err != nil {
		return nil, err
	}

	pgUserID, err :=
		parseUUID(
			userID,
		)

	if err != nil {
		return nil, err
	}

	subscription, err :=
		s.Queries.
			GetUserSubscription(
				ctx,
				pgUserID,
			)

	if err != nil {
		return nil, err
	}

	currentPlan :=
		string(
			subscription.Plan,
		)

	if !CanUpgrade(
		currentPlan,
		targetPlan,
	) {

		return nil,
			errors.New(
				"invalid upgrade path",
			)
	}

	idempotencyKey :=
		fmt.Sprintf(
			"%s:%s",
			userID,
			targetPlan,
		)

	existing, err :=
		s.Queries.
			GetPaymentIntentByIdempotency(
				ctx,
				pgtype.Text{String: idempotencyKey, Valid: true},
			)

	if err == nil &&
		!existing.Processed {

		plan :=
			GetPlan(
				targetPlan,
			)

		return &CheckoutResponse{
			CheckoutID:
				existing.
					ProviderEventID,

			Plan:
				targetPlan,

			Price:
				plan.Price,

			Message:
				"existing checkout found",
		}, nil
	}

	plan :=
		GetPlan(
			targetPlan,
		)

	checkoutID :=
		GenerateCheckoutID()

	_, err =
		s.Queries.
			CreatePaymentIntent(
				ctx,
				db.CreatePaymentIntentParams{
					ProviderEventID:
						checkoutID,

					ProviderName:
						"internal",

					EventType:
						"checkout_created",

					UserID:
						pgUserID,

					Plan:
						targetPlan,

					IdempotencyKey:
						idempotencyKey,
				},
			)

	if err != nil {
		return nil, err
	}

	return &CheckoutResponse{
		CheckoutID:
			checkoutID,

		Plan:
			targetPlan,

		Price:
			plan.Price,

		Message:
			"checkout created",
	}, nil
}