import type { Metadata } from "next";
import { Atelier } from "./Atelier";

export const metadata: Metadata = {
  title: "Atelier de rédaction",
  robots: { index: false, follow: false },
};

export default function PageAtelier() {
  return (
    <div className="conteneur">
      <Atelier />
    </div>
  );
}
