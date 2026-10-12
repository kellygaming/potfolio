"use client";
import { useState } from "react";
import { site } from "@/lib/site";
import { Arrow } from "./Icons";
const links = [["#projets", "Réalisations"], ["#services", "Services"], ["#methode", "Méthode"], ["#apropos", "À propos"]] as const;
export default function Nav() {
  const [open, setOpen] = useState(false);
  return <header className="nav"><div className="wrap nav-inner">
    <a href="#accueil" className="nav-logo" aria-label="Kelly, accueil" onClick={() => setOpen(false)}>kelly<span aria-hidden="true">.</span><small>Création web & IA</small></a>
    <nav className="nav-links" aria-label="Navigation principale">{links.map(([href, label]) => <a key={href} href={href}>{label}</a>)}</nav>
    <a href="#contact" className="btn btn-dark nav-cta">Parlons de votre projet <Arrow diagonal /></a>
    <button className="menu-toggle" type="button" aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? "Fermer le menu" : "Ouvrir le menu"} onClick={() => setOpen(!open)} onKeyDown={e => { if (e.key === "Escape") setOpen(false); }}><span aria-hidden="true">{open ? "Fermer −" : "Menu +"}</span></button>
  </div><nav id="mobile-menu" className="mobile-menu" aria-label="Navigation mobile" hidden={!open} onKeyDown={e => { if (e.key === "Escape") setOpen(false); }}>{links.map(([href, label]) => <a key={href} href={href} onClick={() => setOpen(false)}>{label}<Arrow diagonal /></a>)}<a href="#contact" onClick={() => setOpen(false)}>Parlons de votre projet<Arrow diagonal /></a><a href={site.whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp<Arrow diagonal /></a></nav></header>;
}
