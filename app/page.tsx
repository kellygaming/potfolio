import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Projects from "@/components/Projects";
import Method from "@/components/Method";
import About from "@/components/About";
import Questions from "@/components/Questions";
import Contact from "@/components/Contact";
import Motion from "@/components/Motion";
import { site } from "@/lib/site";
import { Arrow } from "@/components/Icons";
export default function Home() {
  const schema = { "@context": "https://schema.org", "@type": "Person", name: site.name, url: site.url, jobTitle: site.role, image: site.url + site.photo, sameAs: [site.github], knowsLanguage: "fr" };
  return <><a className="skip-link" href="#contenu">Aller au contenu</a><Nav /><main id="contenu" tabIndex={-1}><Hero /><Services /><Projects /><Method /><About /><Questions /><Contact /></main><footer className="footer"><div className="wrap"><a href="#accueil" className="footer-logo" aria-label="Kelly, retour en haut">kelly.</a><p>Création de sites web avec l’IA.<br />Afrique francophone & international.</p><a href={site.github} className="text-link" target="_blank" rel="noopener noreferrer">GitHub<Arrow diagonal /></a><span>© {new Date().getFullYear()} Kelly</span></div></footer><Motion /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\u003c") }} /></>;
}
