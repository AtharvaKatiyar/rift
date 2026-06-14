#!/bin/sh

echo "waiting for postgres..."

until migrate \
  -path /app/migrations \
  -database "postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}?sslmode=${POSTGRES_SSLMODE}" \
  up
do
  echo "postgres not ready yet..."
  sleep 2
done

echo "migrations complete"

exec ./server