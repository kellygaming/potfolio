import { steps } from "@/lib/site";
export default function Method() {
  return <section className="method section" id="methode" aria-labelledby="method-title"><div className="wrap"><div className="section-head"><div><p className="eyebrow">03 / Méthode</p><h2 id="method-title">L’IA accélère.<br />Le soin fait la différence.</h2></div><p>L’IA est un outil de création et de développement. Le projet reste guidé par vos objectifs, vos retours et les vérifications avant la mise en ligne.</p></div><ol className="steps">{steps.map((step, i) => <li key={step.title} data-reveal><span className="step-number" aria-hidden="true">0{i + 1}</span><h3>{step.title}</h3><p>{step.text}</p></li>)}</ol></div></section>;
}
