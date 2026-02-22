import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getSupabase } from "../lib/supabase";
import * as authService from "../services/authService";
import { createLogger } from "../lib/logger";
import type { User } from "../lib/types";

const log = createLogger("AuthProvider");

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<string>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: true,
  login: async () => {},
  register: async () => "",
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    log.info("Checking for existing session on mount...");

    let subscription: { unsubscribe: () => void } | null = null;

    getSupabase().then((supabase) => {
      // Check for existing session on mount
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          log.info("Existing session found", {
            userId: session.user.id,
            email: session.user.email,
            tokenExpiry: session.expires_at,
          });
          setUser({ id: session.user.id, email: session.user.email! });
          setToken(session.access_token);
          AsyncStorage.setItem("access_token", session.access_token);
        } else {
          log.info("No existing session found");
        }
        setLoading(false);
      });

      // Listen for auth state changes (token refresh, etc.)
      const { data } = supabase.auth.onAuthStateChange((event, session) => {
        log.info("Auth state changed", {
          event,
          hasSession: !!session,
          userId: session?.user?.id,
          email: session?.user?.email,
        });

        if (session?.user) {
          setUser({ id: session.user.id, email: session.user.email! });
          setToken(session.access_token);
          AsyncStorage.setItem("access_token", session.access_token);
          log.debug("Token stored in AsyncStorage");
        } else {
          log.info("Session cleared - user logged out");
          setUser(null);
          setToken(null);
          AsyncStorage.removeItem("access_token");
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
    setToken(result.access_token);
    await AsyncStorage.setItem("access_token", result.access_token);
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
    setToken(null);
    await AsyncStorage.removeItem("access_token");
    log.info("Logout flow complete - state cleared");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
