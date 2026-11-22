import Image from "next/image";

type Props = { src?: string; alt: string; priorite?: boolean; tailles?: string };

/** Image d'article, ou visuel de remplacement élégant tant qu'aucune photo n'est fournie. */
export function Couverture({ src, alt, priorite, tailles = "(max-width: 900px) 100vw, 640px" }: Props) {
  if (!src) {
    return (
      <div className="couverture couverture--vide" role="img" aria-label={alt}>
        <span>Photo à venir</span>
      </div>
    );
  }
  return (
    <div className="couverture">
      <Image src={src} alt={alt} fill sizes={tailles} priority={priorite} />
    </div>
  );
}
