package helpers

import (
	"context"
	"log"
	"os"
	"sync"
	"testing"
	"time"
	"github.com/stretchr/testify/require"

	db "github.com/AtharvaKatiyar/rift/internal/database/sqlc"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/redis/go-redis/v9"
	tcpostgres "github.com/testcontainers/testcontainers-go/modules/postgres"
	tcredis "github.com/testcontainers/testcontainers-go/modules/redis"
)

var (
	testDB     *TestDatabase
	testRedis  *redis.Client

	onceDB     sync.Once
	onceRedis  sync.Once
)

func SharedTestDatabase(
	t *testing.T,
) *TestDatabase {

	onceDB.Do(func() {

		ctx :=
			context.Background()

		container, err :=
			tcpostgres.Run(
				ctx,
				"postgres:16-alpine",

				tcpostgres.WithDatabase(
					"riftdb_test",
				),

				tcpostgres.WithUsername(
					"postgres",
				),

				tcpostgres.WithPassword(
					"postgres",
				),

				tcpostgres.BasicWaitStrategies(),
			)

		if err != nil {
			t.Fatalf(
				"failed postgres container: %v",
				err,
			)
		}

		connStr, err :=
			container.ConnectionString(
				ctx,
				"sslmode=disable",
			)

		if err != nil {
			t.Fatalf(
				"failed postgres conn string: %v",
				err,
			)
		}

		pool, err :=
	pgxpool.New(
		ctx,
		connStr,
	)

if err != nil {
	t.Fatalf(
		"failed postgres pool: %v",
		err,
	)
}

require.Eventually(
	t,
	func() bool {

		err :=
			pool.Ping(
				ctx,
			)

		return err == nil
		},
		30*time.Second,
		1*time.Second,
	)

	time.Sleep(
		2 * time.Second,
	)

	runMigrations(
		t,
		pool,
	)

	if pool == nil {
		t.Fatal(
			"database pool is nil",
		)
	}

		testDB =
			&TestDatabase{
				Pool:
					pool,
				Queries:
					db.New(pool),
			}
	})

	CleanupDatabase(
		t,
		testDB.Pool,
	)

	return testDB
}

func SharedTestRedis(
	t *testing.T,
) *redis.Client {

	onceRedis.Do(func() {

		ctx :=
			context.Background()

		container, err :=
			tcredis.Run(
				ctx,
				"redis:7-alpine",
			)

		if err != nil {
			t.Fatalf(
				"failed redis container: %v",
				err,
			)
		}

		host, err :=
			container.Host(
				ctx,
			)

		if err != nil {
			t.Fatal(err)
		}

		port, err :=
			container.MappedPort(
				ctx,
				"6379/tcp",
			)

		if err != nil {
			t.Fatal(err)
		}

		addr :=
			host + ":" +
				port.Port()

		testRedis =
			redis.NewClient(
				&redis.Options{
					Addr:
						addr,
				},
			)
	})

	t.Cleanup(func() {
		testRedis.FlushDB(
			context.Background(),
		)
	})

	return testRedis
}

func CleanupDatabase(
	t *testing.T,
	pool *pgxpool.Pool,
) {

	_, err :=
		pool.Exec(
			context.Background(),
			`
			TRUNCATE TABLE
				refresh_tokens,
				link_history,
				central_links,
				users
			RESTART IDENTITY
			CASCADE
			`,
		)

	if err != nil {
		t.Fatalf(
			"cleanup failed: %v",
			err,
		)
	}
}

func TestMain(
	m *testing.M,
) {

	code :=
		m.Run()

	log.Println(
		"tests finished",
	)

	os.Exit(code)
}