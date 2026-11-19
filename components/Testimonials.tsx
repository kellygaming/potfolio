"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { loopOffset } from "@/lib/motion";
import type { Testimonial } from "@/lib/site";

/** Avis clients : cartes qui glissent (défilement auto toutes les 6,5 s, flèches et points). */
export default function Testimonials({ items }: { items: Testimonial[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = items.length;

  useEffect(() => {
    if (paused || n < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setInterval(() => setActive((q) => (q + 1) % n), 6500);
    return () => window.clearInterval(t);
  }, [paused, n]);

  if (!n) return null;

  return (
    <section className="quotes" id="avis" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <header className="head">
        <h2 className="h2 h2-lg">
          Ce que disent <em>mes</em> clients
        </h2>
        <p>Leurs mots, une fois le projet livré</p>
      </header>

      <div className="qstage">
        {items.map((q, i) => {
          const d = loopOffset(i, active, n);
          return (
            <figure
              key={q.id}
              className="quote"
              data-c={d === 0 ? "" : undefined}
              data-far={Math.abs(d) > 1 ? "" : undefined}
              style={{ "--d": d } as CSSProperties}
              aria-hidden={d !== 0 || undefined}
            >
              <div className="qimg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={q.image} alt={q.name} loading="lazy" width={623} height={623} />
              </div>
              <div className="qbody">
                <blockquote className={q.pending ? "is-pending" : undefined}>
                  {q.pending ? "Le témoignage de ce client arrive très bientôt." : `« ${q.quote} »`}
                </blockquote>
                <figcaption>
                  <strong>{q.name}</strong>
                  <span>{q.role}</span>
                </figcaption>
                <span className="qmark" aria-hidden="true">
                  {q.mark ?? q.name.toUpperCase()}
                </span>
              </div>
            </figure>
          );
        })}
        {n > 1 && (
          <>
            <button className="arrow qprev" aria-label="Avis précédent" onClick={() => setActive((active - 1 + n) % n)}>
              ←
            </button>
            <button className="arrow qnext" aria-label="Avis suivant" onClick={() => setActive((active + 1) % n)}>
              →
            </button>
          </>
        )}
      </div>
      {n > 1 && (
        <div className="dotsbar" role="tablist" aria-label="Avis clients">
          {items.map((q, i) => (
            <button key={q.id} role="tab" aria-selected={i === active} aria-label={`Avis ${i + 1} : ${q.name}`} onClick={() => setActive(i)} />
          ))}
        </div>
      )}
    </section>
  );
}
