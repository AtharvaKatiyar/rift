package subscription

func ValidateUpgradePlan(
	plan string,
) error {

	switch plan {

	case PlanStarter,
		PlanPro:

		return nil

	default:
		return ErrInvalidPlan
	}
}