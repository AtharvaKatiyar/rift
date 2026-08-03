"use client";

import { useState } from "react";
import type { LinkRecord } from "@/types/dashboard";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

// ─── Copy button ──────────────────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handle = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* ignore */ }
  };
  return (
    <button
      onClick={handle}
      title={copied ? "Copied!" : "Copy link"}
      style={{
        background: "none", border: "none", padding: "2px 4px",
        cursor: "pointer",
        color: copied ? "#3a8a52" : "var(--faint)",
        lineHeight: 1, flexShrink: 0, transition: "color 0.15s",
      }}
    >
      {copied ? (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
        </svg>
      )}
    </button>
  );
}

// ─── Action button ────────────────────────────────────────────────────────────

function ActionBtn({
  id, children, danger = false, onClick, disabled = false,
}: {
  id: string;
  children: React.ReactNode;
  danger?: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      id={id}
      onClick={onClick}
      disabled={disabled}
      style={{
        background: "transparent",
        border: danger ? "0.5px solid rgba(166,80,59,0.25)" : "0.5px solid var(--border)",
        borderRadius: 2,
        padding: "6px 12px",
        cursor: disabled ? "not-allowed" : "pointer",
        fontFamily: "Inter, system-ui, sans-serif",
        fontSize: 12,
        fontWeight: 500,
        color: danger ? "#A6503B" : "var(--text)",
        opacity: disabled ? 0.5 : 1,
        transition: "border-color 0.13s, opacity 0.13s",
        whiteSpace: "nowrap",
      }}
      onMouseEnter={e => {
        if (!disabled)
          e.currentTarget.style.borderColor = danger ? "rgba(166,80,59,0.6)" : "var(--accent)";
      }}
      onMouseLeave={e => {
        if (!disabled)
          e.currentTarget.style.borderColor = danger ? "rgba(166,80,59,0.25)" : "var(--border)";
      }}
    >
      {children}
    </button>
  );
}

// ─── Link row ─────────────────────────────────────────────────────────────────

interface LinkRowProps {
  link: LinkRecord;
  username: string;
  isLast: boolean;
  onEdit: (link: LinkRecord) => void;
  onToggle: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function LinkRow({
  link, username, isLast, onEdit, onToggle, onDelete,
}: LinkRowProps) {
  const [toggling, setToggling] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Public URL: /u/{username}/{slug}/{uniqueID}
  const publicUrl = `${BASE_URL}/u/${username}/${link.Slug}/${link.UniqueID}`;
  const dimmed = !link.IsActive;

  const handleToggle = async () => {
    setToggling(true);
    await onToggle(link.ID);
    setToggling(false);
  };

  const handleDelete = async () => {
    setDeleting(true);
    await onDelete(link.ID);
    setDeleting(false);
    setConfirmDelete(false);
  };

  return (
    <div
      style={{
        borderBottom: isLast ? "none" : "0.5px solid var(--border)",
        padding: "24px 0",
        display: "grid",
        // Left col (title + url) | Right col (actions)
        gridTemplateColumns: "1fr auto",
        gap: "0 32px",
        alignItems: "center",
      }}
    >
      {/* ── Left: title + public URL ──────────────────────────────────── */}
      <div style={{ minWidth: 0 }}>
        {/* Title + inactive badge */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
          <p style={{
            margin: 0, fontSize: 16, fontWeight: 500,
            fontFamily: "Inter, system-ui, sans-serif",
            color: "var(--text)", opacity: dimmed ? 0.65 : 1,
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>
            {link.Title}
          </p>
          {!link.IsActive && (
            <span style={{
              fontSize: 10,
              fontFamily: "JetBrains Mono, Courier New, monospace",
              textTransform: "uppercase",
              color: "var(--muted)",
              border: "0.5px solid var(--muted)",
              padding: "2px 6px", borderRadius: 2,
              whiteSpace: "nowrap", flexShrink: 0,
              marginLeft: 8,
            }}>
              Inactive
            </span>
          )}
        </div>

        {/* Public URL */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <p style={{
            margin: 0, fontSize: 12.5, lineHeight: 1.4,
            fontFamily: "JetBrains Mono, Courier New, monospace",
            opacity: dimmed ? 0.65 : 1,
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            color: "var(--muted)",
          }}>
            {BASE_URL}/u/{username}/<span style={{ color: "var(--accent)" }}>{link.Slug}</span>/{link.UniqueID}
          </p>
          <div style={{ marginLeft: 8, display: "flex", alignItems: "center" }}>
            <CopyButton text={publicUrl} />
          </div>
        </div>
      </div>


      {/* ── Right: actions ────────────────────────────────────────────── */}
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, flexShrink: 0 }}>
        {confirmDelete ? (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{
              fontSize: 12, color: "var(--muted)",
              fontFamily: "Inter, system-ui, sans-serif", whiteSpace: "nowrap",
            }}>
              Delete this link?
            </span>
            <ActionBtn id={`cancel-delete-${link.ID}`} onClick={() => setConfirmDelete(false)}>
              Cancel
            </ActionBtn>
            <ActionBtn
              id={`confirm-delete-${link.ID}`}
              danger onClick={handleDelete} disabled={deleting}
            >
              {deleting ? "Deleting…" : "Confirm"}
            </ActionBtn>
          </div>
        ) : (
          <>
            <ActionBtn id={`edit-${link.ID}`} onClick={() => onEdit(link)}>
              Edit
            </ActionBtn>
            <ActionBtn id={`toggle-${link.ID}`} onClick={handleToggle} disabled={toggling}>
              {link.IsActive ? "Deactivate" : "Activate"}
            </ActionBtn>
            <ActionBtn id={`delete-${link.ID}`} danger onClick={() => setConfirmDelete(true)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </ActionBtn>
          </>
        )}
      </div>
    </div>
  );
}
