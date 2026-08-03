import { NextRequest } from "next/server";
import { proxyRequest } from "@/lib/proxy";

interface Params {
  params: Promise<{ id: string }>;
}

/**
 * PATCH /api/proxy/links/[id]/status
 *
 * Backend: PATCH /api/v1/links/:id/status
 * No request body — the backend flips the current active state server-side.
 */
export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params;
  return proxyRequest(req, `/api/v1/links/${id}/status`, { method: "PATCH" });
}
