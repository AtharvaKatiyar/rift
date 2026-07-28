-- name: CreateUser :one
INSERT INTO users (
    email,
    username,
    password_hash,
    google_id,
    profile_picture
)
VALUES (
    $1, $2, $3, $4, $5
)
RETURNING id,
    email,
    username,
    password_hash,
    google_id,
    profile_picture,
    email_verified,
    created_at,
    updated_at;


-- name: GetUserByEmail :one
SELECT id,
    email,
    username,
    password_hash,
    google_id,
    profile_picture,
    email_verified,
    created_at,
    updated_at
FROM users
WHERE email = $1;


-- name: GetUserByUsername :one
SELECT id,
    email,
    username,
    password_hash,
    google_id,
    profile_picture,
    email_verified,
    created_at,
    updated_at
FROM users
WHERE username = $1;


-- name: GetUserByGoogleID :one
SELECT id,
    email,
    username,
    password_hash,
    google_id,
    profile_picture,
    email_verified,
    created_at,
    updated_at
FROM users
WHERE google_id = $1;


-- name: GetUserByID :one
SELECT id,
    email,
    username,
    password_hash,
    google_id,
    profile_picture,
    email_verified,
    created_at,
    updated_at
FROM users
WHERE id = $1;