/** Toute l'identité du site au même endroit : à personnaliser. */
export const site = {
  nom: "Prénom Nom",
  slogan: "Agir pour notre commune, ensemble",
  description:
    "Actualités, prises de position et actions de terrain de Prénom Nom.",
  url: "https://exemple.vercel.app",
  // Rubriques affichées en puces (ordre d'affichage)
  rubriques: [
    "Vie politique",
    "Programme",
    "Terrain",
    "Économie",
    "Société",
    "Communiqués",
  ],
  reseaux: {
    facebook: "https://facebook.com/",
    x: "https://x.com/",
    whatsapp: "https://wa.me/",
  },
  // Bandeau d'appel en bas d'écran (façon « deux mois offerts »)
  appel: {
    texte: "Vous partagez ces idées ?",
    accent: "Rejoignez l'équipe",
    bouton: "Je m'engage",
    lien: "/a-propos#rejoindre",
  },
} as const;
