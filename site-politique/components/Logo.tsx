import Link from "next/link";
import { site } from "@/lib/site";

/** Logo bicolore façon « jeune|afrique » : prénom en noir, nom en couleur d'accent. */
export function Logo() {
  const [prenom, ...reste] = site.nom.split(" ");
  return (
    <Link href="/" className="logo" aria-label={`${site.nom} — accueil`}>
      {prenom.toLowerCase()}
      <span>{reste.join("").toLowerCase()}</span>
    </Link>
  );
}
