package subscription

type Plan struct {
	Name     string
	Price    int64
	Limit    int64
	Features []string
}

var Plans = map[string]Plan{
	PlanFree: {
		Name:  "free",
		Price: 0,
		Limit: 10,
		Features: []string{
			"10 active links",
		},
	},

	PlanStarter: {
		Name:  "starter",
		Price: 899,
		Limit: 50,
		Features: []string{
			"50 active links",
			"Basic analytics",
		},
	},

	PlanPro: {
		Name:  "pro",
		Price: 1499,
		Limit: 100,
		Features: []string{
			"100 active links",
			"Advanced analytics",
			"Priority support",
		},
	},
}

func GetPlan(
	name string,
) Plan {

	plan, exists :=
		Plans[name]

	if !exists {
		return Plans[PlanFree]
	}

	return plan
}
