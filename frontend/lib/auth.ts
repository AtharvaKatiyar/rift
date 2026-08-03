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
 * Parse validation error messages from Go's validator package
 */
function parseValidationError(errorStr: string): string {
  // Handle Go validator errors like:
  // "Key: 'LoginRequest.Email' Error:Field validation for 'Email' failed on the 'required' tag"
  const requiredMatch = errorStr.match(/Error:Field validation for '(\w+)' failed on the 'required' tag/);
  if (requiredMatch) {
    const field = requiredMatch[1].toLowerCase();
    return `${field.charAt(0).toUpperCase() + field.slice(1)} is required.`;
  }

  const emailMatch = errorStr.match(/Error:Field validation for '(\w+)' failed on the 'email' tag/);
  if (emailMatch) {
    return "Please enter a valid email address.";
  }

  const minMatch = errorStr.match(/Error:Field validation for '(\w+)' failed on the 'min' tag/);
  if (minMatch) {
    const field = minMatch[1].toLowerCase();
    return `${field.charAt(0).toUpperCase() + field.slice(1)} is too short.`;
  }

  const maxMatch = errorStr.match(/Error:Field validation for '(\w+)' failed on the 'max' tag/);
  if (maxMatch) {
    const field = maxMatch[1].toLowerCase();
    return `${field.charAt(0).toUpperCase() + field.slice(1)} is too long.`;
  }

  // Handle multiple validation errors - just show the first one
  if (errorStr.includes("Key:") && errorStr.includes("Error:")) {
    const firstError = errorStr.split("Key:")[1];
    if (firstError) {
      return parseValidationError("Key:" + firstError);
    }
  }

  return errorStr;
}

/**
 * Map raw API/network errors to user-friendly messages.
 */
export function mapApiError(status: number, body: Record<string, unknown>): string {
  if (status === 429) return "Too many attempts. Please wait a moment before trying again.";
  if (status === 500 || status === 502 || status === 503) {
    return "Something went wrong on our end. Please try again later.";
  }
  if (status === 400 || status === 401) {
    if (typeof body?.error === "string" && body.error) {
      const errorStr = body.error as string;
      
      // Check if this is a Go validation error
      if (errorStr.includes("Key:") && errorStr.includes("Error:Field validation")) {
        return parseValidationError(errorStr);
      }
      
      return errorStr;
    }
    return status === 401 ? "Invalid credentials." : "Please check your details and try again.";
  }
  if (typeof body?.error === "string" && body.error) {
    return body.error as string;
  }
  return "Something went wrong. Please try again.";
}
