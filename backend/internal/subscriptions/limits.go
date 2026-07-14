package subscription

func GetPlanLimit(
	plan string,
) int64 {

	switch plan {

	case PlanStarter:
		return 50

	case PlanPro:
		return 100

	default:
		return 10
	}
}
