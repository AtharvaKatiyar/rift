package subscription

type Plan struct {
	Name     string
	Price    int64
	Limit    int64
	Features []string
}

package subscription

var Plans = map[string]Plan{
	PlanFree: {
		Name:  "free",
		Price: 0,
		Limit: 30,
		Features: []string{
			"30 permanent links",
			"Unlimited redirects",
			"Basic click analytics",
			"Community support",
		},
	},

	PlanStarter: {
		Name:  "starter",
		Price: 899,
		Limit: 1500,
		Features: []string{
			"1,500 permanent links",
			"Unlimited redirects",
			"Basic click analytics",
			"Founder pricing",
			"Early access to new features",
		},
	},

	PlanPro: {
		Name:  "pro",
		Price: 1499,
		Limit: 10000,
		Features: []string{
			"10,000 permanent links",
			"Unlimited redirects",
			"Basic click analytics",
			"Founder pricing",
			"Priority access to new features",
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
