-- name: CreateRefreshToken :exec
INSERT INTO refresh_tokens (
    user_id,
    token_hash,
    expires_at,
    user_agent,
    ip_address
)
VALUES (
    $1, $2, $3, $4, $5
);

-- name: GetRefreshToken :one
SELECT *
FROM refresh_tokens
WHERE token_hash = $1;

-- name: DeleteRefreshToken :exec
DELETE FROM refresh_tokens
WHERE token_hash = $1;


-- name: DeleteUserRefreshTokens :exec
DELETE FROM refresh_tokens
WHERE user_id = $1;

-- name: RevokeRefreshToken :exec
UPDATE refresh_tokens
SET revoked_at = NOW()
WHERE token_hash = $1;

-- name: ReplaceRefreshToken :exec
UPDATE refresh_tokens
SET
    revoked_at = NOW(),
    replaced_by_token = $2
WHERE token_hash = $1;

-- name: GetActiveRefreshToken :one
SELECT *
FROM refresh_tokens
WHERE token_hash = $1
AND revoked_at IS NULL;

-- name: GetRefreshTokenByHash :one
SELECT *
FROM refresh_tokens
WHERE token_hash = $1
LIMIT 1;

-- name: GetRefreshTokenForUpdate :one
SELECT *
FROM refresh_tokens
WHERE token_hash = $1
FOR UPDATE;

-- name: DeleteRefreshTokensByUser :exec
DELETE FROM refresh_tokens
WHERE user_id = $1;