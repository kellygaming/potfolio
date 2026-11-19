import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });
const serif = Instrument_Serif({ subsets: ["latin"], variable: "--font-serif", weight: "400", style: ["normal", "italic"] });

const description = `${site.name} — ${site.role}. Sites web, applications IA, vidéos publicitaires, montage et motion design.`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: `${site.name} — Sites web & vidéos publicitaires IA`,
  description,
  openGraph: {
    title: `${site.name} — là où une idée rencontre l'IA`,
    description,
    type: "website",
    locale: "fr_FR",
    images: ["/crimson/hero.webp"],
  },
};

export const viewport: Viewport = { themeColor: "#000000", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${sans.variable} ${serif.variable}`}>
      <body>{children}</body>
    </html>
  );
}
