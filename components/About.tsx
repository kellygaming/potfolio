"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TEXT =
  "Fan d'intelligence artificielle, je m'en suis inspiré. J'ai travaillé, encore et encore. Aujourd'hui, je la maîtrise — et je suis prêt à travailler sur votre projet.";

const STEPS = [
  { k: "Inspiré", v: "Passionné d'IA depuis ses débuts" },
  { k: "Travaillé", v: "Des centaines d'heures de pratique" },
  { k: "Maîtrisé", v: "Claude, ChatGPT, vidéo IA, montage" },
  { k: "Prêt", v: "Pour votre site ou votre pub vidéo" },
];

export default function About() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.to(".about-text .w", {
        opacity: 1,
        stagger: 0.05,
        ease: "none",
        scrollTrigger: { trigger: ".about-text", start: "top 80%", end: "bottom 45%", scrub: 0.5 },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="about" id="apropos" aria-labelledby="apropos-title">
      <div className="wrap">
        <span className="eyebrow" data-reveal>
          Qui suis-je
        </span>
        <h2 id="apropos-title" className="sr-only">
          Présentation
        </h2>
        <p className="about-text" style={{ marginTop: 28 }}>
          {TEXT.split(" ").map((w, i) => (
            <span className={`w${/maîtrise|projet/.test(w) ? " ai-text" : ""}`} key={i}>
              {w}&nbsp;
            </span>
          ))}
        </p>
        <div className="about-steps">
          {STEPS.map((s, i) => (
            <div key={s.k} data-reveal={i * 0.08}>
              <b className={i === 3 ? "ai-text" : undefined}>{s.k}</b>
              <span>{s.v}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
