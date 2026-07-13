package subscription

import (
	"context"
	// "errors"
	"fmt"
	db "github.com/AtharvaKatiyar/rift/internal/database/sqlc"
	"github.com/google/uuid"
	// "github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Service struct {
	Queries         *db.Queries
	DB              *pgxpool.Pool
	PaymentProvider PaymentProvider
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
		max(
			int64(0),
			plan.Limit-linksUsed,
		)

	canCreate :=
		linksUsed <
			plan.Limit

	usagePercent := int64(0)

	if plan.Limit > 0 {

		usagePercent =
			(linksUsed * 100) /
				plan.Limit
	}

	return &SubscriptionResponse{
		Plan: plan.Name,

		Status: string(
			subscription.Status,
		),

		Price: plan.Price,

		LinkLimit: plan.Limit,

		LinksUsed: linksUsed,

		LinksRemaining: remaining,

		UsagePercent: usagePercent,

		CanCreateLinks: canCreate,

		CanUpgradeTo: GetAllowedUpgrades(
			plan.Name,
		),

		Features: plan.Features,
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

		return ErrInvalidUpgradePath
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
			ErrInvalidUpgradePath
	}

	idempotencyKey :=
		fmt.Sprintf(
			"%s:%s:%s",
			userID,
			targetPlan,
			uuid.NewString(),
		)
	plan :=
		GetPlan(
			targetPlan,
		)

	checkoutSession,
		err :=
		s.PaymentProvider.
			CreateCheckout(
				ctx,
				userID,
				targetPlan,
			)

	// if err != nil {
	// 	return nil, err
	// }
	if err != nil {
		return nil,
			fmt.Errorf(
				"dodo checkout failed: %w",
				err,
			)
	}

	paymentIntent, err :=
		s.Queries.
			CreatePaymentIntent(
				ctx,
				db.CreatePaymentIntentParams{
					ProviderEventID: checkoutSession.CheckoutID,

					Provider: db.PaymentProviderDodo,

					EventType: EventCheckoutCreated,

					UserID: pgUserID,

					Plan: db.NullSubscriptionPlan{
						SubscriptionPlan: db.SubscriptionPlan(targetPlan),
						Valid:            true,
					},

					IdempotencyKey: pgtype.Text{
						String: idempotencyKey,
						Valid:  true,
					},
				},
			)

	// if err != nil {
	// 	return nil, err
	// }
	if err != nil {
		return nil,
			fmt.Errorf(
				"create payment intent failed: %w",
				err,
			)
	}

	return &CheckoutResponse{
		CheckoutID: paymentIntent.ProviderEventID,

		CheckoutURL: checkoutSession.CheckoutURL,

		Plan: targetPlan,

		Price: plan.Price,

		Message: "checkout created",
	}, nil
}

func (
	s *Service,
) GetCheckoutStatus(
	ctx context.Context,
	userID string,
	checkoutID string,
) (
	*PaymentStatusResponse,
	error,
) {
	pgUserID, err :=
		parseUUID(
			userID,
		)

	if err != nil {
		return nil, err
	}
	payment, err :=
		s.Queries.
			GetUserPaymentIntentByCheckoutID(
				ctx,
				db.GetUserPaymentIntentByCheckoutIDParams{
					Provider: db.PaymentProviderDodo,

					ProviderEventID: checkoutID,

					UserID: pgUserID,
				},
			)

	if err != nil {
		return nil, err
	}

	if !payment.Plan.Valid {
		return nil, ErrInvalidPaymentPlan
	}

	return &PaymentStatusResponse{
		CheckoutID: payment.ProviderEventID,

		Plan: string(payment.Plan.SubscriptionPlan),

		Status: string(payment.Status),
	}, nil
}

func (
	s *Service,
) GetPlans() *PlansResponse {

	return &PlansResponse{
		Plans: []PlanResponse{
			{
				Name: PlanFree,

				Price: PriceFree,

				LinkLimit: FreePlanLimit,
			},
			{
				Name: PlanStarter,

				Price: PriceStarter,

				LinkLimit: StarterPlanLimit,
			},
			{
				Name: PlanPro,

				Price: PricePro,

				LinkLimit: ProPlanLimit,
			},
		},
	}
}
