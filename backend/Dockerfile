# -------- Stage 1: Builder --------
FROM golang:1.26-alpine AS builder

WORKDIR /app

RUN apk add --no-cache git

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build \
	-o server \
	./cmd/server


# -------- Stage 2: Migrate Binary --------
FROM migrate/migrate:latest AS migrate


# -------- Stage 3: Runtime --------
FROM alpine:latest

WORKDIR /app

RUN apk add --no-cache \
	ca-certificates \
	bash \
	wget

# backend binary
COPY --from=builder /app/server .

# migrations
COPY --from=builder /app/migrations ./migrations

# assets (GeoLite db etc.)
COPY --from=builder /app/assets ./assets

# migrate CLI
COPY --from=migrate /usr/local/bin/migrate \
	/usr/local/bin/migrate

# entrypoint
COPY entrypoint.sh .

RUN chmod +x entrypoint.sh

EXPOSE 8080

CMD ["./entrypoint.sh"]