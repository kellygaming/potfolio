import "server-only";
import { existsSync } from "node:fs";
import path from "node:path";
import { projects, type Project } from "./site";

// Dépose public/projets/<slug>.webp (ou .jpg / .png) : la capture remplace automatiquement la carte typographique.
const dir = path.join(process.cwd(), "public", "projets");

function withShot(p: Project): Project {
  if (p.image) return p;
  const ext = ["webp", "jpg", "png"].find((e) => existsSync(path.join(dir, `${p.slug}.${e}`)));
  return ext ? { ...p, image: `/projets/${p.slug}.${ext}` } : p;
}

export const getProjects = () => projects.map(withShot);

export const getProject = (slug: string) => {
  const p = projects.find((x) => x.slug === slug);
  return p ? withShot(p) : undefined;
};
