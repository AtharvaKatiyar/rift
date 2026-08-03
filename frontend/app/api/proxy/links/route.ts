import { NextRequest } from "next/server";
import { proxyRequest, readBody } from "@/lib/proxy";

/** GET /api/proxy/links?page=1&page_size=10 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.toString();
  const backendPath = query
    ? `/api/v1/links?${query}`
    : "/api/v1/links";

  return proxyRequest(req, backendPath);
}

/** POST /api/proxy/links — create a new link */
export async function POST(req: NextRequest) {
  const body = await readBody(req);
  return proxyRequest(req, "/api/v1/links", {
    method: "POST",
    body: body ?? undefined,
  });
}
