// Informations publiques vérifiées ; voir docs/content-audit.md.
export const site = {
  name: "Kelly",
  role: "Créateur de sites web avec l’IA",
  url: "https://kelly-portfolio-gamma.vercel.app",
  github: "https://github.com/kellygaming",
  whatsapp: "https://wa.me/2250173507682?text=" + encodeURIComponent("Bonjour Kelly, je souhaite discuter de mon projet de site web."),
  phone: "+225 01 73 50 76 82",
  photo: "/images/kelly.jpg",
} as const;

export const services = [
  { name: "Sites vitrines", description: "Présentez votre activité, vos services et votre savoir-faire. Un site clair, pensé pour être consulté sur téléphone et faciliter les prises de contact.", details: "Entrepreneurs · Indépendants · Entreprises" },
  { name: "Boutiques en ligne", description: "Mettez vos produits en valeur et construisez un parcours de commande adapté à votre activité. Les moyens de paiement sont définis selon votre marché.", details: "Marques · Commerçants · Catalogues" },
  { name: "Applications web", description: "Transformez une idée en outil utile : espace utilisateur, plateforme de contenu ou service en ligne. Les fonctionnalités se construisent autour de vos besoins.", details: "Plateformes · Outils · Services numériques" },
] as const;

export { projectTypes } from "./contact";

export const projects = [
  { slug: "sub-saharian-bio", name: "Sub Saharan Bio", category: "Vitrine & catalogue", description: "Une identité visuelle dédiée aux soins naturels. Présentation des produits, catalogue et parcours de commande dans une expérience cohérente.", points: ["Catalogue de soins et pages produits", "Mise en scène des produits au défilement", "Navigation adaptée au mobile"], stack: ["Next.js", "TypeScript", "GSAP"], live: "https://sub-saharian-bio.vercel.app", repo: "https://github.com/kellygaming/Sub-Saharian-Bio", image: "/projets/sub-saharian-bio.webp", width: 1440, height: 900 },
  { slug: "studio-voix", name: "Studio Voix", category: "Application web · Audio", description: "Une interface pour enregistrer sa voix, la traiter et l’éditer à partir d’une transcription. Un projet qui relie expérience utilisateur et services d’IA.", points: ["Enregistrement dans le navigateur", "Éditeur avec transcription et forme d’onde", "Pipeline de traitement audio dans le dépôt"], stack: ["Next.js", "TypeScript", "FFmpeg"], live: "https://studio-voix.vercel.app", repo: "https://github.com/kellygaming/studio-voix", image: "/projets/studio-voix.webp", width: 1440, height: 900 },
  { slug: "tubafrik", name: "TubAfrik", category: "Plateforme · Vidéos courtes", description: "Une plateforme de vidéos courtes pour les créateurs africains. Un fil vertical, des profils et une navigation conçue pour le téléphone.", points: ["Fil de vidéos et catégories", "Profils de créateurs", "Interface mobile et partage"], stack: ["Next.js", "TypeScript", "Bunny Stream"], live: "https://www.tubafrik.com", repo: "https://github.com/kellygaming/TubAfrik", image: "/projets/tubafrik-mobile.webp", width: 780, height: 1688 },
] as const;

export const steps = [
  { title: "Comprendre votre besoin", text: "Votre activité, votre public, vos objectifs et vos contraintes. Nous définissons ensemble le périmètre, le budget et le calendrier." },
  { title: "Concevoir & construire", text: "Une direction visuelle, des contenus structurés et un développement assisté par l’IA. Vous voyez le projet prendre forme et partagez vos retours." },
  { title: "Tester & mettre en ligne", text: "Vérification du rendu sur mobile et ordinateur, des liens et des parcours essentiels. Puis mise en ligne et transmission des éléments convenus." },
] as const;

export const questions = [
  { question: "Quel est le rôle de l’IA dans votre travail ?", answer: "L’IA m’aide à explorer des idées, structurer le contenu et développer le site. Je garde la direction du projet et je vérifie le code, le rendu et les parcours. Les choix partent de votre besoin." },
  { question: "Travaillez-vous à distance ?", answer: "Oui. Le projet peut se construire à distance, avec des échanges en français sur WhatsApp et des liens de prévisualisation. Je m’adresse aux entreprises et entrepreneurs d’Afrique francophone comme à l’international." },
  { question: "Quel budget et quel délai prévoir ?", answer: "Ils dépendent des pages, des contenus et des fonctionnalités. Présentez-moi votre besoin : nous définirons le périmètre et les conditions avant de commencer." },
  { question: "Pouvez-vous refaire mon site existant ?", answer: "Oui. Nous pouvons repartir de vos contenus et de votre identité, puis revoir la structure, le design et l’expérience sur mobile. Les éléments à conserver sont définis ensemble." },
] as const;
