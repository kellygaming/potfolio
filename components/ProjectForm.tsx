"use client";

import { useState } from "react";
import type { FormEvent } from "react";

const PROJECTS = ["Site web", "Vidéo publicitaire IA", "Site + vidéo", "Application IA", "Montage vidéo", "Autre"];
const BUDGETS = ["À définir", "Moins de 100 000 F CFA", "100 000 – 300 000 F CFA", "300 000 – 1 000 000 F CFA", "Plus de 1 000 000 F CFA"];

/** Fiche projet : envoyée à /api/contact (Telegram, puis e-mail Resend si configuré). */
export default function ProjectForm() {
  const [state, setState] = useState<{ kind: "" | "ok" | "err" | "busy"; msg: string }>({ kind: "", msg: "" });

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setState({ kind: "busy", msg: "" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      const out = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(out.error || "L'envoi a échoué.");
      form.reset();
      setState({ kind: "ok", msg: "Merci ! Votre demande est bien arrivée. Je vous réponds très vite." });
    } catch (err) {
      setState({ kind: "err", msg: (err as Error).message });
    }
  };

  return (
    <form className="form" id="fiche" onSubmit={onSubmit} aria-label="Fiche projet">
      <div className="field">
        <label htmlFor="nom">Nom complet *</label>
        <input id="nom" name="nom" required maxLength={100} autoComplete="name" />
      </div>
      <div className="field">
        <label htmlFor="email">E-mail *</label>
        <input id="email" name="email" type="email" required maxLength={160} autoComplete="email" />
      </div>
      <div className="field">
        <label htmlFor="whatsapp">WhatsApp / téléphone</label>
        <input id="whatsapp" name="whatsapp" type="tel" maxLength={40} autoComplete="tel" placeholder="+225 …" />
      </div>
      <div className="field">
        <label htmlFor="budget">Budget</label>
        <select id="budget" name="budget" defaultValue={BUDGETS[0]}>
          {BUDGETS.map((b) => (
            <option key={b}>{b}</option>
          ))}
        </select>
      </div>
      <fieldset className="field full">
        <legend>Type de projet</legend>
        <div className="choices">
          {PROJECTS.map((p, i) => (
            <label key={p}>
              <input type="radio" name="projet" value={p} defaultChecked={i === 0} />
              <span>{p}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="field full">
        <label htmlFor="message">Votre projet en quelques mots *</label>
        <textarea id="message" name="message" required minLength={10} maxLength={4000} placeholder="Objectif, délais, exemples que vous aimez…" />
      </div>
      <input className="hp" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <div className="form-foot">
        <button className="btn btn-lg" type="submit" disabled={state.kind === "busy"}>
          {state.kind === "busy" ? "Envoi…" : "Envoyer ma demande"}
        </button>
        <p className="form-status" data-kind={state.kind} role="status">
          {state.msg}
        </p>
      </div>
    </form>
  );
}
