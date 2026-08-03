import { NextRequest } from "next/server";
import { proxyRequest } from "@/lib/proxy";

/**
 * GET /api/proxy/subscription
 *
 * Backend: GET /api/v1/subscription
 * Returns SubscriptionResponse: plan, status, price, link_limit, links_used,
 * links_remaining, usage_percent, can_create_links, can_upgrade_to, features.
 */
export async function GET(req: NextRequest) {
  return proxyRequest(req, "/api/v1/subscription");
}
