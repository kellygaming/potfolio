"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { heroCues, heroFinal, heroLines, heroSignature, heroSpoken, site } from "@/lib/site";

/* ------------------------------------------------------------------ */
/* Réseau neuronal en fond : des points reliés qui dérivent, puis      */
/* convergent et explosent au moment où « INTELLIGENCE ARTIFICIELLE »   */
/* apparaît.                                                           */
/* ------------------------------------------------------------------ */

type NeuralApi = { burst: () => void; converge: () => void; release: () => void };

function useNeuralCanvas(ref: React.RefObject<HTMLCanvasElement | null>) {
  const api = useRef<NeuralApi>({ burst() {}, converge() {}, release() {} });

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0,
      h = 0,
      dpr = 1,
      raf = 0,
      visible = true;
    let pull = 0; // 0 = dérive libre, 1 = aspiré au centre
    let energy = 0; // éclat après l'explosion
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };

    type P = { x: number; y: number; vx: number; vy: number; r: number; hue: number };
    let pts: P[] = [];

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(Math.min(130, (w * h) / 14000));
      pts = Array.from({ length: n }, (_, i) => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: 0.8 + Math.random() * 1.6,
        hue: i / n,
      }));
    };

    // Réseau couleur crème ; un point sur sept brille en braise.
    const color = (t: number, a: number) =>
      Math.round(t * 1000) % 7 === 0 ? `rgba(255,91,31,${a})` : `rgba(242,237,228,${a * 0.75})`;

    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (!visible) return;
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;
      energy *= 0.965;
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2 + mouse.x * 30,
        cy = h / 2 + mouse.y * 30;
      const link = Math.min(170, w / 7);

      for (const p of pts) {
        if (pull > 0) {
          p.vx += (cx - p.x) * 0.0009 * pull;
          p.vy += (cy - p.y) * 0.0009 * pull;
          p.vx *= 0.94;
          p.vy *= 0.94;
        }
        p.x += p.vx * (1 + energy * 6);
        p.y += p.vy * (1 + energy * 6);
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;
      }

      ctx.lineWidth = 0.6;
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i];
        for (let j = i + 1; j < pts.length; j++) {
          const b = pts[j];
          const dx = a.x - b.x,
            dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < link * link) {
            const o = (1 - Math.sqrt(d2) / link) * (0.22 + energy * 0.5);
            ctx.strokeStyle = color((a.hue + b.hue) / 2, o);
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      for (const p of pts) {
        ctx.fillStyle = color(p.hue, 0.55 + energy * 0.45);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * (1 + energy), 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const onMove = (e: PointerEvent) => {
      mouse.tx = e.clientX / w - 0.5;
      mouse.ty = e.clientY / h - 0.5;
    };
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    if (!reduce) frame();
    else {
      visible = true;
      frame();
      cancelAnimationFrame(raf);
    }

    api.current = {
      converge: () => gsap.to({ v: pull }, { v: 1, duration: 1.2, ease: "power2.in", onUpdate() { pull = this.targets()[0].v; } }),
      burst: () => {
        pull = 0;
        energy = 1;
        for (const p of pts) {
          const dx = p.x - w / 2,
            dy = p.y - h / 2;
          const d = Math.hypot(dx, dy) || 1;
          const s = 4 + Math.random() * 6;
          p.vx = (dx / d) * s;
          p.vy = (dy / d) * s;
        }
        // retombe ensuite à une dérive lente
        gsap.delayedCall(1.4, () => {
          for (const p of pts) {
            p.vx = (Math.random() - 0.5) * 0.3;
            p.vy = (Math.random() - 0.5) * 0.3;
          }
        });
      },
      release: () => {
        pull = 0;
      },
    };

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, [ref]);

  return api;
}

/* ------------------------------------------------------------------ */
/* Voix : le MP3 de Kelly s'il existe, sinon la voix du navigateur.     */
/* ------------------------------------------------------------------ */

async function startVoice(): Promise<() => void> {
  const audio = new Audio(site.heroVoice);
  const ok = await new Promise<boolean>((resolve) => {
    const t = setTimeout(() => resolve(false), 1500);
    audio.addEventListener("canplaythrough", () => (clearTimeout(t), resolve(true)), { once: true });
    audio.addEventListener("error", () => (clearTimeout(t), resolve(false)), { once: true });
    audio.load();
  });
  if (ok) {
    await audio.play().catch(() => {});
    return () => audio.pause();
  }
  if ("speechSynthesis" in window) {
    const u = new SpeechSynthesisUtterance(heroSpoken);
    u.lang = "fr-FR";
    u.rate = 0.92;
    u.pitch = 0.9;
    const voice = speechSynthesis.getVoices().find((v) => v.lang.startsWith("fr"));
    if (voice) u.voice = voice;
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
    return () => speechSynthesis.cancel();
  }
  return () => {};
}

/* ------------------------------------------------------------------ */

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const film = useRef<HTMLVideoElement>(null);
  const neural = useNeuralCanvas(canvas);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const stopVoice = useRef<() => void>(() => {});
  const [voiceOn, setVoiceOn] = useState(false);

  const build = useCallback((delay = 0.4, paused = false) => {
    const el = root.current!;
    tl.current?.kill();
    const q = gsap.utils.selector(el);
    const lines = q(".hero-line");
    const finalWords = q(".hero-final .hf");
    const stage = q(".hero-stage");

    gsap.set(lines, { opacity: 0 });
    gsap.set(q(".hero-line .w"), { opacity: 0, scale: 1.25, filter: "blur(14px)", y: 0 });
    gsap.set(q(".hero-final"), { opacity: 0 });
    gsap.set(finalWords, { opacity: 0, scale: 3, filter: "blur(18px)" });
    gsap.set(q(".hero-sub"), { opacity: 0, y: 16 });
    gsap.set(q(".hero-flash"), { opacity: 0 });
    gsap.set(stage, { scale: 1 });

    const t = gsap.timeline({ delay, paused });
    const lead = 0.06; // chaque mot arrive juste avant d'être prononcé
    // Poussée de caméra continue jusqu'au titre.
    t.to(stage, { scale: 1.08, duration: heroCues.final[0], ease: "none" }, 0);

    lines.forEach((line, i) => {
      const words = line.querySelectorAll(".w");
      t.set(line, { opacity: 1 }, Math.max(0, heroCues.lines[i][0] - lead));
      words.forEach((w, k) => {
        const at = Math.max(0, (heroCues.lines[i][k] ?? heroCues.lines[i].at(-1)!) - lead);
        t.to(w, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.45, ease: "expo.out" }, at);
      });
      t.to(words, { opacity: 0, y: -30, filter: "blur(10px)", duration: 0.2, ease: "power3.in", stagger: 0.02 }, heroCues.lineOut[i]);
    });

    // Aspiration au centre pendant « d'incroyable », puis explosion → titre.
    const at = heroCues.final[0] - lead;
    t.call(() => neural.current.converge(), [], at - 1.2);
    t.set(stage, { scale: 1 }, at);
    t.to(q(".hero-flash"), { opacity: 0.9, duration: 0.08, ease: "none" }, at);
    t.call(() => neural.current.burst(), [], at + 0.05);
    t.to(q(".hero-flash"), { opacity: 0, duration: 0.6, ease: "power2.out" }, at + 0.08);
    t.set(q(".hero-final"), { opacity: 1 }, at);
    finalWords.forEach((w, k) => {
      t.to(w, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.7, ease: "expo.out" }, heroCues.final[k] - lead);
    });
    t.to(q(".hero-sub"), { opacity: 1, y: 0, duration: 0.9, ease: "expo.out" }, heroCues.signature - 0.1);
    // Respiration lente du titre (couche vivante).
    t.to(q(".hero-final"), { scale: 1.03, duration: 4, ease: "sine.inOut", yoyo: true, repeat: 5 }, at + 0.8);

    tl.current = t;
  }, [neural]);

  useEffect(() => {
    if (site.heroFilm) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      build();
      if (reduce) tl.current?.progress(1);
    }, root);
    return () => {
      ctx.revert();
      stopVoice.current();
    };
  }, [build]);

  const playWithVoice = async () => {
    if (site.heroFilm && film.current) {
      film.current.currentTime = 0;
      film.current.muted = false;
      await film.current.play().catch(() => {});
      setVoiceOn(true);
      return;
    }
    stopVoice.current();
    build(0, true);
    setVoiceOn(true);
    stopVoice.current = await startVoice();
    tl.current?.play(0);
  };

  const replay = () => {
    if (site.heroFilm && film.current) {
      film.current.currentTime = 0;
      film.current.play().catch(() => {});
      return;
    }
    stopVoice.current();
    setVoiceOn(false);
    build();
  };

  return (
    <section ref={root} className="hero" aria-label="Introduction">
      {site.heroFilm ? (
        <video
          ref={film}
          className="hero-film"
          src={site.heroFilm.src}
          poster={site.heroFilm.poster}
          autoPlay
          muted
          playsInline
          preload="auto"
        />
      ) : (
        <canvas ref={canvas} className="hero-canvas" aria-hidden />
      )}
      <div className="hero-vignette" aria-hidden />
      <div
        className="hero-flash"
        aria-hidden
        style={{ position: "absolute", inset: 0, background: "radial-gradient(circle, #fff3e8, #ff5b1f 40%, transparent 75%)", opacity: 0, pointerEvents: "none" }}
      />

      {!site.heroFilm && (
        <div className="hero-stage">
          {heroLines.map((line) => (
            <p className="hero-line" key={line} aria-hidden>
              {line.split(" ").map((w, i) => (
                <span className="w" key={i}>
                  {w}&nbsp;
                </span>
              ))}
            </p>
          ))}
          <h1 className="hero-final">
            <span className="sr-only">{heroLines.join(" ")} </span>
            {heroFinal.map((w, i) => (
              <span key={w} className={`hf hf-${i + 1}`}>
                {w}
              </span>
            ))}
          </h1>
          <p className="hero-sub">
            <span className="hero-sign">{heroSignature}</span>
            {site.name} — {site.role}, {site.roleTail}.
          </p>
        </div>
      )}

      <div className="hero-controls">
        <button className="btn" onClick={playWithVoice} aria-pressed={voiceOn}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M11 5 6 9H2v6h4l5 4V5Z" />
            <path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14" />
          </svg>
          {voiceOn ? "Voix activée" : "Activer la voix"}
        </button>
        <button className="btn" onClick={replay} aria-label="Rejouer l'introduction">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
            <path d="M3 3v5h5" />
          </svg>
          Rejouer
        </button>
      </div>
      <div className="hero-scroll" aria-hidden>
        Défiler <i />
      </div>
    </section>
  );
}
