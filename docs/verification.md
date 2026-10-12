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

## Résultats confirmés

Commit cf499034 : 6 tests réussis, TypeScript strict réussi et build Next.js réussi sur Vercel (déploiement dpl_3pzCat1XugkjDoTq4FQQW84zpV2F).

Navigateur : rendus contrôlés à 1440, 768, 390 et 360 px, sans débordement horizontal. Les 7 images se chargent après défilement. Menu mobile, fermeture au choix d’une section, FAQ et ancres contrôlés. Le navigateur bloque un e-mail invalide et un message manquant sans envoyer de demande. Tous les liens WhatsApp pointent vers le numéro confirmé.

Derniers ajustements : suppression du double espacement des ancres et retour du focus au bouton de menu après Échap.
