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
    last_error = NULL
WHERE id = $1
RETURNING *;

-- name: MarkPaymentWebhookFailed :one
UPDATE payment_webhooks
SET
    processing_status = 'failed',
    last_error = $2,
    processed_at = NOW()
WHERE id = $1
RETURNING *;