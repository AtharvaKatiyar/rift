-- name: CreateLinkAnalytics :exec
INSERT INTO link_analytics (
	link_id,
	referrer,
	country,
	city,
	browser,
	os,
	device,
	ip_address,
	utm_source,
	utm_medium,
	utm_campaign,
	utm_term,
	utm_content,
    is_bot
)
VALUES (
	$1,
	$2,
	$3,
	$4,
	$5,
	$6,
	$7,
	$8,
	$9,
	$10,
	$11,
	$12,
	$13,
    $14
);

-- -- name: GetTotalClicks :one
-- SELECT COUNT(*)
-- FROM link_analytics
-- WHERE link_id = $1;

-- -- name: GetClicksByDay :many
-- SELECT
--     DATE(clicked_at) AS day,
--     COUNT(*) AS clicks
-- FROM link_analytics
-- WHERE link_id = $1
-- AND clicked_at >= NOW() - INTERVAL '30 days'
-- GROUP BY day
-- ORDER BY day ASC;

-- -- name: GetCountryBreakdown :many
-- SELECT
--     COALESCE(country, 'unknown') AS country,
--     COUNT(*) AS clicks
-- FROM link_analytics
-- WHERE link_id = $1
-- GROUP BY country
-- ORDER BY clicks DESC
-- LIMIT 10;

-- -- name: GetBrowserBreakdown :many
-- SELECT
--     COALESCE(browser, 'unknown') AS browser,
--     COUNT(*) AS clicks
-- FROM link_analytics
-- WHERE link_id = $1
-- GROUP BY browser
-- ORDER BY clicks DESC;

-- -- name: GetOSBreakdown :many
-- SELECT
--     COALESCE(os, 'unknown') AS os,
--     COUNT(*) AS clicks
-- FROM link_analytics
-- WHERE link_id = $1
-- GROUP BY os
-- ORDER BY clicks DESC;

-- -- name: GetDeviceBreakdown :many
-- SELECT
--     COALESCE(device, 'unknown') AS device,
--     COUNT(*) AS clicks
-- FROM link_analytics
-- WHERE link_id = $1
-- GROUP BY device
-- ORDER BY clicks DESC;

-- name: GetRecentClicks :many
SELECT
    clicked_at,
    referrer,
    country,
    city,
    browser,
    os,
    device
FROM link_analytics
WHERE link_id = $1
AND is_bot = FALSE
AND (
    $2::timestamptz IS NULL
    OR clicked_at >= $2
)
ORDER BY clicked_at DESC
LIMIT 50;

-- name: GetLinkAnalyticsOverview :one
SELECT
    COUNT(*)::BIGINT
        AS total_clicks,

    COUNT(*) FILTER (
        WHERE clicked_at >= NOW() - INTERVAL '24 hours'
    )::BIGINT
        AS clicks_today,

    COUNT(DISTINCT ip_address)::BIGINT
        AS unique_visitors
FROM link_analytics
WHERE link_id = $1
AND is_bot = FALSE
AND (
    $2::timestamptz IS NULL
    OR clicked_at >= $2
);

-- name: GetClicksTimeline :many
SELECT
    DATE(clicked_at)
        AS day,

    COUNT(*)::BIGINT
        AS clicks

FROM link_analytics
WHERE link_id = $1
AND is_bot = FALSE
AND (
    $2::timestamptz IS NULL
    OR clicked_at >= $2
)
GROUP BY day
ORDER BY day ASC;

-- name: GetTopBrowsers :many
SELECT
    browser,

    COUNT(*)::BIGINT
        AS clicks

FROM link_analytics
WHERE link_id = $1
AND is_bot = FALSE
AND (
    $2::timestamptz IS NULL
    OR clicked_at >= $2
)
GROUP BY browser
ORDER BY clicks DESC
LIMIT 10;

-- name: GetTopDevices :many
SELECT
    device,

    COUNT(*)::BIGINT
        AS clicks
FROM link_analytics
WHERE link_id = $1
AND is_bot = FALSE
AND (
    $2::timestamptz IS NULL
    OR clicked_at >= $2
)
GROUP BY device
ORDER BY clicks DESC
LIMIT 10;

-- name: GetTopReferrers :many
SELECT
    COALESCE(
        NULLIF(
            referrer,
            ''
        ),
        'Direct'
    )::TEXT AS source,

    COUNT(*)::BIGINT
        AS clicks

FROM link_analytics
WHERE link_id = $1
AND is_bot = FALSE
AND (
    $2::timestamptz IS NULL
    OR clicked_at >= $2
)
GROUP BY source
ORDER BY clicks DESC
LIMIT 10;

-- name: VerifyLinkOwnership :one
SELECT EXISTS (
    SELECT 1
    FROM central_links
    WHERE id = $1
    AND user_id = $2
);

-- name: GetTopOperatingSystems :many
SELECT
    os AS name,
    COUNT(*)::BIGINT AS clicks
FROM link_analytics
WHERE link_id = $1
AND is_bot = FALSE
AND (
    $2::timestamptz IS NULL
    OR clicked_at >= $2
)
GROUP BY os
ORDER BY clicks DESC
LIMIT 10;

-- name: GetTopCountries :many
SELECT
    COALESCE(
        NULLIF(country, ''),
        'Unknown'
    ) AS name,
    COUNT(*) AS clicks
FROM link_analytics
WHERE link_id = $1
AND is_bot = FALSE
AND (
    $2::timestamptz IS NULL
    OR clicked_at >= $2
)
GROUP BY name
ORDER BY clicks DESC
LIMIT 10;

-- name: GetHourlyClicks :many
SELECT
    EXTRACT(HOUR FROM clicked_at)::INT AS hour,
    COUNT(*)::BIGINT AS clicks
FROM link_analytics
WHERE link_id = $1
AND is_bot = FALSE
AND (
    $2::timestamptz IS NULL
    OR clicked_at >= $2
)
GROUP BY hour
ORDER BY hour ASC;

-- name: GetTopCities :many
SELECT
    COALESCE(
        NULLIF(city, ''),
        'Unknown'
    ) AS name,

    COUNT(*)::BIGINT
        AS clicks

FROM link_analytics
WHERE link_id = $1
AND is_bot = FALSE
AND (
    $2::timestamptz IS NULL
    OR clicked_at >= $2
)
GROUP BY name
ORDER BY clicks DESC
LIMIT 10;

-- name: GetClicksInRange :one
SELECT
    COUNT(*)::BIGINT AS clicks
FROM link_analytics
WHERE link_id = sqlc.arg(link_id)
AND is_bot = FALSE
AND clicked_at >= sqlc.arg(start_time)
AND clicked_at < sqlc.arg(end_time);

-- name: GetTopCampaigns :many
SELECT
    COALESCE(
        NULLIF(
            utm_campaign,
            ''
        ),
        'Unknown'
    ) AS name,

    COUNT(*)::BIGINT
        AS clicks

FROM link_analytics
WHERE link_id = $1
AND is_bot = FALSE
AND (
    $2::timestamptz IS NULL
    OR clicked_at >= $2
)
GROUP BY name
ORDER BY clicks DESC
LIMIT 10;

-- name: GetTopSources :many
SELECT
    COALESCE(
        NULLIF(
            utm_source,
            ''
        ),
        'Unknown'
    ) AS name,

    COUNT(*)::BIGINT
        AS clicks

FROM link_analytics
WHERE link_id = $1
AND is_bot = FALSE
AND (
    $2::timestamptz IS NULL
    OR clicked_at >= $2
)
GROUP BY name
ORDER BY clicks DESC
LIMIT 10;


-- name: GetTopMediums :many
SELECT
    COALESCE(
        NULLIF(
            utm_medium,
            ''
        ),
        'Unknown'
    ) AS name,

    COUNT(*)::BIGINT
        AS clicks

FROM link_analytics
WHERE link_id = $1
AND is_bot = FALSE
AND (
    $2::timestamptz IS NULL
    OR clicked_at >= $2
)
GROUP BY name
ORDER BY clicks DESC
LIMIT 10;

-- name: GetRepeatVisitors :one
SELECT
    COUNT(*)::BIGINT AS repeat_visitors
FROM (
    SELECT ip_address
    FROM link_analytics
    WHERE link_id = $1
    AND is_bot = FALSE
    AND (
        $2::timestamptz IS NULL
        OR clicked_at >= $2
    )
    GROUP BY ip_address
    HAVING COUNT(*) > 1
) repeated;

-- name: GetAverageClicksPerVisitor :one
SELECT
    COALESCE(
        ROUND(
            COUNT(*)::NUMERIC /
            NULLIF(
                COUNT(DISTINCT ip_address),
                0
            ),
            2
        ),
        0
    ) AS average
FROM link_analytics
WHERE link_id = $1
AND is_bot = FALSE
AND (
    $2::timestamptz IS NULL
    OR clicked_at >= $2
);

-- name: GetTopTerms :many
SELECT
    COALESCE(
        NULLIF(
            utm_term,
            ''
        ),
        'Unknown'
    ) AS name,

    COUNT(*)::BIGINT
        AS clicks

FROM link_analytics
WHERE link_id = $1
AND is_bot = FALSE
AND (
    $2::timestamptz IS NULL
    OR clicked_at >= $2
)
GROUP BY name
ORDER BY clicks DESC
LIMIT 10;

-- name: GetTopContent :many
SELECT
    COALESCE(
        NULLIF(
            utm_content,
            ''
        ),
        'Unknown'
    ) AS name,

    COUNT(*)::BIGINT
        AS clicks

FROM link_analytics
WHERE link_id = $1
AND is_bot = FALSE
AND (
    $2::timestamptz IS NULL
    OR clicked_at >= $2
)
GROUP BY name
ORDER BY clicks DESC
LIMIT 10;