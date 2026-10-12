import Image from "next/image";
import { site, projects } from "@/lib/site";
import { Arrow, WhatsAppIcon } from "./Icons";
export default function Hero() {
  return <section className="hero wrap" id="accueil" aria-labelledby="hero-title">
    <div className="hero-top"><p className="eyebrow">Créateur de sites web avec l’IA</p><p className="hero-market">Afrique francophone & international</p></div>
    <h1 id="hero-title">De votre idée<br />à votre site web.</h1>
    <div className="hero-bottom"><p>Je suis Kelly. Je conçois des sites vitrines, des boutiques et des applications web avec l’aide de l’IA. Un design soigné, une expérience claire et votre activité au premier plan.</p><div className="hero-actions"><a className="btn btn-primary" href={site.whatsapp} target="_blank" rel="noopener noreferrer"><WhatsAppIcon />Discutons sur WhatsApp<Arrow diagonal /></a><a className="text-link" href="#projets">Explorer mes réalisations<Arrow /></a></div></div>
    <div className="hero-proof" aria-label="Aperçu des réalisations">{projects.map((p, i) => <a href={"#" + p.slug} className={"preview preview-" + i} key={p.slug} aria-label={"Découvrir le projet " + p.name}><div className="preview-image"><Image src={p.image} alt={"Capture du site " + p.name} width={p.width} height={p.height} sizes="(max-width: 600px) 90vw, (max-width: 1000px) 45vw, 450px" priority={i === 0} /></div><div className="preview-caption"><span>{p.name}</span><Arrow diagonal /></div></a>)}</div>
    <div className="hero-foot"><span>Du design au déploiement.</span><a href="#services" className="text-link">Ce que je peux créer pour vous <span aria-hidden="true">↓</span></a></div>
  </section>;
}
