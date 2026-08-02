/**
 * apiFetch — all requests use credentials: 'include' for cookie-based auth.
 * If the access token is expired and the server returns requires_refresh: true,
 * we attempt one silent refresh then retry the original request.
 */
export async function apiFetch(path: string, options?: RequestInit): Promise<Response> {
  const res = await fetch(`/api/v1${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (res.status === 401) {
    const body = await res.json().catch(() => ({}));
    if (body?.requires_refresh) {
      const refresh = await fetch("/api/v1/auth/refresh", {
        method: "POST",
        credentials: "include",
      });
      if (refresh.ok) {
        // Retry original request after successful token refresh
        return fetch(`/api/v1${path}`, {
          ...options,
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            ...options?.headers,
          },
        });
      }
      // Refresh failed — send user back to login
      if (typeof window !== "undefined") {
        window.location.href = "/auth";
      }
    }
  }

  return res;
}

/**
 * Map raw API/network errors to user-friendly messages.
 */
export function mapApiError(status: number, body: Record<string, unknown>): string {
  if (status === 429) return "Too many attempts. Please wait a moment before trying again.";
  if (status === 500 || status === 502 || status === 503) {
    return "Something went wrong on our end. Please try again later.";
  }
  if (status === 400) {
    if (typeof body?.error === "string" && body.error) {
      return body.error as string;
    }
    return "Please check your details and try again.";
  }
  if (typeof body?.error === "string" && body.error) {
    return body.error as string;
  }
  return "Something went wrong. Please try again.";
}
