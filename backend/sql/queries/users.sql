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
RETURNING *;


-- name: GetUserByEmail :one
SELECT *
FROM users
WHERE email = $1;


-- name: GetUserByUsername :one
SELECT *
FROM users
WHERE username = $1;


-- name: GetUserByGoogleID :one
SELECT *
FROM users
WHERE google_id = $1;


-- name: GetUserByID :one
SELECT *
FROM users
WHERE id = $1;