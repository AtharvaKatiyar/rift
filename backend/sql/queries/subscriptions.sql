-- name: CreateUserSubscription :one
INSERT INTO user_subscriptions (
    user_id,
    plan,
    status
)
VALUES (
    $1,
    'free',
    'active'
)
ON CONFLICT (user_id)
DO UPDATE
SET updated_at = NOW()
RETURNING *;

-- name: GetUserSubscription :one
SELECT *
FROM user_subscriptions
WHERE user_id = $1
LIMIT 1;

-- name: UpdateUserSubscription :one
UPDATE user_subscriptions
SET
    plan =
        COALESCE($2, plan),

    status =
        COALESCE($3, status),

    provider_customer_id =
        COALESCE(
            $4,
            provider_customer_id
        ),

    provider_subscription_id =
        COALESCE(
            $5,
            provider_subscription_id
        ),

    current_period_start =
        COALESCE(
            $6,
            current_period_start
        ),

    current_period_end =
        COALESCE(
            $7,
            current_period_end
        ),

    cancel_at_period_end =
        COALESCE(
            $8,
            cancel_at_period_end
        ),

    updated_at = NOW()

WHERE user_id = $1
RETURNING *;    

-- name: UpsertUserSubscription :one
INSERT INTO user_subscriptions (
    user_id,
    plan,
    status,
    provider_customer_id,
    provider_subscription_id,
    current_period_start,
    current_period_end,
    cancel_at_period_end
)
VALUES (
    $1,
    $2,
    $3,
    $4,
    $5,
    $6,
    $7,
    $8
)
ON CONFLICT (user_id)
DO UPDATE
SET
    plan = EXCLUDED.plan,
    status = EXCLUDED.status,
    provider_customer_id =
        EXCLUDED.provider_customer_id,
    provider_subscription_id =
        EXCLUDED.provider_subscription_id,
    current_period_start =
        EXCLUDED.current_period_start,
    current_period_end =
        EXCLUDED.current_period_end,
    cancel_at_period_end =
        EXCLUDED.cancel_at_period_end,
    updated_at = NOW()
RETURNING *;

-- name: CountUserLinksForSubscription :one
SELECT COUNT(*)
FROM central_links
WHERE user_id = $1
AND is_deleted = FALSE;

-- name: CreatePaymentIntent :one
INSERT INTO payment_intents (
    provider_event_id,
    provider,
    event_type,
    user_id,
    plan,
    idempotency_key,
    status
)
VALUES (
    $1,
    $2,
    $3,
    $4,
    $5,
    $6,
    'pending'
)
RETURNING *;

-- name: GetUserPaymentIntentByCheckoutID :one
SELECT *
FROM payment_intents
WHERE
    provider = $1
    AND provider_event_id = $2
    AND user_id = $3
LIMIT 1;

-- name: UpdateUserPlan :one
UPDATE user_subscriptions
SET
    plan = $2,
    updated_at = NOW()
WHERE user_id = $1
RETURNING *;

-- name: GetPaymentIntentForUpdate :one
SELECT *
FROM payment_intents
WHERE
    provider = $1
    AND provider_event_id = $2
LIMIT 1
FOR UPDATE;

-- name: MarkPaymentIntentSucceededByID :one
UPDATE payment_intents
SET
    status = 'succeeded'
WHERE
    id = $1
    AND status = 'pending'
RETURNING *;

-- name: MarkPaymentIntentFailedByID :one
UPDATE payment_intents
SET status = 'failed'
WHERE
    id = $1
    AND status = 'pending'
RETURNING *;

-- name: ActivateUserSubscriptionPlan :one
UPDATE user_subscriptions
SET
    plan = $2,
    status = 'active',
    updated_at = NOW()
WHERE user_id = $1
RETURNING *;