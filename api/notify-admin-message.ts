import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";

// Vercel Serverless Function
// Env:
// - RESEND_API_KEY
// - ADMIN_NOTIFY_EMAIL (default: starfine@naver.com)
// - PUBLIC_SITE_URL (optional)

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "Missing RESEND_API_KEY" });
    return;
  }

  const to = process.env.ADMIN_NOTIFY_EMAIL || "starfine@naver.com";

  const { title, content, userEmail, userName } = (req.body ?? {}) as {
    title?: string;
    content?: string;
    userEmail?: string | null;
    userName?: string | null;
  };

  if (!title || !content) {
    res.status(400).json({ error: "Missing title/content" });
    return;
  }

  const resend = new Resend(apiKey);

  const subject = `[BestWording] 운영진에게 쓰기: ${title}`;
  const text = [
    `새 문의가 도착했습니다.`,
    ``,
    `작성자: ${userName ?? "(unknown)"}`,
    `이메일: ${userEmail ?? "(unknown)"}`,
    ``,
    `제목: ${title}`,
    ``,
    content,
  ].join("\n");

  try {
    const result = await resend.emails.send({
      from: "BestWording <no-reply@bestwording.com>",
      to,
      subject,
      text,
    });

    res.status(200).json({ ok: true, result });
  } catch (err: any) {
    res.status(500).json({ error: err?.message ?? String(err) });
  }
}
