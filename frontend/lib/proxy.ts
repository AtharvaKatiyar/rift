/**
 * proxy.ts — thin server-side fetch helper for Next.js API proxy routes.
 *
 * Responsibilities:
 *  1. Forward the browser's Cookie header to the backend on every request.
 *  2. Forward backend Set-Cookie headers back to the browser individually.
 *  3. On 401 { requires_refresh: true }, call POST /api/v1/auth/refresh with
 *     the current cookies, then retry the original request once with the new tokens.
 *  4. If refresh fails, return 401 — the client handles redirect to /auth.
 *
 * Key correctness rule:
 *   The Cookie request header format is "name=value; name2=value2".
 *   The Set-Cookie response header format is "name=value; Path=/; HttpOnly; SameSite=Lax".
 *   These are NOT interchangeable. The old code joined raw Set-Cookie strings into the
 *   Cookie header, which sent Path=/, HttpOnly etc. as cookie names to the backend —
 *   causing the backend to reject every retry with 401.
 */

import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.BACKEND_BASE_URL ?? "http://localhost:8080";

export function backendUrl(path: string): string {
  return `${BACKEND}${path}`;
}

// ─── Cookie utilities ─────────────────────────────────────────────────────────

/** Return the raw Cookie header from an incoming Next.js request. */
function getCookieHeader(req: NextRequest): string {
  return req.headers.get("cookie") ?? "";
}

/**
 * Return the Set-Cookie values from a fetch Response as an array.
 *
 * Node.js native fetch (undici, used by Next.js App Router) collapses all
 * Set-Cookie headers into a single comma-separated string when you call
 * headers.get("set-cookie"). That makes it impossible to reliably parse
 * individual cookies (commas appear inside date values too).
 *
 * The correct approach is headers.getSetCookie(), which returns each
 * Set-Cookie directive as a separate array element.
 */
function getSetCookies(res: Response): string[] {
  // Undici / Node 18+ exposes getSetCookie() on the Headers object.
  const h = res.headers as unknown as { getSetCookie?: () => string[] };
  if (typeof h.getSetCookie === "function") {
    return h.getSetCookie();
  }
  // Fallback for environments without getSetCookie: try to split the
  // collapsed string. We split on ", " only when followed immediately
  // by a cookie-name token (word chars before "=").
  const raw = res.headers.get("set-cookie");
  if (!raw) return [];
  return raw.split(/,\s*(?=[A-Za-z0-9_-]+=)/);
}

/**
 * Parse an existing Cookie request header into a name→value map.
 * Input:  "access_token=abc; refresh_token=xyz; csrf_token=tok"
 * Output: { access_token: "abc", refresh_token: "xyz", csrf_token: "tok" }
 */
function parseCookieHeader(raw: string): Record<string, string> {
  const map: Record<string, string> = {};
  for (const pair of raw.split(";")) {
    const eq = pair.indexOf("=");
    if (eq > 0) {
      map[pair.slice(0, eq).trim()] = pair.slice(eq + 1).trim();
    }
  }
  return map;
}

/**
 * Extract bare name=value pairs from Set-Cookie directive strings.
 * Input:  ["access_token=abc; Path=/; HttpOnly; SameSite=Lax", "refresh_token=xyz; ..."]
 * Output: { access_token: "abc", refresh_token: "xyz" }
 *
 * Only the FIRST segment (before the first ";") is kept — everything after
 * is a cookie attribute, not a value.
 */
function setCookiesToMap(setCookies: string[]): Record<string, string> {
  const map: Record<string, string> = {};
  for (const directive of setCookies) {
    const nameValue = directive.split(";")[0].trim();
    const eq = nameValue.indexOf("=");
    if (eq > 0) {
      map[nameValue.slice(0, eq).trim()] = nameValue.slice(eq + 1).trim();
    }
  }
  return map;
}

/** Serialize a name→value map to a Cookie request header string. */
function serializeCookies(map: Record<string, string>): string {
  return Object.entries(map)
    .map(([k, v]) => `${k}=${v}`)
    .join("; ");
}

/**
 * Produce a merged Cookie header where fresh tokens override stale ones.
 *
 * @param existing   The current Cookie header from the browser.
 * @param setCookies The Set-Cookie directives from the refresh response.
 */
function mergedCookieHeader(
  existing: string,
  setCookies: string[]
): string {
  const base = parseCookieHeader(existing);
  const fresh = setCookiesToMap(setCookies);
  return serializeCookies({ ...base, ...fresh });
}

/**
 * Forward each Set-Cookie directive from a backend Response onto a NextResponse
 * as individual Set-Cookie headers. Browsers require one header per cookie.
 */
function forwardSetCookies(from: Response, to: NextResponse): void {
  for (const cookie of getSetCookies(from)) {
    if (cookie) to.headers.append("set-cookie", cookie);
  }
}

// ─── Proxy core ───────────────────────────────────────────────────────────────

interface ProxyOptions {
  method?: string;
  body?: BodyInit | null;
  headers?: Record<string, string>;
}

/**
 * Build a RequestInit object for a backend fetch call.
 * Body is only included when the option is explicitly provided and non-null.
 */
function buildFetchOpts(
  req: NextRequest,
  cookieHeader: string,
  opts: ProxyOptions
): RequestInit {
  return {
    method: opts.method ?? req.method,
    headers: {
      "Content-Type": "application/json",
      ...(cookieHeader ? { cookie: cookieHeader } : {}),
      ...opts.headers,
    },
    ...(opts.body != null ? { body: opts.body } : {}),
  };
}

/**
 * proxyRequest — forward an incoming Next.js API request to the backend,
 * handle 401 + token refresh, and return the final response.
 */
export async function proxyRequest(
  req: NextRequest,
  backendPath: string,
  opts: ProxyOptions = {}
): Promise<NextResponse> {
  const cookieHeader = getCookieHeader(req);

  // ── First attempt ──────────────────────────────────────────────────────────
  let backendRes = await fetch(
    backendUrl(backendPath),
    buildFetchOpts(req, cookieHeader, opts)
  );

  // ── Handle 401 ────────────────────────────────────────────────────────────
  if (backendRes.status === 401) {
    const bodyText = await backendRes.text();
    let bodyJson: Record<string, unknown> = {};
    try {
      bodyJson = JSON.parse(bodyText);
    } catch {
      /* non-JSON body — that's fine */
    }

    if (bodyJson?.requires_refresh === true) {
      // ── Attempt token refresh ──────────────────────────────────────────────
      // Forward the original cookies so the backend can validate refresh_token.
      const refreshRes = await fetch(backendUrl("/api/v1/auth/refresh"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(cookieHeader ? { cookie: cookieHeader } : {}),
        },
      });

      if (refreshRes.ok) {
        // Extract the new token values as bare name=value pairs, then
        // overlay them on the existing cookies to form a valid Cookie header.
        const refreshSetCookies = getSetCookies(refreshRes);
        const newCookieHeader = mergedCookieHeader(cookieHeader, refreshSetCookies);

        // ── Retry original request with updated tokens ─────────────────────
        backendRes = await fetch(
          backendUrl(backendPath),
          buildFetchOpts(req, newCookieHeader, opts)
        );

        const retryBody = await backendRes.text();
        const nextRes = new NextResponse(retryBody, {
          status: backendRes.status,
          headers: { "content-type": "application/json" },
        });
        // Send the new auth cookies to the browser so subsequent requests
        // don't need another refresh cycle.
        for (const c of refreshSetCookies) {
          if (c) nextRes.headers.append("set-cookie", c);
        }
        forwardSetCookies(backendRes, nextRes);
        return nextRes;
      }

      // Refresh failed — tell the client to re-authenticate.
      return NextResponse.json({ error: "session expired" }, { status: 401 });
    }

    // Plain 401 without requires_refresh — pass through unchanged.
    return NextResponse.json(bodyJson, { status: 401 });
  }

  // ── Success / other status — pipe through ─────────────────────────────────
  const responseBody = await backendRes.text();
  const nextRes = new NextResponse(responseBody, {
    status: backendRes.status,
    headers: { "content-type": "application/json" },
  });
  forwardSetCookies(backendRes, nextRes);
  return nextRes;
}

/**
 * readBody — consume and return the raw request body text.
 * Returns null for methods that must not carry a body (GET, HEAD, DELETE).
 */
export async function readBody(req: NextRequest): Promise<string | null> {
  if (["GET", "HEAD", "DELETE"].includes(req.method.toUpperCase())) {
    return null;
  }
  try {
    return await req.text();
  } catch {
    return null;
  }
}
