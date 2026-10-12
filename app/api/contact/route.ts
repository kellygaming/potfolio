import { Resend } from "resend";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { escapeHtml, validateContact } from "@/lib/contact";
export const runtime = "nodejs";
export async function POST(req: Request) {
  if (!rateLimit("contact:" + clientIp(req), 5, 60 * 60_000)) return Response.json({ error: "Trop de demandes. Réessayez plus tard ou contactez-moi sur WhatsApp." }, { status: 429 });
  let body: unknown;
  try { body = await req.json(); } catch { return Response.json({ error: "Requête invalide." }, { status: 400 }); }
  const result = validateContact(body);
  if (result.kind === "spam") return Response.json({ ok: true });
  if (result.kind === "invalid") return Response.json({ error: result.error }, { status: 400 });
  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!key || !to) return Response.json({ error: "Le formulaire est momentanément indisponible. Contactez-moi directement sur WhatsApp." }, { status: 503 });
  const labels = { nom: "Nom", email: "E-mail", whatsapp: "Téléphone / WhatsApp", projet: "Projet", budget: "Budget", message: "Message" };
  const rows = Object.entries(result.data).filter(([, value]) => value).map(([field, value]) => '<tr><td style="padding:8px;vertical-align:top">' + labels[field as keyof typeof labels] + '</td><td style="padding:8px;white-space:pre-wrap">' + escapeHtml(value) + '</td></tr>').join("");
  try {
    const resend = new Resend(key);
    const { error } = await resend.emails.send({ from: process.env.CONTACT_FROM_EMAIL || "Portfolio Kelly <onboarding@resend.dev>", to: [to], replyTo: result.data.email, subject: "Nouveau projet : " + (result.data.projet || "demande") + " — " + result.data.nom, html: '<h2>Nouvelle demande depuis le portfolio de Kelly</h2><table style="font-family:sans-serif;font-size:14px">' + rows + '</table>', text: Object.entries(result.data).map(([field, value]) => labels[field as keyof typeof labels] + ": " + value).join("\n") });
    if (!error) return Response.json({ ok: true });
    console.error("contact: échec de livraison", error.name);
  } catch { console.error("contact: service indisponible"); }
  return Response.json({ error: "L’envoi n’a pas été confirmé. Contactez-moi sur WhatsApp pour vérifier la réception." }, { status: 502 });
}
