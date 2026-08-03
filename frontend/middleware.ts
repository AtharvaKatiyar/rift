import { NextRequest, NextResponse } from "next/server";

/**
 * Route protection middleware.
 *
 * Protected routes: /dashboard and everything under /dashboard/
 * Strategy: check for the presence of the access_token cookie only.
 * The actual token validation happens server-side via the API.
 * If the cookie is missing → redirect to /auth.
 */
export function middleware(req: NextRequest) {
  const accessToken = req.cookies.get("access_token");
  const { pathname } = req.nextUrl;

  if (pathname === "/") {
    if (accessToken) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  if (!accessToken) {
    const loginUrl = new URL("/auth", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard", "/dashboard/:path*"],
};
