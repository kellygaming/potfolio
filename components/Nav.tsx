"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/site";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header className="nav" data-scrolled={scrolled}>
      <a href="#" className="nav-logo" aria-label={`${site.name}, accueil`}>
        <i aria-hidden /> {site.name}
      </a>
      <nav className="nav-links" aria-label="Sections">
        <a href="#kelly">Kelly</a>
        <a href="#ia">Mon IA</a>
        <a href="#projets">Projets</a>
        <a href="#apropos">À propos</a>
      </nav>
      <a href="#contact" className="btn btn-primary">
        Démarrer un projet
      </a>
    </header>
  );
}
