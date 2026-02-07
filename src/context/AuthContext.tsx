import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    if (!supabase) {
      setSession(null);
      setLoading(false);
      return () => {
        mounted = false;
      };
    }

    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (!mounted) return;
        if (error) console.warn("[Supabase] getSession error", error);
        setSession(data.session ?? null);
        setLoading(false);
      })
      .catch((err) => {
        if (!mounted) return;
        console.warn("[Supabase] getSession failed", err);
        setSession(null);
        setLoading(false);
      });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setLoading(false);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const user = session?.user ?? null;

  const value = useMemo<AuthContextValue>(() => {
    const adminEmails = new Set(["starfine@naver.com"]);
    const isAdmin = !!user?.email && adminEmails.has(user.email);

    const notReady = async () => {
      throw new Error("Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
    };

    return {
      session,
      user,
      loading,
      signIn: supabase
        ? async (email: string, password: string) => {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
          }
        : notReady,
      signUp: supabase
        ? async (email: string, password: string) => {
            const { error } = await supabase.auth.signUp({ email, password });
            if (error) throw error;
          }
        : notReady,
      signOut: supabase
        ? async () => {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
          }
        : notReady,
      isAdmin,
    };
  }, [session, user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
