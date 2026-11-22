import Link from "next/link";
import { Logo } from "./Logo";
import { site } from "@/lib/site";
import { slugify } from "@/lib/slug";

export function Pied() {
  return (
    <footer className="pied">
      <div className="conteneur">
        <div className="pied__grille">
          <div>
            <Logo />
            <p>{site.slogan}</p>
          </div>
          <div>
            <h3>Rubriques</h3>
            <ul>
              {site.rubriques.map((r) => (
                <li key={r}><Link href={`/rubrique/${slugify(r)}`}>{r}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Suivre</h3>
            <ul>
              <li><a href={site.reseaux.facebook} rel="noopener" target="_blank">Facebook</a></li>
              <li><a href={site.reseaux.x} rel="noopener" target="_blank">X (Twitter)</a></li>
              <li><a href={site.reseaux.whatsapp} rel="noopener" target="_blank">WhatsApp</a></li>
              <li><Link href="/a-propos">À propos</Link></li>
            </ul>
          </div>
        </div>
        <p className="pied__bas">© {new Date().getFullYear()} {site.nom}. Tous droits réservés.</p>
      </div>
    </footer>
  );
}
