"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";
import { site } from "@/lib/site";
import { slugify } from "@/lib/slug";

export function Entete() {
  const [ouvert, setOuvert] = useState(false);
  const chemin = usePathname();

  useEffect(() => setOuvert(false), [chemin]);
  useEffect(() => {
    if (!ouvert) return;
    const echap = (e: KeyboardEvent) => e.key === "Escape" && setOuvert(false);
    document.addEventListener("keydown", echap);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", echap);
      document.body.style.overflow = "";
    };
  }, [ouvert]);

  return (
    <header className="entete">
      <div className="conteneur entete__barre">
        <button
          className="entete__menu"
          aria-label="Ouvrir le menu"
          aria-expanded={ouvert}
          onClick={() => setOuvert(true)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
            <path d="M4 6h10M4 12h7M4 18h10" />
            <circle cx="17.5" cy="13.5" r="3" />
            <path d="m19.7 15.7 2 2" />
          </svg>
        </button>
        <Logo />
        <nav className="entete__nav" aria-label="Rubriques">
          {site.rubriques.slice(0, 4).map((r) => (
            <Link key={r} href={`/rubrique/${slugify(r)}`}>{r}</Link>
          ))}
        </nav>
        <Link href={site.appel.lien} className="bouton entete__cta">
          {site.appel.bouton}
        </Link>
      </div>

      <div className="tiroir" data-ouvert={ouvert} onClick={() => setOuvert(false)} aria-hidden={!ouvert}>
        <nav className="tiroir__panneau" aria-label="Menu" onClick={(e) => e.stopPropagation()}>
          <Logo />
          <p className="tiroir__titre">Rubriques</p>
          <div className="tiroir__liens">
            {site.rubriques.map((r) => (
              <Link key={r} href={`/rubrique/${slugify(r)}`}>{r}</Link>
            ))}
          </div>
          <p className="tiroir__titre">Le site</p>
          <div className="tiroir__liens">
            <Link href="/">Accueil</Link>
            <Link href="/a-propos">À propos</Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
