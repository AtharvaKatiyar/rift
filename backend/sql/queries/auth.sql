-- name: CreatePasswordResetToken :exec
INSERT INTO password_reset_tokens (
    user_id,
    token_hash,
    expires_at
)
VALUES (
    $1,
    $2,
    $3
);


-- name: GetValidPasswordResetToken :one
SELECT *
FROM password_reset_tokens
WHERE
    token_hash = $1
    AND expires_at > NOW()
ORDER BY created_at DESC
LIMIT 1;

-- name: DeletePasswordResetTokensForUser :exec
DELETE FROM password_reset_tokens
WHERE user_id = $1;

-- name: DeleteExpiredPasswordResetTokens :exec
DELETE FROM password_reset_tokens
WHERE expires_at < NOW();

-- name: UpdateUserPassword :exec
UPDATE users
SET
    password_hash = $2,
    updated_at = NOW()
WHERE id = $1;

-- name: DeletePasswordResetToken :exec
DELETE
FROM password_reset_tokens
WHERE id = $1
    AND user_id = $2;