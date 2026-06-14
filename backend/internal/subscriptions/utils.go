package subscription

import (
	"fmt"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
)

func parseUUID(
	id string,
) (
	pgtype.UUID,
	error,
) {

	parsed, err :=
		uuid.Parse(
			id,
		)

	if err != nil {
		return pgtype.UUID{},
			fmt.Errorf(
				"invalid uuid: %w",
				err,
			)
	}

	var pgUUID pgtype.UUID

	err =
		pgUUID.Scan(
			parsed.String(),
		)

	if err != nil {
		return pgtype.UUID{},
			err
	}

	return pgUUID,
		nil
}