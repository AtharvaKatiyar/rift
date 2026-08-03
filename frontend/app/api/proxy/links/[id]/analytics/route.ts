import { NextRequest } from "next/server";
import { proxyRequest } from "@/lib/proxy";

interface Params {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/proxy/links/[id]/analytics?range=...
 *
 * Backend: GET /api/v1/links/:id/analytics?range=...
 * Accepted range values: 1h | 24h | 7d | 30d | 90d | all (default: all)
 */
export async function GET(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const query = searchParams.toString();
  const backendPath = query
    ? `/api/v1/links/${id}/analytics?${query}`
    : `/api/v1/links/${id}/analytics`;

  return proxyRequest(req, backendPath);
}
