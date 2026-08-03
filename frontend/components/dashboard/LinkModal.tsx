"use client";

import { useEffect, useRef, useState } from "react";
import type { LinkRecord } from "@/types/dashboard";

// ─── Shared field styles ──────────────────────────────────────────────────────

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

// ─── Error mapping ────────────────────────────────────────────────────────────

function mapError(status: number, body: Record<string, unknown>): string {
  const err = typeof body?.error === "string" ? body.error.toLowerCase() : "";
  if (err.includes("slug")) return "This slug is already taken. Try a different one.";
  if (err.includes("limit")) return "You've reached your link limit. Upgrade to create more.";
  if (status === 400 && (err.includes("url") || err.includes("target")))
    return "Please enter a valid URL starting with http:// or https://";
  return "Something went wrong. Please try again.";
}

// ─── Spinner ──────────────────────────────────────────────────────────────────

function Spin() {
  return (
    <span style={{
      display: "inline-block", width: 13, height: 13,
      border: "1.5px solid currentColor", borderTopColor: "transparent",
      borderRadius: "50%", animation: "dash-spin 0.7s linear infinite",
      marginRight: 6, verticalAlign: "middle",
    }} />
  );
}

// ─── Modal component ──────────────────────────────────────────────────────────

interface LinkModalProps {
  open: boolean;
  editLink: LinkRecord | null; // null = create mode
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export function LinkModal({ open, editLink, onClose, onSuccess }: LinkModalProps) {
  const isEdit = editLink !== null;
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const [urlError, setUrlError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);

  // Populate / clear fields when modal opens
  useEffect(() => {
    if (!open) return;
    if (editLink) {
      setTitle(editLink.Title);
      setSlug(editLink.Slug);
      setTargetUrl(editLink.TargetUrl);
    } else {
      setTitle("");
      setSlug("");
      setTargetUrl("");
    }
    setUrlError("");
    setSubmitError("");
    const t = setTimeout(() => titleRef.current?.focus(), 60);
    return () => clearTimeout(t);
  }, [open, editLink]);

  // Escape to close
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);

  if (!open) return null;

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
    try {
      const url = isEdit ? `/api/proxy/links/${editLink.ID}` : "/api/proxy/links";
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, slug, target_url: targetUrl }),
      });
      if (res.ok) {
        onSuccess(isEdit ? "Link updated" : "Link created");
        onClose();
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

  const charCount = title.length;

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "rgba(0,0,0,0.28)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24,
        animation: "dash-fade-in 0.15s ease",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%", maxWidth: 480,
          background: "var(--bg)",
          border: "0.5px solid var(--border)",
          borderRadius: 4,
          padding: "32px 28px",
          boxShadow: "0 8px 40px rgba(0,0,0,0.14)",
          animation: "dash-modal-in 0.18s ease",
        }}
        onClick={e => e.stopPropagation()}
      >
        <h2 style={{
          fontFamily: "Fraunces, Georgia, serif", fontWeight: 300,
          fontSize: 20, color: "var(--text)", margin: "0 0 24px",
        }}>
          {isEdit ? "Edit link" : "Create a link"}
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

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting || !title || !slug || !targetUrl}
            style={{
              width: "100%", padding: "10px 0",
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: 14, fontWeight: 500,
              color: "var(--bg)", background: "var(--text)",
              border: "none", borderRadius: 4,
              cursor: submitting || !title || !slug || !targetUrl ? "not-allowed" : "pointer",
              opacity: submitting || !title || !slug || !targetUrl ? 0.6 : 1,
              transition: "opacity 0.15s",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            {submitting && <Spin />}
            {isEdit ? "Save changes" : "Create link"}
          </button>

          {submitError && (
            <p style={{ margin: "10px 0 0", fontSize: 12.5, color: "var(--accent)", fontFamily: "Inter, system-ui, sans-serif", textAlign: "center" }}>
              {submitError}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
