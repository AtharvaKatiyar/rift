package subscription

func GetAllowedUpgrades(
	current string,
) []string {

	switch current {

	case PlanFree:
		return []string{
			PlanStarter,
			PlanPro,
		}

	case PlanStarter:
		return []string{
			PlanPro,
		}

	default:
		return []string{}
	}
}

func CanUpgrade(
	current string,
	target string,
) bool {

	rank := map[string]int{
		PlanFree:    1,
		PlanStarter: 2,
		PlanPro:     3,
	}

	return rank[target] >
		rank[current]
}