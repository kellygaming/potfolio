import Image from "next/image";
import { projects } from "@/lib/site";

const Arrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);

export default function Projects() {
  return (
    <section className="projects" id="projets" aria-labelledby="projets-title">
      <div className="wrap">
        <div className="projects-head">
          <div data-reveal>
            <span className="eyebrow">Projets en ligne</span>
            <h2 className="section-title" id="projets-title">
              Ce que j&apos;ai <em className="ai-text">construit</em>.
            </h2>
          </div>
          <p data-reveal="0.1">
            Trois produits réels, en production sur Vercel, conçus et développés avec l&apos;IA — du design au
            déploiement.
          </p>
        </div>

        {projects.map((p, i) => (
          <article className="project" key={p.slug} style={{ ["--brand" as string]: p.accent }}>
            <div className="project-media" data-reveal>
              {p.shot.kind === "desktop" ? (
                <>
                  <div className="browser">
                    <div className="browser-bar">
                      <i />
                      <i />
                      <i />
                      <span>{p.live.replace("https://", "")}</span>
                    </div>
                    <Image src={p.shot.src} alt={`Page d'accueil de ${p.name}`} width={1440} height={900} sizes="(max-width: 900px) 90vw, 640px" />
                  </div>
                  {p.mobile && (
                    <div className="phone">
                      <Image src={p.mobile} alt="" width={780} height={1688} sizes="160px" />
                    </div>
                  )}
                </>
              ) : (
                <div className="phone solo">
                  <Image src={p.shot.src} alt={`Écran d'accueil de ${p.name}`} width={780} height={1688} sizes="(max-width: 900px) 40vw, 240px" />
                </div>
              )}
            </div>

            <div className="project-body" data-reveal="0.1">
              <span className="num">0{i + 1} / 0{projects.length}</span>
              <h3>{p.name}</h3>
              <p className="tag">{p.tagline}</p>
              <p>{p.utility}</p>
              <ul>
                {p.points.map((pt) => (
                  <li key={pt}>{pt}</li>
                ))}
              </ul>
              <div className="stack">
                {p.stack.map((s) => (
                  <span key={s}>{s}</span>
                ))}
              </div>
              <div className="project-links">
                <a className="btn btn-primary" href={p.live} target="_blank" rel="noopener noreferrer">
                  Voir le site <Arrow />
                </a>
                <a className="btn" href={p.repo} target="_blank" rel="noopener noreferrer">
                  Code GitHub
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
