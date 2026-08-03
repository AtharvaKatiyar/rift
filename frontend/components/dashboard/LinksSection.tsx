"use client";

import { useRef } from "react";
import type { LinkRecord, Pagination } from "@/types/dashboard";
import { LinkRow } from "./LinkRow";

interface LinksSectionProps {
  rows: LinkRecord[];
  pagination: Pagination | null;
  username: string;
  currentPage: number;
  onEdit: (link: LinkRecord) => void;
  onToggle: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onPageChange: (page: number) => void;
  onCreateOpen: () => void;
}

// ── Primary button ─────────────────────────────────────────────────────────────

function PrimaryBtn({ id, children, onClick }: { id: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      id={id}
      onClick={onClick}
      style={{
        padding: "10px 20px",
        fontFamily: "Inter, system-ui, sans-serif",
        fontSize: 14, fontWeight: 500,
        color: "var(--bg)", background: "var(--text)",
        border: "none", borderRadius: 4, cursor: "pointer",
        transition: "opacity 0.15s", whiteSpace: "nowrap",
      }}
      onMouseEnter={e => { e.currentTarget.style.opacity = "0.85"; }}
      onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
    >
      {children}
    </button>
  );
}

// ── Page button ────────────────────────────────────────────────────────────────

function PageBtn({ children, disabled, onClick }: { children: React.ReactNode; disabled: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "6px 14px",
        fontFamily: "Inter, system-ui, sans-serif",
        fontSize: 12.5,
        color: "var(--text)",
        background: "none",
        border: "0.5px solid var(--border-mid)",
        borderRadius: 4,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.4 : 1,
        transition: "background 0.13s",
      }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.background = "var(--surface)"; }}
      onMouseLeave={e => { e.currentTarget.style.background = "none"; }}
    >
      {children}
    </button>
  );
}

// ── Links section ──────────────────────────────────────────────────────────────

export function LinksSection({
  rows, pagination, username, currentPage,
  onEdit, onToggle, onDelete, onPageChange, onCreateOpen,
}: LinksSectionProps) {
  const topRef = useRef<HTMLDivElement>(null);

  const handlePage = (p: number) => {
    onPageChange(p);
    setTimeout(() => topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  const totalPages = pagination?.total_pages ?? 1;

  return (
    <div>
      {/* ── Header ──────────────────────────────────────────────────── */}
      <div
        ref={topRef}
        style={{
          display: "flex", alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
        }}
      >
        <h2 style={{
          fontFamily: "Fraunces, Georgia, serif",
          fontWeight: 300, fontSize: 28,
          color: "var(--text)", margin: 0,
        }}>
          Your links
        </h2>
        <PrimaryBtn id="new-link-btn" onClick={onCreateOpen}>New link</PrimaryBtn>
      </div>

      {/* ── Empty state ───────────────────────────────────────────────── */}
      {rows.length === 0 ? (
        <div style={{
          border: "1px dashed var(--border-mid)",
          borderRadius: 4,
          padding: "56px 32px",
          textAlign: "center",
        }}>
          <p style={{
            fontFamily: "Fraunces, Georgia, serif",
            fontStyle: "italic", fontWeight: 300,
            fontSize: 20, color: "var(--text)",
            margin: "0 0 10px",
          }}>
            No links yet
          </p>
          <p style={{
            fontSize: 13.5, color: "var(--muted)",
            fontFamily: "Inter, system-ui, sans-serif",
            margin: "0 auto 20px", maxWidth: 380, lineHeight: 1.6,
          }}>
            Create your first permanent link and start sharing it.
          </p>
          <PrimaryBtn id="create-first-link-btn" onClick={onCreateOpen}>
            Create your first link
          </PrimaryBtn>
        </div>
      ) : (
        /* ── Rows ────────────────────────────────────────────────────── */
        <>
          <div>
            {rows.map((link) => (
              <LinkRow
                key={link.ID}
                link={link}
                username={username}
                isLast={rows[rows.length - 1].ID === link.ID}
                onEdit={onEdit}
                onToggle={onToggle}
                onDelete={onDelete}
              />
            ))}
          </div>

          {/* ── Pagination ─────────────────────────────────────────────── */}
          {totalPages > 1 && (
            <div style={{
              marginTop: 20,
              display: "flex", alignItems: "center",
              justifyContent: "center", gap: 14,
            }}>
              <PageBtn disabled={currentPage <= 1} onClick={() => handlePage(currentPage - 1)}>
                ← Previous
              </PageBtn>
              <span style={{
                fontSize: 12.5, color: "var(--muted)",
                fontFamily: "Inter, system-ui, sans-serif",
              }}>
                Page {currentPage} of {totalPages}
              </span>
              <PageBtn disabled={currentPage >= totalPages} onClick={() => handlePage(currentPage + 1)}>
                Next →
              </PageBtn>
            </div>
          )}
        </>
      )}
    </div>
  );
}
