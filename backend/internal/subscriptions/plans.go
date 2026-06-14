package subscription

type Plan struct {
	Name  string
	Limit int64
	Price int64
}

var Plans = map[string]Plan{
	"free": {
		Name:  "free",
		Limit: 10,
		Price: 0,
	},

	"starter": {
		Name:  "starter",
		Limit: 50,
		Price: 899,
	},

	"pro": {
		Name:  "pro",
		Limit: 100,
		Price: 1499,
	},
}

func GetPlan(
	name string,
) Plan {

	plan, exists :=
		Plans[name]

	if !exists {
		return Plans["free"]
	}

	return plan
}