# Kelly — Création web & IA

Portfolio en français : sites vitrines, boutiques et applications web pour l’Afrique francophone et l’international.

## Développement et vérification

Node.js 24 recommandé (version du projet Vercel).

- `npm ci`
- `npm run dev`
- `npm test` : validation du formulaire, corps JSON inattendus, limites, en-têtes et échappement HTML.
- `npm run typecheck`
- `npm run build`

Le contenu public est centralisé dans `lib/site.ts`. Les types de projet et la validation sont dans `lib/contact.ts`.

## Contact

WhatsApp : +225 01 73 50 76 82, confirmé par Kelly pour cette refonte.

Le formulaire utilise Resend. Copier `.env.example` dans `.env.local` puis définir `RESEND_API_KEY`, `CONTACT_TO_EMAIL` et, idéalement, `CONTACT_FROM_EMAIL` sur un domaine vérifié. La clé et le destinataire restent côté serveur. Si l’envoi échoue, la page propose WhatsApp et ne prétend pas que la demande a été reçue. L’adresse de test Resend ne livre qu’au propriétaire du compte.

## Page

Services, réalisations vérifiées, méthode, présentation, questions et contact. Les captures et le portrait sont conservés depuis le dépôt existant. Les animations utilisent l’API native du navigateur, sans masquer le contenu avant chargement et avec respect de la réduction des mouvements. Le défilement reste natif.

Référencement : métadonnées françaises, URL canonique, image de partage, favicon, sitemap, robots et données structurées Person. Aucune note, certification, statistique commerciale ou identité d’entreprise n’est inventée.

## Traçabilité

- `docs/content-audit.md` : sources et limites des affirmations.
- `docs/design-direction.md` : direction visuelle et décisions.
- `docs/verification.md` : vérifications et limites de livraison.

La version précédente utilisait un assistant généraliste et une longue introduction animée. La refonte privilégie la compréhension de l’offre et la prise de contact. Les dépendances historiques GSAP et Lenis restent verrouillées pour éviter une migration inutile, mais ne sont plus importées dans le portfolio.
