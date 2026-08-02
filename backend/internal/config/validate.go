package config

import "os"

func MustGetEnv(
	key string,
) string {

	value :=
		os.Getenv(
			key,
		)

	if value == "" {
		panic(
			"missing env: " +
				key,
		)
	}

	return value
}
