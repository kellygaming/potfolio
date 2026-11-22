import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { z } from "zod";
import { site } from "@/lib/site";

export const runtime = "nodejs";
export const maxDuration = 120;

const Entree = z.object({
  motDePasse: z.string(),
  texte: z.string().min(40, "Le texte est trop court.").max(30_000),
  rubrique: z.string().optional(),
  consigne: z.string().max(500).optional(),
});

const Sortie = z.object({
  titre: z.string().describe("Titre principal, 60 à 90 caractères, informatif"),
  titresAlternatifs: z.array(z.string()).describe("3 autres propositions de titre"),
  chapo: z.string().describe("Chapô de 1 à 2 phrases (max 280 caractères)"),
  rubrique: z.string().describe("Une rubrique parmi la liste fournie"),
  etiquette: z.string().describe("Badge court optionnel (ex. Décryptage, Tribune) ou chaîne vide"),
  corps: z
    .string()
    .describe("Corps de l'article en Markdown : paragraphes courts, intertitres ## , citations > si pertinent"),
  ideeImage: z
    .string()
    .describe("Description d'une photo ou illustration à produire pour illustrer l'article"),
});

export type ResultatClarifier = z.infer<typeof Sortie>;

const SYSTEME = `Tu es secrétaire de rédaction d'un site d'actualité politique (style magazine panafricain sobre et exigeant), au service de ${site.nom}.
Ta mission : rendre un texte brut clair et agréable à lire, sans en changer le sens ni les positions.
Règles :
- Français soigné, phrases courtes, un paragraphe = une idée.
- Ne jamais inventer de faits, de chiffres, de dates ni de citations absents du texte source.
- Garder le ton de l'auteur ; supprimer répétitions et formules creuses.
- Ajouter 2 à 4 intertitres (##) pour un texte de plus de 300 mots.
- Rubriques autorisées : ${site.rubriques.join(", ")}.`;

const client = new Anthropic();

export async function POST(req: Request) {
  const corps = Entree.safeParse(await req.json().catch(() => null));
  if (!corps.success) {
    return Response.json(
      { erreur: corps.error.issues[0]?.message ?? "Requête invalide." },
      { status: 400 },
    );
  }

  const attendu = process.env.ATELIER_PASSWORD;
  if (!attendu || corps.data.motDePasse !== attendu) {
    return Response.json({ erreur: "Mot de passe incorrect." }, { status: 401 });
  }

  const { texte, rubrique, consigne } = corps.data;
  const demande = [
    rubrique ? `Rubrique souhaitée : ${rubrique}` : "",
    consigne ? `Consigne particulière : ${consigne}` : "",
    "Texte brut à mettre en forme :",
    `<texte>\n${texte}\n</texte>`,
  ]
    .filter(Boolean)
    .join("\n\n");

  try {
    const reponse = await client.beta.messages.parse({
      model: "claude-opus-5-5",
      max_tokens: 16000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: { effort: "medium", format: betaZodOutputFormat(Sortie) },
      system: SYSTEME,
      messages: [{ role: "user", content: demande }],
    });

    if (reponse.stop_reason === "refusal" || !reponse.parsed_output) {
      return Response.json(
        { erreur: "L'IA n'a pas pu traiter ce texte. Reformulez ou raccourcissez-le." },
        { status: 422 },
      );
    }
    return Response.json(reponse.parsed_output);
  } catch (e) {
    if (e instanceof Anthropic.AuthenticationError) {
      return Response.json({ erreur: "Clé ANTHROPIC_API_KEY invalide ou absente." }, { status: 500 });
    }
    if (e instanceof Anthropic.RateLimitError) {
      return Response.json({ erreur: "Trop de demandes, réessayez dans une minute." }, { status: 429 });
    }
    if (e instanceof Anthropic.APIError) {
      return Response.json({ erreur: `Erreur de l'IA (${e.status}).` }, { status: 502 });
    }
    throw e;
  }
}
