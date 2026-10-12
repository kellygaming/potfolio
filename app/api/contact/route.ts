import { clientIp, rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

const field = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(req: Request) {
  if (!rateLimit(`contact:${clientIp(req)}`, 5, 60 * 60_000)) {
    return Response.json({ error: "Trop d'envois. Réessayez plus tard." }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Requête invalide." }, { status: 400 });
  }

  // Pot de miel : un humain ne remplit jamais ce champ caché.
  if (field(body.website, 200)) return Response.json({ ok: true });

  const data = {
    nom: field(body.nom, 100),
    email: field(body.email, 160),
    whatsapp: field(body.whatsapp, 40),
    projet: field(body.projet, 60),
    budget: field(body.budget, 60),
    message: field(body.message, 4000),
  };

  if (!data.nom || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) || data.message.length < 10) {
    return Response.json({ error: "Merci d'indiquer votre nom, un e-mail valide et quelques mots sur votre projet." }, { status: 400 });
  }

  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!key || !to) {
    return Response.json({ error: "Le formulaire n'est pas encore branché. Réessayez bientôt." }, { status: 503 });
  }

  const rows = Object.entries(data)
    .filter(([, v]) => v)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px;color:#888;vertical-align:top">${k}</td><td style="padding:6px 12px;white-space:pre-wrap">${esc(v)}</td></tr>`,
    )
    .join("");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL || "Portfolio Kelly <onboarding@resend.dev>",
      to: [to],
      reply_to: data.email,
      subject: `Nouveau projet : ${data.projet || "demande"} — ${data.nom}`,
      html: `<h2 style="font-family:sans-serif">Nouvelle demande depuis le portfolio</h2><table style="font-family:sans-serif;font-size:14px">${rows}</table>`,
      text: Object.entries(data).map(([k, v]) => `${k}: ${v}`).join("\n"),
    }),
  }).catch(() => null);

  if (!res?.ok) {
    return Response.json({ error: "L'envoi a échoué. Réessayez dans un instant." }, { status: 502 });
  }
  return Response.json({ ok: true });
}
