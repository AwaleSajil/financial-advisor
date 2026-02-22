import React, { createContext, useContext, useEffect, useState } from "react";
import { getSupabase } from "../lib/supabase";
import * as authService from "../services/authService";
import { createLogger } from "../lib/logger";
import type { User } from "../lib/types";

const log = createLogger("AuthProvider");

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<string>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  register: async () => "",
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    log.info("Checking for existing session on mount...");

    let subscription: { unsubscribe: () => void } | null = null;

    getSupabase().then((supabase) => {
      // Verify session on mount by refreshing with the server.
      // getSession() only returns the local cache which may be stale
      // (e.g. session revoked server-side). refreshSession() validates
      // and returns a fresh token, or null if the session is truly dead.
      supabase.auth.refreshSession().then(({ data: { session }, error }) => {
        if (error) {
          log.warn("Session refresh failed on mount", { error: error.message });
        }
        if (session?.user) {
          log.info("Valid session found", {
            userId: session.user.id,
            email: session.user.email,
            tokenExpiry: session.expires_at,
          });
          setUser({ id: session.user.id, email: session.user.email! });
        } else {
          log.info("No valid session found");
        }
        setLoading(false);
      });

      // Listen for auth state changes (token refresh, sign-in, sign-out)
      const { data } = supabase.auth.onAuthStateChange((event, session) => {
        log.info("Auth state changed", {
          event,
          hasSession: !!session,
          userId: session?.user?.id,
          email: session?.user?.email,
        });

        if (session?.user) {
          setUser({ id: session.user.id, email: session.user.email! });
        } else {
          log.info("Session cleared - user logged out");
          setUser(null);
        }
      });
      subscription = data.subscription;
    });

    return () => {
      log.debug("Unsubscribing auth state listener");
      subscription?.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    log.info("Login flow started", { email });
    const result = await authService.login(email, password);
    log.info("Login flow complete - setting user state", { userId: result.user.id });
    setUser(result.user);
  };

  const register = async (email: string, password: string) => {
    log.info("Register flow started", { email });
    const result = await authService.register(email, password);
    log.info("Register flow complete", { message: result.message });
    return result.message;
  };

  const logout = async () => {
    log.info("Logout flow started");
    await authService.logout();
    setUser(null);
    log.info("Logout flow complete - state cleared");
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
