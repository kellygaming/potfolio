"use client";
import { useRef, useState } from "react";
import { projectTypes, site } from "@/lib/site";
import { Arrow, WhatsAppIcon } from "./Icons";
type Status = { kind: "idle" | "busy" | "ok" | "error"; message: string };
export default function Contact() {
  const [status, setStatus] = useState<Status>({ kind: "idle", message: "" });
  const sending = useRef(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending.current) return;
    const form = event.currentTarget;
    sending.current = true;
    setStatus({ kind: "busy", message: "Envoi de votre demande…" });
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(new FormData(form))), signal: controller.signal });
      const result = await response.json();
      if (!response.ok || result.ok !== true) throw new Error(result.error || "L’envoi n’a pas abouti. Vous pouvez me joindre sur WhatsApp.");
      form.reset();
      setStatus({ kind: "ok", message: "Merci ! Votre demande a été envoyée. Je reviendrai vers vous pour discuter du projet." });
    } catch (error) {
      setStatus({ kind: "error", message: error instanceof Error && error.name === "AbortError" ? "Le service n’a pas confirmé l’envoi. Contactez-moi sur WhatsApp pour vérifier la réception." : error instanceof Error ? error.message : "Un problème de connexion est survenu. Contactez-moi sur WhatsApp." });
    } finally { window.clearTimeout(timeout); sending.current = false; }
  }
  return <section className="contact section" id="contact" aria-labelledby="contact-title"><div className="wrap contact-grid"><div className="contact-intro"><p className="eyebrow">Votre prochain projet</p><h2 id="contact-title">Vous avez l’idée.<br />Donnons-lui<br />une adresse.</h2><p>Un nouveau site, une boutique ou une refonte ? Parlez-moi de votre activité et de ce que vous souhaitez créer.</p><a className="btn btn-primary" href={site.whatsapp} target="_blank" rel="noopener noreferrer"><WhatsAppIcon />Écrire sur WhatsApp<Arrow diagonal /></a><p className="contact-phone">{site.phone}</p><p className="contact-note">Échanges en français · Afrique & international</p></div><form className="form" onSubmit={submit} aria-busy={status.kind === "busy"}><h3>Présentez-moi votre projet</h3><p className="form-hint">Les champs marqués d’un * sont obligatoires.</p><div className="form-grid"><div className="field"><label htmlFor="nom">Votre nom *</label><input id="nom" name="nom" required maxLength={100} autoComplete="name" /></div><div className="field"><label htmlFor="email">Votre e-mail *</label><input id="email" name="email" type="email" required maxLength={160} autoComplete="email" /></div><div className="field"><label htmlFor="whatsapp">Téléphone / WhatsApp</label><input id="whatsapp" name="whatsapp" type="tel" maxLength={40} autoComplete="tel" placeholder="Avec l’indicatif du pays" /></div><div className="field"><label htmlFor="projet">Type de projet</label><select id="projet" name="projet" defaultValue="Site vitrine">{projectTypes.map(type => <option key={type}>{type}</option>)}</select></div><div className="field full"><label htmlFor="budget">Budget envisagé (facultatif)</label><input id="budget" name="budget" maxLength={60} placeholder="Montant et devise, ou à définir" /></div><div className="field full"><label htmlFor="message">Votre projet en quelques mots *</label><textarea id="message" name="message" required minLength={10} maxLength={4000} rows={4} placeholder="Votre activité, vos objectifs, le site actuel s’il existe…" /></div></div><div className="hp" aria-hidden="true"><label htmlFor="website">Ne pas remplir</label><input id="website" name="website" tabIndex={-1} autoComplete="off" /></div><p className="form-privacy">Votre demande est transmise par e-mail pour permettre à Kelly de vous répondre. Vous pouvez aussi choisir un échange direct sur WhatsApp.</p><button className="btn btn-dark" type="submit" disabled={status.kind === "busy"}>{status.kind === "busy" ? "Envoi en cours…" : "Envoyer ma demande"}<Arrow /></button><div className="form-status" data-kind={status.kind} role="status" aria-live="polite" aria-atomic="true">{status.message}</div>{status.kind === "error" && <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="text-link form-fallback">Continuer sur WhatsApp<Arrow diagonal /></a>}</form></div></section>;
}
