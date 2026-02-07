import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

// Env:
// - SUPABASE_URL (required) OR VITE_SUPABASE_URL
// - SUPABASE_SERVICE_ROLE_KEY (required)

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const getAdminClient = () => {
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  try {
    const { action, payload } = (req.body ?? {}) as {
      action?: "list" | "update" | "reply" | "delete";
      payload?: any;
    };

    if (!action) {
      res.status(400).json({ error: "Missing action" });
      return;
    }

    const supabase = getAdminClient();

    if (action === "list") {
      const { data, error } = await supabase
        .from("admin_messages")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      res.status(200).json({ ok: true, data });
      return;
    }

    if (action === "update") {
      const { id, updates } = payload ?? {};
      if (!id || !updates) {
        res.status(400).json({ error: "Missing id/updates" });
        return;
      }
      const { data, error } = await supabase
        .from("admin_messages")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select("*")
        .single();
      if (error) throw error;
      res.status(200).json({ ok: true, data });
      return;
    }

    if (action === "reply") {
      const { id, adminReply } = payload ?? {};
      if (!id || !adminReply) {
        res.status(400).json({ error: "Missing id/adminReply" });
        return;
      }
      const { data, error } = await supabase
        .from("admin_messages")
        .update({
          admin_reply: adminReply,
          admin_reply_at: new Date().toISOString(),
          is_read: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select("*")
        .single();
      if (error) throw error;
      res.status(200).json({ ok: true, data });
      return;
    }

    if (action === "delete") {
      const { id } = payload ?? {};
      if (!id) {
        res.status(400).json({ error: "Missing id" });
        return;
      }
      const { error } = await supabase.from("admin_messages").delete().eq("id", id);
      if (error) throw error;
      res.status(200).json({ ok: true });
      return;
    }

    res.status(400).json({ error: "Unknown action" });
  } catch (err: any) {
    res.status(500).json({ error: err?.message ?? String(err) });
  }
}
