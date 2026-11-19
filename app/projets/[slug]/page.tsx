import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject } from "@/lib/projects";
import { projects, site } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = getProject((await params).slug);
  if (!p) return {};
  return {
    title: `${p.name} — ${p.title} · ${site.name}`,
    description: p.body,
    openGraph: { title: `${p.name} — projet de ${site.name}`, description: p.body, images: p.image ? [p.image] : ["/crimson/hero.webp"] },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();
  const i = projects.findIndex((x) => x.slug === slug);
  const next = projects[(i + 1) % projects.length];

  return (
    <main className="cr-root pj">
      <nav className="pj-nav" aria-label="Navigation">
        <Link className="logo" href="/">
          {site.brand}
        </Link>
        <Link className="btn" href="/#projets">
          ← Tous les projets
        </Link>
      </nav>

      <header className="pj-head">
        <p className="pj-kicker">
          Projet {String(i + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
        </p>
        <h1>{p.name}</h1>
        <p className="pj-title">{p.title}</p>
        <div className="tags pj-tags">
          {p.tags.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
      </header>

      <div className="pj-shot">
        {p.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.image} alt={`${p.name} — ${p.title}`} width={1600} height={910} />
        ) : (
          <div className="shot-ph" aria-hidden="true">
            <span>{p.name}</span>
            <small>{p.tags[0]}</small>
          </div>
        )}
      </div>

      <section className="pj-grid">
        <div>
          <h2 className="pj-h2">
            <em>Le</em> projet
          </h2>
          <p className="pj-lead">{p.body}</p>
          {p.points?.length ? (
            <ul className="pj-points">
              {p.points.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          ) : null}
        </div>
        <aside className="pj-side">
          {p.ai && (
            <div className="pj-card pj-ai">
              <h3>L&apos;IA dans ce projet</h3>
              <p>{p.ai}</p>
            </div>
          )}
          {p.stack?.length ? (
            <div className="pj-card">
              <h3>Outils</h3>
              <div className="tags">
                {p.stack.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            </div>
          ) : null}
          <div className="pj-links">
            {p.live && (
              <a className="btn btn-lg" href={p.live} target="_blank" rel="noopener noreferrer">
                Voir le site ↗
              </a>
            )}
            {p.repo && (
              <a className="pj-repo" href={p.repo} target="_blank" rel="noopener noreferrer">
                Voir le code ↗
              </a>
            )}
          </div>
        </aside>
      </section>

      <section className="pj-next">
        <Link href={`/projets/${next.slug}`}>
          <span>Projet suivant</span>
          <strong>{next.name} →</strong>
        </Link>
        <Link className="btn btn-lg" href="/#fiche">
          Un projet comme celui-ci ? Parlons-en
        </Link>
      </section>
    </main>
  );
}
