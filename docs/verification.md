# Vérification de la refonte

## Avant livraison

- Tests du formulaire : demande valide internationale, corps JSON inattendus, formats, longueur, injection d’en-tête, pot de miel et échappement HTML.
- TypeScript strict et compilation Next.js.
- Rendu desktop et mobile, navigation, ancres, FAQ, validation native du formulaire, liens WhatsApp et GitHub.
- Metadonnées, image de partage, robots et sitemap.

## Limites

Aucun message de test réel n’est envoyé à Kelly. La livraison Resend dépend de la configuration du compte et du domaine expéditeur ; les chemins de validation et d’échec sont contrôlés, mais la réception dans la boîte mail n’est pas déclarée testée.

Les réalisations externes sont vérifiées sur leur page publique et dans le code. Leurs paiements, comptes, stockage, traitements audio et services externes ne sont pas testés de bout en bout dans le cadre de cette refonte.

L’exécution du terminal local a été refusée par Windows (erreur antivirus 225). Les contrôles de compilation et les tests sont donc exécutés dans le build Vercel du commit de la branche de refonte.
