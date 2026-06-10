package httpx

import "context"

type contextKey string

const RequestIDContextKey =
	contextKey("request_id")

func WithRequestID(
	ctx context.Context,
	requestID string,
) context.Context {

	return context.WithValue(
		ctx,
		RequestIDContextKey,
		requestID,
	)
}

func RequestIDFromContext(
	ctx context.Context,
) string {

	requestID, ok :=
		ctx.Value(
			RequestIDContextKey,
		).(string)

	if !ok {
		return ""
	}

	return requestID
}