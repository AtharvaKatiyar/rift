"use client";

/**
 * ErrorBanner — fixed bottom-right toast for mutation/network errors.
 * One at a time; auto-dismisses after 4s with a 0.3s fade-out.
 */

import { createContext, useCallback, useContext, useRef, useState } from "react";

// ─── Context ──────────────────────────────────────────────────────────────────

interface ErrorCtx {
  showError: (msg: string) => void;
}

const ErrorContext = createContext<ErrorCtx>({ showError: () => {} });

export function useErrorBanner() {
  return useContext(ErrorContext);
}

// ─── Banner ───────────────────────────────────────────────────────────────────

interface BannerState {
  msg: string;
  key: number;
  fading: boolean;
}

export function ErrorBannerProvider({ children }: { children: React.ReactNode }) {
  const [banner, setBanner] = useState<BannerState | null>(null);
  const autoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fadeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = () => {
    if (autoTimer.current) clearTimeout(autoTimer.current);
    if (fadeTimer.current) clearTimeout(fadeTimer.current);
  };

  const dismiss = useCallback(() => {
    clearTimers();
    setBanner(prev => prev ? { ...prev, fading: true } : null);
    fadeTimer.current = setTimeout(() => setBanner(null), 320);
  }, []);

  const showError = useCallback((msg: string) => {
    clearTimers();
    setBanner({ msg, key: Date.now(), fading: false });
    autoTimer.current = setTimeout(dismiss, 4000);
  }, [dismiss]);

  return (
    <ErrorContext.Provider value={{ showError }}>
      {children}
      {banner && (
        <div
          key={banner.key}
          role="alert"
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 100,
            maxWidth: 380,
            minWidth: 260,
            background: "var(--surface)",
            border: "0.5px solid var(--border)",
            borderLeft: "3px solid #A6503B",
            borderRadius: 4,
            padding: "14px 18px",
            display: "flex",
            alignItems: "flex-start",
            gap: 12,
            boxShadow: "0 4px 20px rgba(0,0,0,0.10)",
            opacity: banner.fading ? 0 : 1,
            transform: banner.fading ? "translateY(4px)" : "translateY(0)",
            transition: "opacity 0.3s ease, transform 0.3s ease",
          }}
        >
          <p style={{
            flex: 1,
            margin: 0,
            fontSize: 13,
            fontFamily: "Inter, system-ui, sans-serif",
            color: "var(--text)",
            lineHeight: 1.5,
          }}>
            {banner.msg}
          </p>
          <button
            onClick={dismiss}
            aria-label="Dismiss error"
            style={{
              background: "none", border: "none",
              cursor: "pointer", padding: "0 2px",
              fontSize: 16, lineHeight: 1,
              color: "var(--muted)",
              flexShrink: 0,
              transition: "color 0.13s",
            }}
            onMouseEnter={e => { e.currentTarget.style.color = "var(--text)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "var(--muted)"; }}
          >
            ×
          </button>
        </div>
      )}
    </ErrorContext.Provider>
  );
}
