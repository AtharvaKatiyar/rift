"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { useDashboardUser } from "@/app/dashboard/layout";
import { useErrorBanner } from "@/components/dashboard/ErrorBanner";
import type { LinkRecord } from "@/types/dashboard";
import { AnalyticsView } from "@/components/dashboard/AnalyticsView";

const FIELD: React.CSSProperties = {
  fontFamily: "Inter, system-ui, sans-serif",
  fontSize: 13.5,
  color: "var(--text)",
  background: "var(--bg)",
  border: "0.5px solid var(--border-mid)",
  borderRadius: 4,
  padding: "9px 12px",
  width: "100%",
  boxSizing: "border-box",
  outline: "none",
};

const LABEL: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  fontWeight: 500,
  color: "var(--muted)",
  fontFamily: "Inter, system-ui, sans-serif",
  letterSpacing: "0.03em",
  marginBottom: 6,
};

function mapError(status: number, body: Record<string, unknown>): string {
  const err = typeof body?.error === "string" ? body.error.toLowerCase() : "";
  if (err.includes("slug")) return "This slug is already taken. Try a different one.";
  if (status === 400 && (err.includes("url") || err.includes("target")))
    return "Please enter a valid URL starting with http:// or https://";
  return "Something went wrong. Please try again.";
}

export default function LinkDetailsPage() {
  const { user } = useDashboardUser();
  const { showError } = useErrorBanner();
  const router = useRouter();
  const { id } = useParams() as { id: string };

  const [link, setLink] = useState<LinkRecord | null>(null);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const [urlError, setUrlError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchLink() {
      try {
        const res = await fetch(`/api/proxy/links/${id}`, { credentials: "include" });
        if (res.status === 401) {
          window.location.href = "/auth?reason=session_expired";
          return;
        }
        if (!res.ok) {
          showError("Failed to fetch link details.");
          router.push("/dashboard");
          return;
        }
        const data = await res.json();
        const l = data.link;
        setLink(l);
        setTitle(l.Title);
        setSlug(l.Slug);
        setTargetUrl(l.TargetUrl);
      } catch {
        showError("Connection error.");
      } finally {
        setLoading(false);
      }
    }
    fetchLink();
  }, [id, router, showError]);

  const handleSlugChange = (v: string) => {
    setSlug(v.toLowerCase().replace(/[^a-z0-9-]/g, ""));
  };

  const validateUrl = (): boolean => {
    if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
      setUrlError("Please enter a valid URL starting with http:// or https://");
      return false;
    }
    setUrlError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateUrl()) return;
    setSubmitting(true);
    setSubmitError("");
    setSuccessMsg("");
    try {
      const res = await fetch(`/api/proxy/links/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, slug, target_url: targetUrl }),
      });
      if (res.status === 401) {
        window.location.href = "/auth?reason=session_expired";
        return;
      }
      if (res.ok) {
        setSuccessMsg("Link updated successfully");
        setTimeout(() => setSuccessMsg(""), 3000);
      } else {
        const body = await res.json().catch(() => ({}));
        setSubmitError(mapError(res.status, body));
      }
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px" }}>
        <p style={{ fontFamily: "Inter, system-ui, sans-serif", color: "var(--muted)" }}>Loading link details...</p>
      </main>
    );
  }

  if (!link) return null;
  const charCount = title.length;

  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px", animation: "dash-fade-in 0.25s ease" }}>
      <button
        onClick={() => router.push("/dashboard")}
        style={{
          background: "none", border: "none", padding: 0, cursor: "pointer",
          fontSize: 13, fontFamily: "Inter, system-ui, sans-serif",
          color: "var(--muted)", marginBottom: 24, display: "flex", alignItems: "center", gap: 6,
        }}
      >
        <span style={{ fontSize: 16 }}>←</span> Back to Dashboard
      </button>

      <div style={{
        background: "var(--bg)", border: "0.5px solid var(--border)",
        borderRadius: 4, padding: "32px", marginBottom: 40,
        boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
      }}>
        <h2 style={{
          fontFamily: "Fraunces, Georgia, serif", fontWeight: 300,
          fontSize: 24, color: "var(--text)", margin: "0 0 24px",
        }}>
          Edit link details
        </h2>

        <form onSubmit={handleSubmit} noValidate>
          {/* Title */}
          <div style={{ marginBottom: 16 }}>
            <label htmlFor="lm-title" style={LABEL}>Title</label>
            <div style={{ position: "relative" }}>
              <input
                id="lm-title"
                ref={titleRef}
                value={title}
                onChange={e => setTitle(e.target.value)}
                maxLength={100}
                required
                placeholder="My important link"
                style={FIELD}
              />
              {charCount >= 80 && (
                <span style={{
                  position: "absolute", right: 10, top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: 11, pointerEvents: "none",
                  color: charCount >= 95 ? "var(--accent)" : "var(--faint)",
                  fontFamily: "Inter, system-ui, sans-serif",
                }}>
                  {charCount}/100
                </span>
              )}
            </div>
          </div>

          {/* Slug */}
          <div style={{ marginBottom: 16 }}>
            <label htmlFor="lm-slug" style={LABEL}>Slug</label>
            <input
              id="lm-slug"
              value={slug}
              onChange={e => handleSlugChange(e.target.value)}
              required
              placeholder="my-link"
              style={{ ...FIELD, fontFamily: "JetBrains Mono, Courier New, monospace", fontSize: 13 }}
            />
            <p style={{
              margin: "5px 0 0", fontSize: 11.5,
              fontFamily: "JetBrains Mono, Courier New, monospace",
              color: "var(--faint)",
            }}>
              rift.dpdns.org/
              <span style={{ color: slug ? "var(--text)" : "var(--faint)" }}>
                {slug || "your-slug"}
              </span>
              /••••••••••••
            </p>
          </div>

          {/* Destination URL */}
          <div style={{ marginBottom: 24 }}>
            <label htmlFor="lm-url" style={LABEL}>Destination URL</label>
            <input
              id="lm-url"
              type="url"
              value={targetUrl}
              onChange={e => { setTargetUrl(e.target.value); if (urlError) setUrlError(""); }}
              onBlur={validateUrl}
              required
              placeholder="https://example.com/page"
              style={{ ...FIELD, borderColor: urlError ? "var(--accent)" : undefined }}
            />
            {urlError && (
              <p style={{ margin: "4px 0 0", fontSize: 12, color: "var(--accent)", fontFamily: "Inter, system-ui, sans-serif" }}>
                {urlError}
              </p>
            )}
          </div>

          {submitError && (
            <p style={{ margin: "0 0 16px", fontSize: 12, color: "var(--accent)", fontFamily: "Inter, system-ui, sans-serif" }}>
              {submitError}
            </p>
          )}
          {successMsg && (
            <p style={{ margin: "0 0 16px", fontSize: 13, color: "#3a8a52", fontFamily: "Inter, system-ui, sans-serif" }}>
              {successMsg}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting || !title || !slug || !targetUrl}
            style={{
              padding: "10px 20px",
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: 14, fontWeight: 500,
              color: "var(--bg)", background: "var(--text)",
              border: "none", borderRadius: 4, cursor: submitting ? "not-allowed" : "pointer",
              transition: "opacity 0.15s", opacity: submitting ? 0.7 : 1,
            }}
          >
            {submitting ? "Saving..." : "Save changes"}
          </button>
        </form>
      </div>

      <div style={{
        background: "var(--bg)", border: "0.5px solid var(--border)",
        borderRadius: 4, padding: "32px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
      }}>
        <h2 style={{
          fontFamily: "Fraunces, Georgia, serif", fontWeight: 300,
          fontSize: 24, color: "var(--text)", margin: "0 0 24px",
        }}>
          Analytics
        </h2>
        <AnalyticsView link={link} username={user?.username ?? ""} onError={showError} />
      </div>
    </main>
  );
}
