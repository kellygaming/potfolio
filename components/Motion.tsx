"use client";
import { useEffect } from "react";
/** Entrées légères ; le contenu reste visible sans JavaScript ni animation. */
export default function Motion() {
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (preference.matches || !("IntersectionObserver" in window)) return;
    const animations = new Set<Animation>();
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        if (preference.matches || !("animate" in entry.target)) continue;
        const animation = entry.target.animate([{ opacity: 0.65, transform: "translateY(14px)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 420, easing: "cubic-bezier(.2,.7,.2,1)" });
        animations.add(animation);
        animation.finished.then(() => animations.delete(animation)).catch(() => animations.delete(animation));
      }
    }, { threshold: 0.12 });
    document.querySelectorAll("[data-reveal]").forEach(el => observer.observe(el));
    const onPreference = () => { if (preference.matches) animations.forEach(animation => animation.cancel()); };
    preference.addEventListener("change", onPreference);
    return () => { observer.disconnect(); animations.forEach(animation => animation.cancel()); preference.removeEventListener("change", onPreference); };
  }, []);
  return null;
}
