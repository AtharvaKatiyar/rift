package analytics

import "time"

func ParseRange(
	value string,
) time.Duration {

	switch value {

	case "1h":
		return time.Hour

	case "24h":
		return 24 * time.Hour

	case "7d":
		return 7 * 24 * time.Hour

	case "30d":
		return 30 * 24 * time.Hour

	case "90d":
		return 90 * 24 * time.Hour

	default:
		return 3650 * 24 *time.Hour
	}
}