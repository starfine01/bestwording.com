// 인증 관련 유틸리티 (Supabase 세션을 로컬스토리지에서 읽어오는 lightweight 래퍼)
// NOTE: 전체 앱을 Context 기반으로 리팩토링하기 전까지, 기존 코드 호환을 위해 유지합니다.

import { supabase } from "@/lib/supabaseClient";

export interface User {
  id: string;
  email: string;
  name: string;
  isMember: boolean;
  createdAt: string;
}

type StoredSupabaseSession = {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  token_type: string;
  user: {
    id: string;
    email?: string;
    created_at?: string;
    user_metadata?: Record<string, any>;
  };
};

const getSupabaseProjectRef = () => {
  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  if (!url) return null;
  // https://<ref>.supabase.co
  const m = url.match(/^https:\/\/([a-z0-9-]+)\.supabase\.co/i);
  return m?.[1] ?? null;
};

const getStoredSession = (): StoredSupabaseSession | null => {
  const ref = getSupabaseProjectRef();
  if (!ref) return null;
  const key = `sb-${ref}-auth-token`;
  const raw = localStorage.getItem(key);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    // supabase-js v2 stores { currentSession, expiresAt } 형태
    return (parsed?.currentSession ?? null) as StoredSupabaseSession | null;
  } catch {
    return null;
  }
};

export const getCurrentUser = (): User | null => {
  const session = getStoredSession();
  if (!session?.user?.id) return null;

  const email = session.user.email ?? "";
  const name = session.user.user_metadata?.name ?? email;

  return {
    id: session.user.id,
    email,
    name,
    isMember: true,
    createdAt: session.user.created_at ?? new Date().toISOString(),
  };
};

export const logout = (): void => {
  // best-effort (기존 동기 시그니처 유지)
  if (!supabase) return;
  void supabase.auth.signOut();
};

export const deleteAccount = (userId: string): void => {
  // TODO: Supabase Admin API(서비스 롤 키)로 실제 계정 삭제가 필요합니다.
  // 현재는 로그아웃만 수행.
  console.warn("deleteAccount is not implemented for Supabase yet", { userId });
  logout();
};

export const isGuestMode = (): boolean => {
  return !getCurrentUser();
};

export const isAdmin = (user: User | null): boolean => {
  if (!user) return false;
  return user.email === "starfine@naver.com";
};

