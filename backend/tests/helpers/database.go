package helpers

import (
	"context"
	"fmt"
	"os"
	"path/filepath"
	"runtime"
	"testing"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/stretchr/testify/require"
	tcpostgres "github.com/testcontainers/testcontainers-go/modules/postgres"

	db "github.com/AtharvaKatiyar/rift/internal/database/sqlc"
)

type TestDatabase struct {
	Pool    *pgxpool.Pool
	Queries *db.Queries
}

func SetupTestDatabase(
	t *testing.T,
) *TestDatabase {

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

	require.NoError(
		t,
		err,
	)

	t.Cleanup(func() {
		_ = container.Terminate(
			ctx,
		)
	})

	connStr, err :=
		container.ConnectionString(
			ctx,
			"sslmode=disable",
		)

	require.NoError(
		t,
		err,
	)

	pool, err :=
		pgxpool.New(
			ctx,
			connStr,
		)

	require.NoError(
		t,
		pool.Ping(
			ctx,
		),
	)

	runMigrations(
		t,
		pool,
	)

	return &TestDatabase{
		Pool: pool,
		Queries: db.New(
			pool,
		),
	}
}

func runMigrations(
	t *testing.T,
	pool *pgxpool.Pool,
) {

	migrations := []string{
		"20260518165921_init_schema.up.sql",
		"20260606195700_soft_delete_links.up.sql",
		"20260607101930_add_refresh_tokens.up.sql",
		"20260607183314_refresh_token_sessions.up.sql",
	}

	migrationsDir :=
		migrationsPath()

	for _, migration := range migrations {

		migrationFile :=
			filepath.Join(
				migrationsDir,
				migration,
			)

		content, err :=
			os.ReadFile(
				migrationFile,
			)

		require.NoError(
			t,
			err,
			fmt.Sprintf(
				"failed reading %s",
				migrationFile,
			),
		)

		_, err =
			pool.Exec(
				context.Background(),
				string(content),
			)

		require.NoError(
			t,
			err,
			fmt.Sprintf(
				"failed migration %s",
				migrationFile,
			),
		)
	}
}

func migrationsPath() string {

	_, filename, _, ok :=
		runtime.Caller(0)

	if !ok {
		panic(
			"failed to determine migrations path",
		)
	}

	helpersDir :=
		filepath.Dir(
			filename,
		)

	projectRoot :=
		filepath.Dir(
			filepath.Dir(
				helpersDir,
			),
		)

	return filepath.Join(
		projectRoot,
		"migrations",
	)
}
