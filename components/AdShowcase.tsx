"use client";

import { useEffect, useRef, useState } from "react";

const DETAILS = [
  { k: "Format", v: "Pub de lancement SaaS · 16:9" },
  { k: "Durée", v: "22 secondes" },
  { k: "Fait par Kelly", v: "Script, motion design, montage, son" },
  { k: "Outils", v: "IA + montage" },
];

/** La pub « KELLY AI » : lecture muette en boucle quand elle est à l'écran, son au clic. */
export default function AdShowcase() {
  const video = useRef<HTMLVideoElement>(null);
  const [sound, setSound] = useState(false);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !reduce) v.play().catch(() => {});
        else if (!e.isIntersecting) v.pause();
      },
      { threshold: 0.35 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  const withSound = () => {
    const v = video.current;
    if (!v) return;
    v.currentTime = 0;
    v.muted = false;
    v.loop = false;
    v.controls = true;
    v.play().catch(() => {});
    setSound(true);
  };

  return (
    <section className="ad" id="video" aria-labelledby="video-title">
      <div className="wrap">
        <div className="projects-head">
          <div data-reveal>
            <span className="eyebrow">Vidéo publicitaire</span>
            <h2 className="section-title" id="video-title">
              Et je fais <em className="ai-text">bouger</em> les produits.
            </h2>
          </div>
          <p data-reveal="0.1">
            Une pub de lancement pour un SaaS, écrite, animée et montée par moi. Ce que je peux faire pour votre
            produit.
          </p>
        </div>

        <div className="ad-player" data-reveal>
          <video
            ref={video}
            src="/videos/pub-kelly-ai.mp4"
            poster="/videos/pub-kelly-ai.jpg"
            muted
            loop
            playsInline
            preload="metadata"
            aria-label="Publicité de lancement KELLY AI réalisée par Kelly"
          />
          {!sound && (
            <button className="btn btn-primary ad-sound" onClick={withSound}>
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M8 5v14l11-7z" />
              </svg>
              Regarder avec le son
            </button>
          )}
        </div>

        <dl className="ad-details">
          {DETAILS.map((d, i) => (
            <div key={d.k} data-reveal={i * 0.06}>
              <dt>{d.k}</dt>
              <dd>{d.v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
