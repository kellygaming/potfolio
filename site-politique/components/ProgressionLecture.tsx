"use client";

import { useEffect, useRef } from "react";

/** Fine barre rouge en haut d'écran indiquant l'avancement de la lecture. */
export function ProgressionLecture() {
  const barre = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    const maj = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      barre.current?.style.setProperty("--p", String(max > 0 ? h.scrollTop / max : 0));
      raf = 0;
    };
    const surDefilement = () => { if (!raf) raf = requestAnimationFrame(maj); };
    maj();
    window.addEventListener("scroll", surDefilement, { passive: true });
    return () => window.removeEventListener("scroll", surDefilement);
  }, []);
  return <div ref={barre} className="progression" aria-hidden />;
}
