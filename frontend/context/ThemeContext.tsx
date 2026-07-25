"use client";

import {
  createContext,
  useContext,
  useLayoutEffect,
  useState,
  useCallback,
} from "react";

interface ThemeCtx {
  isDark: boolean;
  toggle: () => void;
}

const Ctx = createContext<ThemeCtx>({ isDark: false, toggle: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  /*
   * useLayoutEffect runs synchronously BEFORE the browser paints.
   * The anti-flash <script> has already set .dark on <html> at this point,
   * so we read the correct class and update state before any pixel is drawn.
   * This eliminates the light-flash on first load AND on navigation.
   */
  useLayoutEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = useCallback(() => {
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
