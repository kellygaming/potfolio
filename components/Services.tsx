import { services } from "@/lib/site";
import { Arrow } from "./Icons";
export default function Services() {
  return <section className="services section" id="services" aria-labelledby="services-title"><div className="wrap"><div className="section-head"><div><p className="eyebrow">01 / Services</p><h2 id="services-title">Le bon site.<br />Pour votre activité.</h2></div><p>Un projet utile commence par un besoin précis. Nous choisissons ensemble le format et les fonctionnalités qui vous correspondent.</p></div><div className="service-list">{services.map((s, i) => <article className="service-row" key={s.name} data-reveal><span className="index">0{i + 1}</span><div><h3>{s.name}</h3><p className="service-details">{s.details}</p></div><p>{s.description}</p><a href="#contact" className="round-link" aria-label={"Discuter d’un projet : " + s.name}><Arrow diagonal /></a></article>)}</div></div></section>;
}
