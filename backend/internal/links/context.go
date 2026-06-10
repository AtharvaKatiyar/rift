package links

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
		linksDBTimeout,
	)
}

func redisTimeoutContext(
	ctx context.Context,
) (
	context.Context,
	context.CancelFunc,
) {

	return context.WithTimeout(
		ctx,
		linksRedisTimeout,
	)
}