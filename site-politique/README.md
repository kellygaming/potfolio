# Site politique — actualités & prises de position

Site éditorial simple, inspiré de la mise en page d'un magazine d'actualité : titres en serif,
puces de rubriques, article à la une, liste avec vignettes, lecture confortable (colonne de 680 px,
corps 18–20 px, barre de progression, mode sombre automatique).

Next.js 16 · TypeScript · CSS natif (jetons dans `app/globals.css`) · articles en Markdown.

## Publier un article

1. **Option IA** : ouvrir `/atelier`, coller le texte brut → l'IA propose titre, chapô, intertitres,
   3 titres alternatifs et une idée de visuel. Relire, puis **Télécharger le .md**.
2. Déposer le fichier dans `content/articles/` (modèle : `content/articles/_MODELE.md`).
3. Mettre la photo dans `public/images/` et renseigner `image: "/images/nom.jpg"`.
4. Commit + push → Vercel redéploie automatiquement.

`une: true` place l'article à la une de l'accueil.

## Personnaliser

Tout est dans `lib/site.ts` : nom (logo bicolore prénom/nom), slogan, rubriques, réseaux,
texte du bandeau d'appel. La couleur d'accent se change via `--accent` dans `app/globals.css`.

## Démarrer

```bash
npm install
cp .env.example .env.local   # ANTHROPIC_API_KEY, ATELIER_PASSWORD
npm run dev
```

## Vercel

Importer le dépôt (si le site reste dans ce dossier : *Root Directory* = `site-politique`),
puis ajouter `ANTHROPIC_API_KEY` et `ATELIER_PASSWORD` dans les variables d'environnement.
Mettre à jour `site.url` dans `lib/site.ts` avec l'adresse finale.
