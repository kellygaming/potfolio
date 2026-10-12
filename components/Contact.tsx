"use client";

import { useState } from "react";

const PROJECTS = ["Site web", "Vidéo publicitaire IA", "Site + vidéo", "Montage vidéo", "Autre"];
const BUDGETS = ["À définir", "Moins de 100 000 F CFA", "100 000 – 300 000 F CFA", "300 000 – 1 000 000 F CFA", "Plus de 1 000 000 F CFA"];

export default function Contact() {
  const [state, setState] = useState<{ kind: "" | "ok" | "err" | "busy"; msg: string }>({ kind: "", msg: "" });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setState({ kind: "busy", msg: "" });
    const data = Object.fromEntries(new FormData(form));
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
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
    <section className="contact" id="contact" aria-labelledby="contact-title">
      <div className="wrap contact-grid">
        <div className="contact-intro" data-reveal>
          <span className="eyebrow">Votre projet</span>
          <h2 className="section-title" id="contact-title">
            Parlons de <em className="ai-text">votre projet</em>.
          </h2>
          <p>
            Un site web, une vidéo publicitaire réalisée avec l&apos;IA, un montage ? Remplissez la fiche : je la reçois
            directement et je reviens vers vous avec une proposition claire.
          </p>
        </div>

        <form className="form" onSubmit={onSubmit} data-reveal="0.1" noValidate={false}>
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
          <input className="hp" name="website" tabIndex={-1} autoComplete="off" aria-hidden />
          <div className="form-foot">
            <button className="btn btn-primary" type="submit" disabled={state.kind === "busy"}>
              {state.kind === "busy" ? "Envoi…" : "Envoyer ma demande"}
            </button>
            <p className="form-status" data-kind={state.kind} role="status">
              {state.msg}
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
