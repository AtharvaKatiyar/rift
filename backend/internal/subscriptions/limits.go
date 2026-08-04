package subscription

func GetPlanLimit(
	plan string,
) int64 {

	switch plan {

	case PlanStarter:
		return 1500

	case PlanPro:
		return 10000

	default:
		return 30
	}
}
