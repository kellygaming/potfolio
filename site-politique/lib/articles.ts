import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import { slugify } from "./slug";

const DOSSIER = path.join(process.cwd(), "content", "articles");

export type Article = {
  slug: string;
  titre: string;
  chapo: string;
  date: string; // ISO AAAA-MM-JJ
  rubrique: string;
  rubriqueSlug: string;
  image?: string;
  legende?: string;
  etiquette?: string; // badge rouge, ex. « Décryptage »
  auteur: string;
  une: boolean;
  minutes: number;
};

export type ArticleComplet = Article & { html: string };

function lireFichier(fichier: string): ArticleComplet {
  const brut = fs.readFileSync(path.join(DOSSIER, fichier), "utf8");
  const { data, content } = matter(brut);
  const slug = fichier.replace(/\.md$/, "");
  const rubrique = String(data.rubrique ?? "Vie politique");
  const mots = content.split(/\s+/).filter(Boolean).length;
  const date =
    data.date instanceof Date
      ? data.date.toISOString().slice(0, 10)
      : String(data.date ?? "");

  return {
    slug,
    titre: String(data.titre ?? slug),
    chapo: String(data.chapo ?? ""),
    date,
    rubrique,
    rubriqueSlug: slugify(rubrique),
    image: data.image ? String(data.image) : undefined,
    legende: data.legende ? String(data.legende) : undefined,
    etiquette: data.etiquette ? String(data.etiquette) : undefined,
    auteur: String(data.auteur ?? "La rédaction"),
    une: Boolean(data.une),
    minutes: Math.max(1, Math.round(mots / 220)),
    html: marked.parse(content, { async: false }),
  };
}

/** Tous les articles, du plus récent au plus ancien. */
export function tousLesArticles(): ArticleComplet[] {
  if (!fs.existsSync(DOSSIER)) return [];
  return fs
    .readdirSync(DOSSIER)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
    .map(lireFichier)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function articleParSlug(slug: string): ArticleComplet | undefined {
  return tousLesArticles().find((a) => a.slug === slug);
}

export function articlesDeRubrique(rubriqueSlug: string): ArticleComplet[] {
  return tousLesArticles().filter((a) => a.rubriqueSlug === rubriqueSlug);
}

export function formaterDate(iso: string): string {
  const d = new Date(iso + "T12:00:00");
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
