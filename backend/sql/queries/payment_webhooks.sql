-- Duplicate provider events are ignored.
-- Idempotency is enforced by the UNIQUE(provider, provider_event_id) constraint.
-- name: CreatePaymentWebhook :exec
INSERT INTO payment_webhooks (
    provider,
    provider_event_id,
    event_type,
    headers,
    payload
)
VALUES (
    $1,
    $2,
    $3,
    $4,
    $5
)
ON CONFLICT (provider, provider_event_id)
DO NOTHING;

-- name: GetPaymentWebhook :one
SELECT *
FROM payment_webhooks
WHERE
    provider = $1
    AND provider_event_id = $2
LIMIT 1
FOR UPDATE;

-- name: MarkPaymentWebhookProcessing :one
UPDATE payment_webhooks
SET
    processing_status = 'processing',
    processing_attempts =
        processing_attempts + 1,
    processed_at = NULL,
    last_error = NULL
WHERE 
    id = $1
    AND processing_status = 'pending'
RETURNING *;

-- name: MarkPaymentWebhookProcessed :one
UPDATE payment_webhooks
SET
    processing_status = 'processed',
    processed_at = NOW(),
    processing_started_at = NULL,
    next_retry_at = NULL,
    last_error = NULL
WHERE id = $1
RETURNING *;

-- name: MarkPaymentWebhookFailed :one
UPDATE payment_webhooks
SET
    processing_status = 'failed',
    last_error = $2,
    processed_at = NULL,
    processing_started_at = NULL,
    next_retry_at = $3
WHERE id = $1
RETURNING *;

-- name: ClaimNextPaymentWebhook :one
WITH next_webhook AS (
    SELECT pw.id
    FROM payment_webhooks AS pw
    WHERE
        pw.processing_status = 'pending'

        OR (
            pw.processing_status = 'failed'
            AND pw.next_retry_at IS NOT NULL
            AND pw.next_retry_at <= NOW()
            AND pw.processing_attempts < sqlc.arg(max_attempts)
        )

        OR (
            pw.processing_status = 'processing'
            AND pw.processing_started_at IS NOT NULL
            AND pw.processing_started_at <=
                NOW() - (
                    sqlc.arg(stale_timeout_seconds)
                    * INTERVAL '1 second'
                )
            AND pw.processing_attempts < sqlc.arg(max_attempts)
        )

    ORDER BY
        CASE
            WHEN pw.processing_status = 'pending'
                THEN 0
            WHEN pw.processing_status = 'failed'
                THEN 1
            WHEN pw.processing_status = 'processing'
                THEN 2
            ELSE 3
        END,

        COALESCE(
            pw.next_retry_at,
            pw.processing_started_at,
            pw.received_at
        ),

        pw.received_at

    FOR UPDATE OF pw
    SKIP LOCKED

    LIMIT 1
)

UPDATE payment_webhooks AS pw
SET
    processing_status = 'processing',

    processing_attempts =
        pw.processing_attempts + 1,

    processing_started_at =
        NOW(),

    next_retry_at =
        NULL

FROM next_webhook AS nw

WHERE pw.id = nw.id

RETURNING pw.*;

-- name: FailExhaustedStalePaymentWebhooks :execrows
UPDATE payment_webhooks
SET
    processing_status = 'failed',
    processing_started_at = NULL,
    next_retry_at = NULL,
    processed_at = NULL,
    last_error =
        'payment webhook processing exceeded maximum attempts after worker interruption'
WHERE
    processing_status = 'processing'
    AND processing_started_at IS NOT NULL
    AND processing_started_at <=
        NOW() - (
            sqlc.arg(stale_timeout_seconds)
            * INTERVAL '1 second'
        )
    AND processing_attempts >=
        sqlc.arg(max_attempts);