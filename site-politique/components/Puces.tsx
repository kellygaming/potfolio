import Link from "next/link";
import { site } from "@/lib/site";
import { slugify } from "@/lib/slug";

export function Puces({ actif }: { actif?: string }) {
  return (
    <nav className="puces" aria-label="Rubriques">
      {site.rubriques.map((r) => {
        const s = slugify(r);
        return (
          <Link key={r} href={`/rubrique/${s}`} className="puce" aria-current={actif === s ? "page" : undefined}>
            {r}
          </Link>
        );
      })}
    </nav>
  );
}
