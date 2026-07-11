package subscription

import "errors"

var (
	ErrInvalidPlan =
		errors.New(
			"invalid plan",
		)

	ErrInvalidUpgradePath =
		errors.New(
			"invalid upgrade path",
		)

	ErrInvalidUUID =
		errors.New(
			"invalid uuid",
		)
	ErrInvalidPaymentPlan =
		errors.New(
			"invalid payment plan",
		)
	ErrUnauthorizedCheckout =
		errors.New(
			"unauthorized checkout",
		)
)