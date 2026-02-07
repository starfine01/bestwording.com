import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";

// Env:
// - RESEND_API_KEY
// - USER_REPLY_FROM (default: BestWording <no-reply@bestwording.com>)

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

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "Missing RESEND_API_KEY" });
    return;
  }

  const { userEmail, title, adminReply } = (req.body ?? {}) as {
    userEmail?: string;
    title?: string;
    adminReply?: string;
  };

  if (!userEmail || !title || !adminReply) {
    res.status(400).json({ error: "Missing userEmail/title/adminReply" });
    return;
  }

  const from = process.env.USER_REPLY_FROM || "BestWording <no-reply@bestwording.com>";
  const subject = `[BestWording] 답변이 도착했습니다: ${title}`;
  const text = [
    "운영진 답변이 도착했습니다.",
    "",
    `제목: ${title}`,
    "",
    adminReply,
  ].join("\n");

  try {
    const resend = new Resend(apiKey);
    const result = await resend.emails.send({
      from,
      to: userEmail,
      subject,
      text,
    });

    res.status(200).json({ ok: true, result });
  } catch (err: any) {
    res.status(500).json({ error: err?.message ?? String(err) });
  }
}
