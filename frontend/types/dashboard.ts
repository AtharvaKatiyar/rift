/**
 * dashboard.ts — shared TypeScript types for the Rift dashboard.
 *
 * Shapes are derived directly from the backend handler and DTO files:
 *   internal/links/dto.go, internal/links/handler.go (GetUserLinks response)
 *   internal/subscriptions/dto.go
 *   internal/analytics/dto.go
 */

// ─── Link ────────────────────────────────────────────────────────────────────

/** A single link record as returned by GET /api/v1/links and GET /api/v1/links/:id
 *  Field names are Go's default PascalCase serialization — sqlc CentralLink has no json tags.
 */
export interface LinkRecord {
  ID: string;
  UserID: string;
  Title: string;
  Slug: string;
  UniqueID: string;
  TargetUrl: string;
  ClickCount: number;
  IsActive: boolean;
  CreatedAt: string;
  UpdatedAt: string;
  IsDeleted: boolean;
  DeletedAt: string | null;
}

/** Pagination metadata from GET /api/v1/links */
export interface Pagination {
  page: number;
  page_size: number;
  total_items: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

/** Full response from GET /api/v1/links */
export interface LinksResponse {
  links: LinkRecord[] | null;
  pagination: Pagination;
}

// ─── Subscription ─────────────────────────────────────────────────────────────

/** Response from GET /api/v1/subscription (maps to SubscriptionResponse in dto.go) */
export interface SubscriptionResponse {
  plan: string;
  status: string;
  price: number;
  link_limit: number;
  links_used: number;
  links_remaining: number;
  usage_percent: number;
  can_create_links: boolean;
  can_upgrade_to: string[];
  features: string[];
}

// ─── Analytics ───────────────────────────────────────────────────────────────

export interface AnalyticsOverview {
  total_clicks: number;
  clicks_today: number;
  unique_visitors: number;
  change_percentage: number;
  trend: string;
  repeat_visitors: number;
  avg_clicks_per_visitor: number;
}

export interface TimelinePoint {
  day: string;
  clicks: number;
}

export interface HourlyPoint {
  hour: number;
  clicks: number;
}

export interface Breakdown {
  name: string;
  clicks: number;
}

export interface RecentClick {
  clicked_at: string;
  referrer: string;
  country: string;
  city: string;
  browser: string;
  os: string;
  device: string;
}

/** Full response from GET /api/v1/links/:id/analytics */
export interface LinkAnalyticsResponse {
  overview: AnalyticsOverview;
  timeline: TimelinePoint[];
  hourly: HourlyPoint[];
  browsers: Breakdown[];
  devices: Breakdown[];
  operating_systems: Breakdown[];
  countries: Breakdown[];
  cities: Breakdown[];
  referrers: Breakdown[];
  campaigns: Breakdown[];
  sources: Breakdown[];
  mediums: Breakdown[];
  terms: Breakdown[];
  content: Breakdown[];
  recent_clicks: RecentClick[];
}

// ─── Dashboard page data ──────────────────────────────────────────────────────

/** Everything the dashboard page fetches on mount */
export interface DashboardData {
  links: LinksResponse;
  subscription: SubscriptionResponse;
}
