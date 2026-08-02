package auth

import (
	"context"
)

func dbTimeoutContext(
	ctx context.Context,
) (
	context.Context,
	context.CancelFunc,
) {

	return context.WithTimeout(
		ctx,
		authDBTimeout,
	)
}

func tokenTimeoutContext(
	ctx context.Context,
) (
	context.Context,
	context.CancelFunc,
) {

	return context.WithTimeout(
		ctx,
		authTokenTimeout,
	)
}
