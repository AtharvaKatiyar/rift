import { NextRequest } from "next/server";
import { proxyRequest, readBody } from "@/lib/proxy";

interface Params {
  params: Promise<{ id: string }>;
}

/** GET /api/proxy/links/[id] */
export async function GET(req: NextRequest, { params }: Params) {
  const { id } = await params;
  return proxyRequest(req, `/api/v1/links/${id}`);
}

/** PUT /api/proxy/links/[id] — update a link */
export async function PUT(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await readBody(req);
  return proxyRequest(req, `/api/v1/links/${id}`, {
    method: "PUT",
    body: body ?? undefined,
  });
}

/** DELETE /api/proxy/links/[id] */
export async function DELETE(req: NextRequest, { params }: Params) {
  const { id } = await params;
  return proxyRequest(req, `/api/v1/links/${id}`, { method: "DELETE" });
}
