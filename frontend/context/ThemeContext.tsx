"use client";

import {
  createContext,
  useContext,
  useLayoutEffect,
  useState,
  useCallback,
} from "react";
import { usePathname } from "next/navigation";

interface ThemeCtx {
  isDark: boolean;
  toggle: () => void;
}

const Ctx = createContext<ThemeCtx>({ isDark: false, toggle: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(false);

  useLayoutEffect(() => {
    const isPublicRoute = pathname === "/" || pathname === "/auth" || !pathname;
    if (isPublicRoute) {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    } else {
      const savedTheme = localStorage.getItem("rift-theme");
      const shouldBeDark = savedTheme === "dark";
      if (shouldBeDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      setIsDark(shouldBeDark);
    }
  }, [pathname]);

  const toggle = useCallback(() => {
    const p = window.location.pathname;
    const isPublicRoute = p === "/" || p === "/auth" || !p;
    if (isPublicRoute) return;

    setIsDark((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("rift-theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("rift-theme", "light");
      }
      return next;
    });
  }, []);

  return <Ctx.Provider value={{ isDark, toggle }}>{children}</Ctx.Provider>;
}

export const useTheme = () => useContext(Ctx);
