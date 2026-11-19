"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, MouseEvent, ReactNode } from "react";
import { clamp, countAt, easeOut, featuredFrame, journeyFrame, loopOffset, mix, seg, wordLevel } from "@/lib/motion";
import { hero, journey, manifesto, services, site, stats, tools, type Project } from "@/lib/site";
import AskAI from "./AskAI";
import ProjectForm from "./ProjectForm";

/*
 * Portfolio Kelly — direction artistique « Crimson Reach » (template MIT de Kedhareswer Naidu), réécrit en français.
 * Une main humaine et une main de machine se tendent sur une carte rouge ; le manifeste s'encre mot à mot ;
 * la dune se découpe en trois cartes ; services ; « Projets phares » qui rétrécit sur le carrousel ;
 * mur d'outils IA ; l'IA de Kelly ; contact + fiche projet ; carte finale.
 * Une seule boucle rAF par défilement écrit les transformations directement dans le DOM.
 */

const LOGO_STYLES = ["lg-serif", "lg-caps", "lg-mono", "lg-bold", "lg-script", "lg-wide", "lg-thin"];

function Roll({ children }: { children: ReactNode }) {
  return (
    <span className="roll">
      <span>{children}</span>
      <span aria-hidden="true">{children}</span>
    </span>
  );
}

function Laurel({ flip }: { flip?: boolean }) {
  return (
    <svg className="laurel" viewBox="0 0 20 44" aria-hidden="true" style={flip ? { transform: "scaleX(-1)" } : undefined}>
      <path d="M15 42C6 36 3 24 7 3" fill="none" stroke="currentColor" strokeWidth="1.2" />
      {[8, 15, 22, 29, 36].map((y, k) => (
        <ellipse
          key={k}
          cx={y > 30 ? 9 + (y - 30) / 3 : 5.6 + k * 0.2}
          cy={y}
          rx="3.2"
          ry="1.4"
          fill="currentColor"
          transform={`rotate(-38 ${6 + k * 0.4} ${y})`}
        />
      ))}
    </svg>
  );
}

function JourneyIcon({ kind }: { kind: string }) {
  const p = { fill: "none", stroke: "currentColor", strokeWidth: 1.3, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg className="jicon" viewBox="0 0 24 24" aria-hidden="true">
      {kind === "silver" && <path {...p} d="M12 2c.6 5 4 9.4 9 10-5 .6-8.4 5-9 10-.6-5-4-9.4-9-10 5-.6 8.4-5 9-10z" />}
      {kind === "red" && <path {...p} d="M3 17l6-6 4 4 8-8M15 7h6v6" />}
      {kind === "dark" && <path {...p} d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />}
    </svg>
  );
}

function Odometer({ value, digits }: { value: number; digits: number }) {
  const s = String(value).padStart(digits, "0");
  return (
    <span className="odo" aria-label={s}>
      {s.split("").map((d, i) => (
        <span key={i} className="odo-col" aria-hidden="true">
          <span style={{ transform: `translateY(${-Number(d) * 10}%)` }}>
            {"0123456789".split("").map((k) => (
              <span key={k}>{k}</span>
            ))}
          </span>
        </span>
      ))}
    </span>
  );
}

function Shot({ p }: { p: Project }) {
  if (p.image) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={p.image} alt={`${p.name} — ${p.title}`} loading="lazy" width={1280} height={728} />;
  }
  // Carte typographique en attendant la capture du projet.
  return (
    <div className="shot-ph" aria-hidden="true">
      <span>{p.name}</span>
      <small>{p.tags[0]}</small>
    </div>
  );
}

export default function Portfolio({ projects }: { projects: Project[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [work, setWork] = useState(0);
  const [counts, setCounts] = useState(() => stats.map(() => 0));
  const [clock, setClock] = useState("");
  const words = useMemo(() => manifesto.split(" "), []);
  const nW = projects.length;

  // horloge à l'heure d'Abidjan
  useEffect(() => {
    const f = () => {
      try {
        setClock(new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", timeZone: site.timeZone }));
      } catch {
        setClock("");
      }
    };
    f();
    const t = window.setInterval(f, 15000);
    return () => window.clearInterval(t);
  }, []);

  // la chorégraphie : une seule passe rAF par événement de défilement
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const $ = (s: string) => root.querySelector<HTMLElement>(s);
    const $$ = (s: string) => Array.from(root.querySelectorAll<HTMLElement>(s));
    const nav = $(".nav"),
      heroEl = $(".hero"),
      hands = $$(".hand"),
      manifestoEl = $(".manifesto"),
      wordEls = $$(".mword"),
      journeyEl = $(".journey"),
      jtitle = $(".jtitle"),
      panels = $$(".panel"),
      fronts = $$(".front"),
      flips = $$(".flip"),
      feat = $(".feat"),
      ftitle = $(".ftitle"),
      fcar = $(".fcar"),
      fsub = $(".fsub"),
      contact = $(".contact"),
      cta = $(".cta"),
      ctaImg = $(".cta-img"),
      ctaText = $(".cta-text");
    let raf = 0;
    let last = "";
    const tick = () => {
      raf = 0;
      const vh = window.innerHeight;
      const vw = root.clientWidth;
      const rootTop = root.getBoundingClientRect().top;
      if (nav && heroEl) {
        const pill = -rootTop > heroEl.offsetHeight * 0.72;
        nav.classList.toggle("is-pill", pill);
        nav.style.marginTop = pill ? "0px" : Math.min(0, rootTop) + "px";
      }
      if (heroEl && !reduced) {
        const s = clamp(-rootTop / heroEl.offsetHeight);
        hands.forEach((h, i) => (h.style.translate = `${(i ? 1 : -1) * 40 * s}px ${(i ? 1 : -1) * 60 * s}px`));
      }
      if (manifestoEl) {
        const r = manifestoEl.getBoundingClientRect();
        const rev = reduced ? 1 : clamp((vh * 0.25 - r.top) / (r.height - vh * 0.6));
        wordEls.forEach((w, i) => (w.style.opacity = String(0.26 + 0.74 * wordLevel(i, wordEls.length, rev))));
      }
      if (journeyEl) {
        const r = journeyEl.getBoundingClientRect();
        const p = -r.top / (r.height - vh);
        const f = journeyFrame(p, vw, vh, reduced);
        if (jtitle) jtitle.style.opacity = String(f.titleO);
        f.panels.forEach((q, i) => {
          const el = panels[i];
          if (!el) return;
          el.style.width = q.w + (q.cut < 0.02 ? 1 : 0) + "px";
          el.style.height = q.h + "px";
          el.style.transform = `translate(${q.x - q.w / 2}px,${q.y - q.h / 2}px) rotate(${q.rz}deg)`;
          if (flips[i]) flips[i].style.transform = `rotateY(${q.ry}deg)`;
          if (fronts[i]) {
            fronts[i].style.backgroundSize = `${f.F}px ${f.H0}px`;
            fronts[i].style.backgroundPosition = `${q.bgX}px 50%`;
            const rr = 10 * q.cut + "px";
            fronts[i].style.borderRadius = i === 0 ? `10px ${rr} ${rr} 10px` : i === 2 ? `${rr} 10px 10px ${rr}` : rr;
          }
        });
      }
      if (feat && ftitle && fcar) {
        const r = feat.getBoundingClientRect();
        const p = -r.top / (r.height - vh);
        const f = featuredFrame(p, vw < 760 ? 1.6 : 3.1, reduced);
        ftitle.style.transform = `translateY(${f.lift * (vh * 0.5 - 130)}px) scale(${f.scale})`;
        fcar.style.transform = `translateY(${f.carY * vh * 0.6}px)`;
        fcar.style.opacity = String(f.carO);
        if (fsub) fsub.style.opacity = String(f.subO);
      }
      if (contact) {
        const r = contact.getBoundingClientRect();
        const p = reduced ? 1 : clamp((vh - r.top) / (vh * 0.9));
        const next = stats.map((s) => countAt(s.n, p));
        const key = next.join(",") + (p > 0.35 ? "t" : "");
        if (key !== last) {
          last = key;
          setCounts(next);
          contact.classList.toggle("is-in", p > 0.35);
        }
      }
      if (cta && ctaImg && ctaText) {
        const r = cta.getBoundingClientRect();
        const p = reduced ? 1 : easeOut(clamp((vh - r.top) / (vh * 0.85)));
        cta.style.transform = `scale(${mix(0.9, 1, p)})`;
        cta.style.borderRadius = mix(40, 16, p) + "px";
        ctaImg.style.transform = `scale(${mix(1.18, 1, p)})`;
        ctaText.style.filter = `blur(${mix(14, 0, seg(p, 0.35, 1))}px)`;
        ctaText.style.opacity = String(mix(0, 1, seg(p, 0.3, 0.9)));
      }
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    tick();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      cancelAnimationFrame(raf);
    };
  }, []);

  const go = (id: string) => (e: MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    history.replaceState(null, "", `#${id}`);
  };

  // depuis le marquee : on descend au carrousel et on centre le projet choisi
  const showProject = (i: number) => (e: MouseEvent) => {
    setWork(i);
    go("projets")(e);
  };

  return (
    <div ref={rootRef} className="cr-root">
      <div className="navwrap">
        <nav className="nav" aria-label="Navigation principale">
          <a className="logo" href="#top" onClick={go("top")}>
            {site.brand}
          </a>
          <div className="links">
            <a href="#services" onClick={go("services")}>
              <Roll>Services</Roll>
            </a>
            <a href="#projets" onClick={go("projets")}>
              <Roll>Projets</Roll>
            </a>
            <a href="#ia" onClick={go("ia")}>
              <Roll>Mon IA</Roll>
            </a>
          </div>
          <a className="btn" href="#contact" onClick={go("contact")}>
            <Roll>Votre projet</Roll>
          </a>
        </nav>
      </div>

      {/* hero */}
      <section className="hero" id="top">
        <div className="hero-card">
          <div className="hero-art">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="hero-plate" src="/crimson/hero.webp" alt="" width={1536} height={1024} fetchPriority="high" />
            <span className="hero-glow" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="hand hand-top" src="/crimson/hand-top.webp" alt="" width={500} height={400} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="hand hand-bottom" src="/crimson/hand-bottom.webp" alt="" width={516} height={444} />
          </div>
          <div className="hero-copy">
            <h1>
              {hero.lines.map((line, l) => (
                <span key={l} className="line">
                  {line.split(" ").map((w, i) => (
                    <span key={i} className="in-word" style={{ animationDelay: 0.35 + (l * 3 + i) * 0.07 + "s" }}>
                      {w}{" "}
                    </span>
                  ))}
                </span>
              ))}
            </h1>
            <p className="in-word" style={{ animationDelay: "0.95s" }}>
              {hero.tail}
            </p>
          </div>
          <div className="hero-foot">
            <span suppressHydrationWarning>{clock || " "}</span>
            <span className="explore" aria-hidden="true">
              <span>Défilez pour découvrir</span>
              <span>Défilez pour découvrir</span>
            </span>
            <span>{site.zoneLabel}</span>
          </div>
        </div>
      </section>

      {/* manifeste + noms des projets qui défilent */}
      <section className="manifesto dots">
        <div className="mstage">
          <p className="mtext" aria-label={manifesto}>
            {words.map((w, i) => (
              <span key={i} className="mword" aria-hidden="true">
                {w}{" "}
              </span>
            ))}
          </p>
          <div className="trust">
            <div className="badge">
              <Laurel />
              <span>
                {projects.length} projets
                <br />
                phares
              </span>
              <Laurel flip />
            </div>
            <div className="marquee">
              <div className="mtrack">
                {[0, 1].map((k) => (
                  <div key={k} className="mset" aria-hidden={k === 1 || undefined}>
                    {[...projects, ...projects].map((p, i) => (
                      <a
                        key={i}
                        href="#projets"
                        tabIndex={k === 1 || i >= projects.length ? -1 : undefined}
                        className={"mlogo " + LOGO_STYLES[i % LOGO_STYLES.length]}
                        onClick={showProject(i % projects.length)}
                      >
                        {p.name}
                      </a>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* parcours */}
      <section className="journey dots">
        <div className="jstage">
          <h2 className="h2 jtitle">
            <em>Où</em> en est votre projet ?
          </h2>
          <div className="jcards">
            {journey.map((c, i) => (
              <div key={i} className="panel">
                <div className="flip">
                  <div className="face front" style={{ backgroundImage: "url(/crimson/dune.webp)" }} />
                  <div className={"face back tone-" + c.tone}>
                    <div className="back-in">
                      <JourneyIcon kind={c.tone} />
                      <h3>{c.title}</h3>
                      <p>{c.body}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* services */}
      <section className="services" id="services">
        <header className="head">
          <h2 className="h2 h2-lg">
            <em>Mes</em> services
          </h2>
          <p>L&apos;IA comme moteur, l&apos;œil humain comme garantie</p>
        </header>
        <div className="rows">
          {services.map((s, i) => (
            <article key={s.id} className="row">
              <div className="row-title">
                <span>({String(i + 1).padStart(2, "0")})</span>
                <h3>{s.title}</h3>
              </div>
              <ul>
                {s.items.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              <div className="row-img">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.image} alt={s.title.replace("\n", " ")} loading="lazy" width={762} height={506} />
              </div>
            </article>
          ))}
        </div>
        <a className="btn vision" href="#contact" onClick={go("contact")}>
          <Roll>Construisons votre projet</Roll>
        </a>
      </section>

      {/* projets phares */}
      <section className="feat" id="projets">
        <div className="fstage">
          <div className="fhead">
            <h2 className="ftitle">
              <em>Projets</em> phares
            </h2>
            <p className="fsub">Des idées audacieuses, devenues des outils qu&apos;on utilise</p>
          </div>
          <div className="fcar">
            <div className="ftrack">
              {projects.map((p, i) => {
                const d = loopOffset(i, work, nW);
                return (
                  <article
                    key={p.slug}
                    className="work"
                    data-d={Math.abs(d) > 1 ? "far" : d === 0 ? "c" : "s"}
                    style={{ "--d": d } as CSSProperties}
                    onClick={() => d !== 0 && setWork((((work + d) % nW) + nW) % nW)}
                    aria-hidden={d !== 0 || undefined}
                  >
                    <div className="work-img">
                      <Shot p={p} />
                    </div>
                    <h3>
                      <b>{p.name}</b> — {p.title}
                    </h3>
                    <p className="work-body">{p.body}</p>
                    <div className="tags">
                      {p.tags.map((t) => (
                        <span key={t}>{t}</span>
                      ))}
                      <span className="work-links">
                        {p.live && (
                          <a href={p.live} target="_blank" rel="noopener noreferrer" tabIndex={d === 0 ? undefined : -1}>
                            Voir le site ↗
                          </a>
                        )}
                        {p.repo && (
                          <a href={p.repo} target="_blank" rel="noopener noreferrer" tabIndex={d === 0 ? undefined : -1}>
                            Code ↗
                          </a>
                        )}
                      </span>
                    </div>
                  </article>
                );
              })}
              <button className="arrow prev" aria-label="Projet précédent" onClick={() => setWork((work - 1 + nW) % nW)}>
                ←
              </button>
              <button className="arrow next" aria-label="Projet suivant" onClick={() => setWork((work + 1) % nW)}>
                →
              </button>
            </div>
            <div className="dotsbar" role="tablist" aria-label="Projets">
              {projects.map((p, i) => (
                <button key={p.slug} role="tab" aria-selected={i === work} aria-label={p.name} onClick={() => setWork(i)} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* mur d'outils */}
      <section className="wall">
        <p className="wall-head">
          Les outils d&apos;intelligence artificielle
          <br />
          que je pilote au quotidien
        </p>
        <div className="grid">
          {tools.map((t, i) => (
            <span key={t} className={"tile " + LOGO_STYLES[(i * 3) % LOGO_STYLES.length]}>
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* l'IA de Kelly */}
      <AskAI />

      {/* contact */}
      <section className="contact" id="contact">
        <header className="head">
          <h2 className="h2 h2-lg">
            <em>Parlons</em> de votre projet
          </h2>
          <p>Un site, une vidéo publicitaire, un montage : je lis chaque demande personnellement</p>
        </header>
        <div className="cgrid">
          <div className="people">
            <div className="person">
              <span className="avatar">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={site.photo} alt={site.name} loading="lazy" width={623} height={623} />
              </span>
              <h3>{site.name}</h3>
              <p>Sites web · Vidéos IA</p>
              <div className="plinks">
                <a href={site.github} target="_blank" rel="noopener noreferrer">
                  ↗ GitHub
                </a>
                {site.email ? <a href={`mailto:${site.email}`}>✉ E-mail</a> : null}
              </div>
            </div>
            <div className="person">
              <span className="avatar avatar-k">K.</span>
              <h3>
                Dites
                <br />
                bonjour
              </h3>
              <p>Projets, collaborations, idées</p>
              <div className="plinks">
                <a href="#fiche" onClick={go("fiche")}>
                  ✎ Fiche projet
                </a>
                {site.whatsapp ? (
                  <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener noreferrer">
                    ◌ WhatsApp
                  </a>
                ) : (
                  <a href="#ia" onClick={go("ia")}>
                    ◌ Mon IA
                  </a>
                )}
              </div>
            </div>
          </div>
          <div className="stats">
            {stats.map((s, i) => (
              <div key={s.label} className="stat">
                <span className="num">
                  <Odometer value={counts[i]} digits={2} />
                </span>
                <div>
                  <h3>{s.label}</h3>
                  <p>{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <ProjectForm />
      </section>

      {/* carte finale */}
      <section className="ctawrap">
        <div className="cta">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="cta-img" src="/crimson/statue.webp" alt="" loading="lazy" width={1536} height={1024} />
          <span className="cta-tint" />
          <div className="cta-text">
            <p>Voilà mon histoire</p>
            <h2>
              <em>Réinventons</em> la vôtre
            </h2>
            <a className="btn" href="#fiche" onClick={go("fiche")}>
              <Roll>Démarrer un projet</Roll>
            </a>
          </div>
          <footer className="foot">
            <span>
              &copy; {new Date().getFullYear()} {site.name} · Tous droits réservés
            </span>
            <span className="flinks">
              <a href="#services" onClick={go("services")}>
                Services
              </a>
              <a href="#projets" onClick={go("projets")}>
                Projets
              </a>
              <a href={site.github} target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            </span>
          </footer>
        </div>
      </section>
    </div>
  );
}
