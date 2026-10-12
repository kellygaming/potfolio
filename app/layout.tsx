import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";
const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display", weight: ["500", "600", "700"], display: "swap" });
const body = Inter({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const title = "Kelly — Créateur de sites web avec l’IA";
const description = "Sites vitrines, boutiques en ligne et applications web avec Kelly. Création assistée par l’IA pour l’Afrique francophone et l’international. Découvrez les réalisations et parlons de votre projet.";
export const metadata: Metadata = {
  metadataBase: new URL(site.url), title, description,
  alternates: { canonical: "/" },
  openGraph: { title, description, url: site.url, siteName: "Kelly — Création web & IA", type: "website", locale: "fr_FR" },
  twitter: { card: "summary_large_image", title, description },
};
export const viewport: Viewport = { themeColor: "#fafafa", width: "device-width", initialScale: 1 };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="fr" className={display.variable + " " + body.variable}><body>{children}</body></html>; }
