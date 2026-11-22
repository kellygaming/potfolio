"use client";

import { useEffect, useMemo, useState } from "react";
import { marked } from "marked";
import type { ResultatClarifier } from "@/app/api/clarifier/route";
import { site } from "@/lib/site";
import { slugify } from "@/lib/slug";

const CLE_MDP = "atelier-mdp";

function fichierMarkdown(r: ResultatClarifier, titre: string, image: string) {
  const date = new Date().toISOString().slice(0, 10);
  const echapper = (s: string) => JSON.stringify(s);
  return [
    "---",
    `titre: ${echapper(titre)}`,
    `chapo: ${echapper(r.chapo)}`,
    `date: ${date}`,
    `rubrique: ${echapper(r.rubrique)}`,
    r.etiquette ? `etiquette: ${echapper(r.etiquette)}` : null,
    image ? `image: ${echapper(image)}` : `# image: "/images/${slugify(titre).slice(0, 40)}.jpg"`,
    `auteur: ${echapper(site.nom)}`,
    "une: false",
    "---",
    "",
    r.corps.trim(),
    "",
  ]
    .filter((l) => l !== null)
    .join("\n");
}

export function Atelier() {
  const [motDePasse, setMotDePasse] = useState("");
  const [texte, setTexte] = useState("");
  const [rubrique, setRubrique] = useState("");
  const [consigne, setConsigne] = useState("");
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState("");
  const [resultat, setResultat] = useState<ResultatClarifier | null>(null);
  const [titre, setTitre] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    try { setMotDePasse(sessionStorage.getItem(CLE_MDP) ?? ""); } catch {}
  }, []);

  async function clarifier(e: React.FormEvent) {
    e.preventDefault();
    setEnCours(true);
    setErreur("");
    try {
      try { sessionStorage.setItem(CLE_MDP, motDePasse); } catch {}
      const rep = await fetch("/api/clarifier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ motDePasse, texte, rubrique: rubrique || undefined, consigne: consigne || undefined }),
      });
      const donnees = await rep.json();
      if (!rep.ok) throw new Error(donnees.erreur ?? "Erreur inconnue.");
      setResultat(donnees);
      setTitre(donnees.titre);
    } catch (err) {
      setErreur(err instanceof Error ? err.message : "Erreur réseau.");
    } finally {
      setEnCours(false);
    }
  }

  const md = useMemo(() => (resultat ? fichierMarkdown(resultat, titre, image) : ""), [resultat, titre, image]);
  const nomFichier = `${slugify(titre).slice(0, 60) || "article"}.md`;

  function telecharger() {
    const url = URL.createObjectURL(new Blob([md], { type: "text/markdown;charset=utf-8" }));
    const a = Object.assign(document.createElement("a"), { href: url, download: nomFichier });
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="atelier">
      <h1>Atelier de rédaction</h1>
      <p className="atelier__intro">
        Collez un texte brut (discours, notes, message WhatsApp…). L’IA propose un titre, un chapô
        et un corps clair, sans changer le fond. Vous relisez, puis vous téléchargez le fichier
        à déposer dans <code>content/articles/</code>.
      </p>

      <form onSubmit={clarifier}>
        <div className="rangee">
          <div className="champ">
            <label htmlFor="mdp">Mot de passe de l’équipe</label>
            <input id="mdp" type="password" value={motDePasse} onChange={(e) => setMotDePasse(e.target.value)} required autoComplete="current-password" />
          </div>
          <div className="champ">
            <label htmlFor="rubrique">Rubrique (facultatif)</label>
            <select id="rubrique" value={rubrique} onChange={(e) => setRubrique(e.target.value)}>
              <option value="">Laisser l’IA choisir</option>
              {site.rubriques.map((r) => <option key={r}>{r}</option>)}
            </select>
          </div>
        </div>
        <div className="champ">
          <label htmlFor="texte">Texte brut</label>
          <textarea id="texte" value={texte} onChange={(e) => setTexte(e.target.value)} required minLength={40} placeholder="Collez votre texte ici…" />
          <small>{texte.split(/\s+/).filter(Boolean).length} mots</small>
        </div>
        <div className="champ">
          <label htmlFor="consigne">Consigne (facultatif)</label>
          <input id="consigne" value={consigne} onChange={(e) => setConsigne(e.target.value)} placeholder="Ex. : ton plus combatif, garder la citation finale…" />
        </div>
        <button className="bouton" disabled={enCours}>
          {enCours ? "Clarification en cours…" : "Clarifier avec l’IA"}
        </button>
        {erreur && <p className="erreur" role="alert">{erreur}</p>}
      </form>

      {resultat && (
        <section className="resultat" aria-live="polite">
          <div className="resultat__bloc champ">
            <label htmlFor="titre">Titre retenu (modifiable)</label>
            <input id="titre" value={titre} onChange={(e) => setTitre(e.target.value)} />
          </div>
          <div className="resultat__bloc">
            <h2>Autres titres possibles</h2>
            <ol className="alternatives">
              {resultat.titresAlternatifs.map((t) => (
                <li key={t}>
                  {t}
                  <button type="button" onClick={() => setTitre(t)}>utiliser</button>
                </li>
              ))}
            </ol>
          </div>
          <div className="resultat__bloc">
            <h2>Idée de visuel</h2>
            <p>{resultat.ideeImage}</p>
            <div className="champ">
              <label htmlFor="image">Chemin de la photo (après l’avoir mise dans public/images/)</label>
              <input id="image" value={image} onChange={(e) => setImage(e.target.value)} placeholder="/images/ma-photo.jpg" />
            </div>
          </div>
          <div className="resultat__bloc">
            <h2>Aperçu</h2>
            <div className="apercu">
              {resultat.etiquette && <span className="etiquette">{resultat.etiquette}</span>}
              <p className="rubrique-lien">{resultat.rubrique}</p>
              <h3 className="article__titre">{titre}</h3>
              <p className="article__chapo">{resultat.chapo}</p>
              <div className="prose" dangerouslySetInnerHTML={{ __html: marked.parse(resultat.corps, { async: false }) }} />
            </div>
          </div>
          <div className="resultat__bloc">
            <h2>Fichier prêt à publier — {nomFichier}</h2>
            <div className="encart__actions" style={{ marginBottom: 12 }}>
              <button type="button" className="bouton" onClick={telecharger}>Télécharger le .md</button>
              <button type="button" className="bouton bouton--contour" onClick={() => navigator.clipboard.writeText(md).catch(() => {})}>Copier</button>
            </div>
            <pre className="code">{md}</pre>
          </div>
        </section>
      )}
    </div>
  );
}
