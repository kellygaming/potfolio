import Link from "next/link";

export default function Introuvable() {
  return (
    <div className="conteneur article">
      <div className="article__entete">
        <h1 className="article__titre">Page introuvable</h1>
        <p className="article__chapo">Cet article n’existe pas ou a été déplacé.</p>
        <Link href="/" className="bouton">Retour à l’accueil</Link>
      </div>
    </div>
  );
}
