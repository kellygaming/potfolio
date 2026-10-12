import About from "@/components/About";
import Assistant from "@/components/Assistant";
import Claim from "@/components/Claim";
import Contact from "@/components/Contact";
import Hero from "@/components/Hero";
import Motion from "@/components/Motion";
import Nav from "@/components/Nav";
import Projects from "@/components/Projects";
import { site } from "@/lib/site";

export default function Home() {
  return (
    <>
      <Motion />
      <div className="grain" aria-hidden />
      <Nav />
      <main>
        <Hero />
        <Claim />
        <Assistant />
        <Projects />
        <About />
        <Contact />
      </main>
      <footer className="footer">
        <div className="wrap">
          <span>
            © {new Date().getFullYear()} {site.name} — {site.role}
          </span>
          <a href={site.github} target="_blank" rel="noopener noreferrer">
            GitHub ↗
          </a>
        </div>
      </footer>
    </>
  );
}
