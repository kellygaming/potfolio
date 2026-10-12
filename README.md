# Portfolio de Kelly — l'intelligence artificielle, maîtrisée

Créateur de sites web et de vidéos publicitaires — outils d'intelligence artificielle.

## Parcours de la page

1. **Hero** — film « Intelligence artificielle » (voix activable). En attendant le MP4
   /motionbykelly, une version animée en code (réseau neuronal canvas + GSAP) joue la même phrase.
2. **« Et je suis l'un des meilleurs »** — section épinglée : la phrase s'allume au défilement,
   la photo de Kelly se pose, puis les maîtrises (Claude, ChatGPT, vidéo IA, montage).
3. **L'IA de Kelly** — orbe animé + chat en direct, propulsé par DeepSeek (réponses en streaming).
4. **Projets** — TubAfrik, Sub Saharan Bio, Studio Voix, avec captures réelles des pages d'accueil.
5. **Présentation** — « Fan d'IA, je m'en suis inspiré… je suis prêt pour votre projet ».
6. **Fiche projet** — formulaire envoyé par e-mail (Resend).

## Stack

Next.js 16 (App Router) · TypeScript · GSAP ScrollTrigger · Lenis · CSS natif (jetons dans `app/globals.css`).
Contenu centralisé dans `lib/site.ts`.

## Démarrer

```bash
npm install
cp .env.example .env.local   # DEEPSEEK_API_KEY, RESEND_API_KEY, CONTACT_TO_EMAIL
npm run dev
```

## À fournir

| Fichier | Rôle |
|---|---|
| `public/images/kelly.jpg` | Portrait (format 4:5, ≥ 900 px de large). Sans lui, un monogramme s'affiche. |
| `public/audio/hero-voix.mp3` | Voix off du hero (sinon la voix du navigateur prend le relais). |
| `public/videos/hero.mp4` | Film /motionbykelly (voir `docs/film-hero/SCRIPT.md`). |

## Déploiement Vercel

Importer le dépôt, puis ajouter les variables `DEEPSEEK_API_KEY`, `RESEND_API_KEY`,
`CONTACT_TO_EMAIL` (et `CONTACT_FROM_EMAIL` une fois un domaine vérifié sur Resend).
