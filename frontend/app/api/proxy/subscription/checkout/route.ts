import { NextRequest } from "next/server";
import { proxyRequest, readBody } from "@/lib/proxy";

export async function POST(req: NextRequest) {
  const body = await readBody(req);
  return proxyRequest(req, "/api/v1/subscription/checkout", {
    method: "POST",
    body,
  });
}
