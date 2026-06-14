package subscription

import (
	"fmt"
	"github.com/google/uuid"
)

func GenerateCheckoutID() string {

	return fmt.Sprintf(
		"checkout_%s",
		uuid.NewString(),
	)
}