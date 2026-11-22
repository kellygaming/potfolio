import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "À propos" };

export default function APropos() {
  return (
    <article className="conteneur article">
      <header className="article__entete">
        <h1 className="article__titre">À propos de {site.nom}</h1>
        <p className="article__chapo">{site.slogan}.</p>
      </header>
      <div className="prose">
        <p>
          Présentez ici le parcours, les valeurs et l’engagement de {site.nom} : origines,
          formation, expériences, et ce qui motive son action publique.
        </p>
        <h2>Nos priorités</h2>
        <ul>
          <li>Priorité n°1 — à compléter</li>
          <li>Priorité n°2 — à compléter</li>
          <li>Priorité n°3 — à compléter</li>
        </ul>
        <h2 id="rejoindre">Rejoindre l’équipe</h2>
        <p>
          Vous souhaitez participer ? Écrivez-nous sur{" "}
          <a href={site.reseaux.whatsapp} target="_blank" rel="noopener">WhatsApp</a> ou suivez-nous sur{" "}
          <a href={site.reseaux.facebook} target="_blank" rel="noopener">Facebook</a>.
        </p>
      </div>
    </article>
  );
}
