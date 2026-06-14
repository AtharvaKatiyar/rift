package subscription

func GetAllowedUpgrades(
	current string,
) []string {

	switch current {

	case "free":
		return []string{
			"starter",
			"pro",
		}

	case "starter":
		return []string{
			"pro",
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
		"free":    1,
		"starter": 2,
		"pro":     3,
	}

	return rank[target] >
		rank[current]
}