"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiFetch } from "@/lib/auth";
import { Suspense } from "react";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const called = useRef(false);

  useEffect(() => {
    if (!token) {
      router.replace("/auth");
      return;
    }

    if (called.current) return;
    called.current = true;

    apiFetch("/auth/verify-email", {
      method: "POST",
      body: JSON.stringify({ token }),
    })
      .then((res) => {
        if (res.ok) {
          router.replace("/email-verified");
        } else {
          router.replace("/email-verification-error");
        }
      })
      .catch(() => {
        router.replace("/email-verification-error");
      });
  }, [token, router]);

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg)",
        gap: 20,
        padding: "40px 16px",
      }}
    >
      <Image
        src="/rift_off_logo.png"
        alt="Rift"
        width={56}
        height={36}
        className="auth-logo-img"
        style={{ opacity: 0.7 }}
      />
      <style>{`
        @keyframes rift-spin { to { transform: rotate(360deg); } }
      `}</style>
      <div
        style={{
          width: 28,
          height: 28,
          border: "2.5px solid var(--border-mid)",
          borderTopColor: "var(--accent)",
          borderRadius: "50%",
          animation: "rift-spin 0.8s linear infinite",
        }}
      />
      <p
        style={{
          fontSize: 14,
          color: "var(--muted)",
          fontFamily: "Inter, system-ui, sans-serif",
          letterSpacing: "0.01em",
        }}
      >
        Verifying your email…
      </p>
    </main>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailContent />
    </Suspense>
  );
}
