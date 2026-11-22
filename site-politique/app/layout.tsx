import type { Metadata, Viewport } from "next";
import { Inter, Newsreader } from "next/font/google";
import { Entete } from "@/components/Entete";
import { Pied } from "@/components/Pied";
import { BandeauAppel } from "@/components/BandeauAppel";
import { site } from "@/lib/site";
import "./globals.css";

const serif = Newsreader({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  style: ["normal", "italic"],
});
const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.nom} — ${site.slogan}`, template: `%s · ${site.nom}` },
  description: site.description,
  openGraph: { type: "website", locale: "fr_FR", siteName: site.nom },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#121212" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${serif.variable} ${sans.variable}`}>
      <body className="avec-appel">
        <Entete />
        <main>{children}</main>
        <Pied />
        <BandeauAppel />
      </body>
    </html>
  );
}
