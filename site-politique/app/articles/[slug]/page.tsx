import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { articleParSlug, formaterDate, tousLesArticles } from "@/lib/articles";
import { CarteListe } from "@/components/Cartes";
import { Partage } from "@/components/Partage";
import { ProgressionLecture } from "@/components/ProgressionLecture";
import { site } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return tousLesArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const a = articleParSlug(slug);
  if (!a) return {};
  return {
    title: a.titre,
    description: a.chapo,
    openGraph: {
      type: "article",
      title: a.titre,
      description: a.chapo,
      publishedTime: a.date,
      images: a.image ? [a.image] : undefined,
    },
  };
}

export default async function PageArticle({ params }: Props) {
  const { slug } = await params;
  const a = articleParSlug(slug);
  if (!a) notFound();

  const aLire = tousLesArticles()
    .filter((x) => x.slug !== a.slug)
    .sort((x, y) => Number(y.rubrique === a.rubrique) - Number(x.rubrique === a.rubrique))
    .slice(0, 3);

  return (
    <>
      <ProgressionLecture />
      <article className="conteneur article">
        <header className="article__entete">
          <div className="article__fil">
            {a.etiquette && <span className="etiquette">{a.etiquette}</span>}
            <Link href={`/rubrique/${a.rubriqueSlug}`} className="rubrique-lien">{a.rubrique}</Link>
          </div>
          <h1 className="article__titre">{a.titre}</h1>
          {a.chapo && <p className="article__chapo">{a.chapo}</p>}
          <div className="article__meta">
            <span>Par <strong>{a.auteur}</strong></span>
            <time dateTime={a.date}>{formaterDate(a.date)}</time>
            <span>{a.minutes} min de lecture</span>
          </div>
        </header>

        {a.image && (
          <figure className="article__figure">
            <div className="couverture">
              <Image src={a.image} alt={a.legende ?? a.titre} fill priority sizes="(max-width: 960px) 100vw, 960px" />
            </div>
            {a.legende && <figcaption>{a.legende}</figcaption>}
          </figure>
        )}

        <div className="prose" dangerouslySetInnerHTML={{ __html: a.html }} />

        <div className="article__pied">
          <Partage titre={a.titre} url={`${site.url}/articles/${a.slug}`} />
        </div>
      </article>

      {aLire.length > 0 && (
        <div className="conteneur">
          <div className="hachures" />
          <h2 className="section__titre section__titre--centre">À lire aussi</h2>
          <ul className="liste grille-liste">
            {aLire.map((x) => <CarteListe key={x.slug} article={x} />)}
          </ul>
        </div>
      )}
    </>
  );
}
