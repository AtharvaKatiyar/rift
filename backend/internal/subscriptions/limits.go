package subscription

func GetPlanLimit(
	plan string,
) int64 {

	switch plan {

	case "starter":
		return 50

	case "pro":
		return 100

	default:
		return 10
	}
}