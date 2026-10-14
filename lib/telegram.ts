// Alerte Telegram vers Kelly, sur le modèle de kora-topup (api/_telegram.js).
// Chaque alerte commence par « PORTFOLIO » : le mot à taper dans la recherche
// Telegram pour retrouver toutes les demandes du site.

const esc = (v: string) => v.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]!);

export const telegramReady = () => Boolean(process.env.TELEGRAM_ALERT_TOKEN && process.env.TELEGRAM_ALERT_CHAT_ID);

export async function sendTelegram(html: string) {
  const token = process.env.TELEGRAM_ALERT_TOKEN;
  const chat = process.env.TELEGRAM_ALERT_CHAT_ID;
  if (!token || !chat) return false;
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chat, text: html, parse_mode: "HTML", disable_web_page_preview: true }),
      signal: AbortSignal.timeout(6000),
    });
    const data = await res.json().catch(() => ({}));
    if (!data.ok) console.error("telegram", res.status, data.description || "");
    return Boolean(data.ok);
  } catch {
    console.error("telegram injoignable");
    return false;
  }
}

export function projectAlert(d: Record<string, string>) {
  const digits = d.whatsapp.replace(/\D/g, "");
  const wa = digits ? `<a href="https://wa.me/${digits}">${esc(d.whatsapp)}</a>` : "";
  const rows: [string, string][] = [
    ["Nom", esc(d.nom)],
    ["E-mail", esc(d.email)],
    ["WhatsApp", wa],
    ["Projet", esc(d.projet)],
    ["Budget", esc(d.budget)],
  ];
  return [
    "📩 <b>PORTFOLIO — Nouvelle demande de projet</b>",
    "",
    ...rows.filter(([, v]) => v).map(([k, v]) => `<b>${k} :</b> ${v}`),
    "",
    `<b>Message :</b>\n${esc(d.message)}`,
  ].join("\n");
}
