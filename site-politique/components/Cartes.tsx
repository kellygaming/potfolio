import Link from "next/link";
import type { Article } from "@/lib/articles";
import { Couverture } from "./Couverture";

export function CarteUne({ article }: { article: Article }) {
  return (
    <article className="une">
      <Link href={`/articles/${article.slug}`} tabIndex={-1} aria-hidden>
        <Couverture src={article.image} alt={article.titre} priorite tailles="(max-width: 900px) 100vw, 700px" />
      </Link>
      <div>
        {article.etiquette && <span className="etiquette">{article.etiquette}</span>}
        <Link href={`/articles/${article.slug}`}>
          <h2 className="une__titre">{article.titre}</h2>
        </Link>
        {article.chapo && <p className="une__chapo">{article.chapo}</p>}
      </div>
    </article>
  );
}

export function CarteListe({ article }: { article: Article }) {
  return (
    <li className="carte">
      <Link href={`/articles/${article.slug}`} tabIndex={-1} aria-hidden>
        <Couverture src={article.image} alt="" tailles="(max-width: 900px) 40vw, 240px" />
      </Link>
      <div>
        <Link href={`/articles/${article.slug}`}>
          <h3 className="carte__titre">{article.titre}</h3>
        </Link>
        <Link href={`/rubrique/${article.rubriqueSlug}`} className="rubrique-lien">
          {article.rubrique}
        </Link>
      </div>
    </li>
  );
}
