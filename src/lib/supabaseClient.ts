import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

const isValidHttpUrl = (value?: string) => {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

const hasValidConfig = isValidHttpUrl(supabaseUrl) && !!supabaseAnonKey;

if (!hasValidConfig) {
  // Keep this non-throwing so the app can still boot in dev even if env is missing/invalid.
  // Most auth actions will fail with a clear error message.
  console.warn(
    "[Supabase] Missing or invalid VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. Auth/DB features will be disabled."
  );
}

export const supabase = hasValidConfig
  ? createClient(supabaseUrl as string, supabaseAnonKey as string, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;
