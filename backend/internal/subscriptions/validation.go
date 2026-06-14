package subscription

import "errors"

func ValidateUpgradePlan(
	plan string,
) error {

	switch plan {

	case "starter",
		"pro":

		return nil

	default:
		return errors.New(
			"invalid plan",
		)
	}
}