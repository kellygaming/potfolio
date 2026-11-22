"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { site } from "@/lib/site";

const CLE = "bandeau-appel-ferme";

export function BandeauAppel() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(CLE)) setVisible(false);
    } catch {}
  }, []);

  useEffect(() => {
    document.body.classList.toggle("avec-appel", visible);
  }, [visible]);

  if (!visible) return null;

  return (
    <aside className="appel" aria-label="Appel à l'engagement">
      <button
        className="appel__fermer"
        aria-label="Fermer"
        onClick={() => {
          setVisible(false);
          try { sessionStorage.setItem(CLE, "1"); } catch {}
        }}
      >
        ×
      </button>
      <p>
        {site.appel.texte} <strong>{site.appel.accent}</strong>
      </p>
      <Link href={site.appel.lien} className="bouton">{site.appel.bouton}</Link>
    </aside>
  );
}
