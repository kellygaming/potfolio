# Portfolio de Kelly — là où une idée rencontre l'IA

Créateur de sites web et de vidéos publicitaires avec l'intelligence artificielle.
Direction artistique inspirée du template **Crimson Reach** (MIT, Kedhareswer Naidu), réécrite en français.

## Parcours de la page

1. **Hero** — carte rouge, deux mains qui se tendent (l'humain et la machine).
2. **Manifeste** — s'encre mot à mot ; dessous, **les noms des 4 projets phares défilent** (cliquables).
3. **« Où en est votre projet ? »** — la dune se découpe en trois cartes qui se retournent.
4. **Services** — Sites web, Applications IA, Vidéos publicitaires IA, Montage & motion design.
5. **Projets phares** — grand titre qui rétrécit sur le carrousel (Desby & Fils, Delta Sécurité, FFMF, Motion.ai).
6. **Mur d'outils IA** — Claude, ChatGPT, fal.ai, ElevenLabs…
7. **Mon IA** — assistant DeepSeek en streaming (`/api/chat`).
8. **Contact** — cartes, compteurs, fiche projet (`/api/contact` → Telegram, puis e-mail Resend).
9. **Carte finale** — « Réinventons la vôtre ».

## Modifier le contenu

Tout est dans `lib/site.ts` : textes, services, projets, outils, compteurs, prompt de l'assistant.

## Images des projets

Déposer une capture par projet (16:9, ≥ 1200 px, l'en-tête du site en haut) :

| Fichier | Projet |
|---|---|
| `public/projets/desby-fils.webp` | Desby & Fils |
| `public/projets/delta-securite.webp` | Delta Sécurité |
| `public/projets/ffmf.webp` | FFMF |
| `public/projets/motion-ai.webp` | Motion.ai |

`.jpg` et `.png` marchent aussi. Sans fichier, une carte typographique rouge s'affiche — aucune ligne de code à toucher.

## Stack

Next.js 16 (App Router) · TypeScript · CSS natif (`app/globals.css`) · chorégraphie au défilement en `requestAnimationFrame` (`lib/motion.ts`).

## Démarrer

```bash
npm install
cp .env.example .env.local   # DEEPSEEK_API_KEY, TELEGRAM_ALERT_TOKEN, TELEGRAM_ALERT_CHAT_ID…
npm run dev
```
