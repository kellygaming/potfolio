import Link from "next/link";
import { tousLesArticles } from "@/lib/articles";
import { CarteListe, CarteUne } from "@/components/Cartes";
import { Puces } from "@/components/Puces";
import { site } from "@/lib/site";

export default function Accueil() {
  const articles = tousLesArticles();
  const une = articles.find((a) => a.une) ?? articles[0];
  const reste = articles.filter((a) => a !== une);
  const recents = reste.slice(0, 4);
  const suite = reste.slice(4);

  return (
    <div className="conteneur">
      <section className="section">
        <h1 className="section__titre">Actualités</h1>
        <Puces />
        {une ? <CarteUne article={une} /> : <p>Aucun article pour l’instant.</p>}
        <ul className="liste grille-liste">
          {recents.map((a) => <CarteListe key={a.slug} article={a} />)}
        </ul>
      </section>

      {suite.length > 0 && (
        <>
          <div className="hachures" />
          <section>
            <h2 className="section__titre section__titre--centre">Toutes les publications</h2>
            <ul className="liste grille-liste">
              {suite.map((a) => <CarteListe key={a.slug} article={a} />)}
            </ul>
          </section>
        </>
      )}

      <div className="hachures" />
      <section className="encart" aria-labelledby="lettre">
        <h2 id="lettre">La Lettre</h2>
        <p>Recevez chaque semaine l’essentiel de nos actions et prises de position.</p>
        <div className="encart__actions">
          <a className="bouton" href={site.reseaux.whatsapp} target="_blank" rel="noopener">Rejoindre la chaîne WhatsApp</a>
          <Link className="bouton bouton--contour" href="/a-propos">En savoir plus</Link>
        </div>
      </section>
    </div>
  );
}
