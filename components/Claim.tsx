"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { mastery, site } from "@/lib/site";

gsap.registerPlugin(ScrollTrigger);

const CLAIM = "Et je suis l'un des meilleurs";

/** Section épinglée : la phrase s'allume mot à mot au défilement, la photo de Kelly se pose dessous. */
export default function Claim() {
  const root = useRef<HTMLElement>(null);
  const [photoOk, setPhotoOk] = useState(true);
  const img = useRef<HTMLImageElement>(null);

  // L'image peut échouer avant l'hydratation (onError raté) : on vérifie après coup.
  useEffect(() => {
    const el = img.current;
    if (el && el.complete && el.naturalWidth === 0) setPhotoOk(false);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      const t = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 0.6 },
      });
      t.fromTo(".claim-photo", { scale: 1.35, opacity: 0, filter: "blur(16px)", y: 80 }, { scale: 1, opacity: 1, filter: "blur(0px)", y: 0, duration: 1.2, ease: "power3.out" }, 0);
      t.to(".claim-text .w", { opacity: 1, duration: 0.5, stagger: 0.25, ease: "none" }, 0.1);
      t.fromTo(".claim-id > *", { opacity: 0, y: 24 }, { opacity: 1, y: 0, stagger: 0.15, duration: 0.5 }, 1.1);
      t.to(".claim-text", { scale: 0.5, y: "-35vh", duration: 1, ease: "power2.inOut" }, 1.9);
      t.to(".claim-photo", { y: "3vh", scale: 0.92, duration: 1, ease: "power2.inOut" }, 1.9);
      t.fromTo(".chip", { opacity: 0, y: 30 }, { opacity: 1, y: 0, stagger: 0.12, duration: 0.4 }, 2.3);
      t.to({}, { duration: 0.6 });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="claim" id="kelly" aria-label="Qui est Kelly">
      <div className="claim-pin">
        <div className="claim-photo">
          {photoOk ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img ref={img} src={site.photo} alt={`Portrait de ${site.name}`} onError={() => setPhotoOk(false)} />
          ) : (
            <div className="ph" aria-hidden>
              K
            </div>
          )}
          <div className="claim-id">
            <strong>{site.name}</strong>
            <p>
              <b>{site.role}</b> — {site.roleTail}
            </p>
          </div>
        </div>

        <h2 className="claim-text">
          {CLAIM.split(" ").map((w, i) => (
            <span className="w" key={i}>
              {w}&nbsp;
            </span>
          ))}
        </h2>

        <ul className="claim-mastery" aria-label="Maîtrises">
          {mastery.map((m) => (
            <li className="chip" key={m.tool} title={m.what}>
              <i aria-hidden />
              <b>{m.tool}</b>
              <small>{m.level}</small>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
