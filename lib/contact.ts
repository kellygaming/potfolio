export const projectTypes = ["Site vitrine", "Boutique en ligne", "Application web", "Refonte de site", "Autre"] as const;
export type ContactData = { nom: string; email: string; whatsapp: string; projet: string; budget: string; message: string };
type Validation = { kind: "valid"; data: ContactData } | { kind: "spam" } | { kind: "invalid"; error: string };
const limits = { nom: 100, email: 160, whatsapp: 40, projet: 60, budget: 60, message: 4000 } as const;
export function validateContact(body: unknown): Validation {
  if (!body || typeof body !== "object" || Array.isArray(body)) return { kind: "invalid", error: "Requête invalide." };
  const input = body as Record<string, unknown>;
  if (typeof input.website === "string" && input.website.trim()) return { kind: "spam" };
  const data: ContactData = { nom: "", email: "", whatsapp: "", projet: "", budget: "", message: "" };
  for (const key of Object.keys(limits) as (keyof ContactData)[]) {
    const value = input[key];
    if (value !== undefined && typeof value !== "string") return { kind: "invalid", error: "Certains champs ne sont pas valides." };
    const text = typeof value === "string" ? value.trim() : "";
    if (text.length > limits[key]) return { kind: "invalid", error: "Votre demande dépasse la longueur autorisée." };
    data[key] = text;
  }
  if (!data.nom || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) || data.message.length < 10) return { kind: "invalid", error: "Indiquez votre nom, un e-mail valide et au moins 10 caractères pour décrire votre projet." };
  if (/[\r\n]/.test(data.nom + data.projet + data.email)) return { kind: "invalid", error: "Le nom, l’e-mail et le type de projet doivent tenir sur une ligne." };
  if (data.projet && !(projectTypes as readonly string[]).includes(data.projet)) return { kind: "invalid", error: "Choisissez un type de projet dans la liste." };
  return { kind: "valid", data };
}
export function escapeHtml(text: string) { return text.replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!); }
