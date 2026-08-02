package helpers

import (
	"context"
	"testing"

	"github.com/redis/go-redis/v9"
	"github.com/stretchr/testify/require"
	tcredis "github.com/testcontainers/testcontainers-go/modules/redis"
)

func SetupTestRedis(
	t *testing.T,
) *redis.Client {

	ctx :=
		context.Background()

	container, err :=
		tcredis.Run(
			ctx,
			"redis:7-alpine",
		)

	require.NoError(
		t,
		err,
	)

	t.Cleanup(func() {
		_ = container.Terminate(
			ctx,
		)
	})

	host, err :=
		container.Host(
			ctx,
		)

	require.NoError(
		t,
		err,
	)

	port, err :=
		container.MappedPort(
			ctx,
			"6379/tcp",
		)

	require.NoError(
		t,
		err,
	)

	addr :=
		host + ":" +
			port.Port()

	client := redis.NewClient(
		&redis.Options{
			Addr: addr,
		},
	)

	err = client.Ping(
		ctx,
	).Err()

	require.NoError(
		t,
		err,
	)

	return client
}
