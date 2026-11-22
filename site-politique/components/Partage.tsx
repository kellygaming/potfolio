"use client";

import { useState } from "react";

export function Partage({ titre, url }: { titre: string; url: string }) {
  const [copie, setCopie] = useState(false);
  const t = encodeURIComponent(titre);
  const u = encodeURIComponent(url);
  return (
    <div className="partage">
      <span>Partager</span>
      <a href={`https://wa.me/?text=${t}%20${u}`} target="_blank" rel="noopener">WhatsApp</a>
      <a href={`https://www.facebook.com/sharer/sharer.php?u=${u}`} target="_blank" rel="noopener">Facebook</a>
      <a href={`https://x.com/intent/post?text=${t}&url=${u}`} target="_blank" rel="noopener">X</a>
      <button
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(url);
            setCopie(true);
            setTimeout(() => setCopie(false), 2000);
          } catch {}
        }}
      >
        {copie ? "Lien copié ✓" : "Copier le lien"}
      </button>
    </div>
  );
}
