"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { apiFetch } from "@/lib/auth";

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  email_verified: boolean;
}

interface AuthCtx {
  user: AuthUser | null;
  loading: boolean;
  refetch: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthCtx>({
  user: null,
  loading: true,
  refetch: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = useCallback(async () => {
    try {
      const res = await apiFetch("/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data as AuthUser);
      } else {
        // Silently handle 401 - user is just not authenticated, not an error
        setUser(null);
      }
    } catch (error) {
      // Silently handle errors - user is just not authenticated
      setUser(null);
    }
  }, []);

  const refetch = useCallback(async () => {
    await fetchMe();
  }, [fetchMe]);

  const logout = useCallback(async () => {
    try {
      await apiFetch("/auth/logout", { method: "POST" });
    } catch {
      // ignore network errors on logout
    } finally {
      setUser(null);
      window.location.href = "/auth";
    }
  }, []);

  useEffect(() => {
    fetchMe().finally(() => setLoading(false));
  }, [fetchMe]);

  return (
    <AuthContext.Provider value={{ user, loading, refetch, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
