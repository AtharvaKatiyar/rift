import { NextRequest } from "next/server";
import { proxyRequest } from "@/lib/proxy";

export async function POST(req: NextRequest) {
  return proxyRequest(req, "/api/v1/auth/logout", { method: "POST" });
}
