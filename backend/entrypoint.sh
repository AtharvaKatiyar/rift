#!/bin/sh

set -e

echo "Running database migrations..."

until migrate \
  -path /app/migrations \
  -database "postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}?sslmode=${POSTGRES_SSLMODE}" \
  up
do
    echo "Database not ready, retrying in 2 seconds..."
    sleep 2
done

echo "Migrations completed."

echo "Starting Rift..."

exec ./server