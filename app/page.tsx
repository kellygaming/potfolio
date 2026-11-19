import { existsSync } from "node:fs";
import path from "node:path";
import Portfolio from "@/components/Portfolio";
import { projects } from "@/lib/site";

// Dépose public/projets/<slug>.webp (ou .jpg / .png) : la capture remplace automatiquement la carte typographique.
function withShots() {
  const dir = path.join(process.cwd(), "public", "projets");
  return projects.map((p) => {
    if (p.image) return p;
    const ext = ["webp", "jpg", "png"].find((e) => existsSync(path.join(dir, `${p.slug}.${e}`)));
    return ext ? { ...p, image: `/projets/${p.slug}.${ext}` } : p;
  });
}

export default function Home() {
  return (
    <main>
      <Portfolio projects={withShots()} />
    </main>
  );
}
