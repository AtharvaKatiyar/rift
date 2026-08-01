-- name: CreateEmailVerificationToken :exec
INSERT INTO email_verification_tokens (
    user_id,
    token_hash,
    expires_at
)
VALUES (
    $1,
    $2,
    $3
);


-- name: GetValidEmailVerificationToken :one
SELECT
    id,
    user_id,
    token_hash,
    expires_at,
    created_at
FROM email_verification_tokens
WHERE
    token_hash = $1
    AND expires_at > NOW()
ORDER BY created_at DESC
LIMIT 1;


-- name: DeleteEmailVerificationTokensForUser :exec
DELETE
FROM email_verification_tokens
WHERE user_id = $1;


-- name: DeleteEmailVerificationToken :exec
DELETE
FROM email_verification_tokens
WHERE
    id = $1
    AND user_id = $2;


-- name: DeleteExpiredEmailVerificationTokens :exec
DELETE
FROM email_verification_tokens
WHERE expires_at < NOW();


-- name: VerifyUserEmail :exec
UPDATE users
SET
    email_verified = TRUE,
    updated_at = NOW()
WHERE
    id = $1
    AND email_verified = FALSE;

-- name: IsUserEmailVerified :one
SELECT email_verified
FROM users
WHERE id = $1;