import { assistantSystemPrompt } from "@/lib/site";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

type Msg = { role: "user" | "assistant"; content: string };

const MAX_TURNS = 12;
const MAX_CHARS = 1200;

export async function POST(req: Request) {
  const key = process.env.DEEPSEEK_API_KEY;
  if (!key) return Response.json({ error: "L'assistant n'est pas encore branché." }, { status: 503 });

  if (!rateLimit(`chat:${clientIp(req)}`, 20, 10 * 60_000)) {
    return Response.json({ error: "Tu poses beaucoup de questions ! Réessaie dans quelques minutes." }, { status: 429 });
  }

  let messages: Msg[];
  try {
    const body = await req.json();
    messages = (Array.isArray(body?.messages) ? body.messages : [])
      .filter(
        (m: Msg) => (m?.role === "user" || m?.role === "assistant") && typeof m.content === "string" && m.content.trim(),
      )
      .slice(-MAX_TURNS)
      .map((m: Msg) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }));
  } catch {
    return Response.json({ error: "Requête invalide." }, { status: 400 });
  }
  if (!messages.length || messages.at(-1)?.role !== "user") {
    return Response.json({ error: "Écris d'abord ta question." }, { status: 400 });
  }

  const upstream = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: process.env.DEEPSEEK_MODEL || "deepseek-chat",
      messages: [{ role: "system", content: assistantSystemPrompt }, ...messages],
      stream: true,
      temperature: 0.7,
      max_tokens: 600,
    }),
    signal: req.signal,
  }).catch(() => null);

  if (!upstream?.ok || !upstream.body) {
    return Response.json({ error: "L'IA est momentanément indisponible. Réessaie dans un instant." }, { status: 502 });
  }

  // Convertit le flux SSE de DeepSeek en flux de texte brut pour le client.
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";
  const stream = upstream.body.pipeThrough(
    new TransformStream<Uint8Array, Uint8Array>({
      transform(chunk, controller) {
        buffer += decoder.decode(chunk, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          const data = line.trim();
          if (!data.startsWith("data:")) continue;
          const payload = data.slice(5).trim();
          if (payload === "[DONE]") continue;
          try {
            const delta = JSON.parse(payload)?.choices?.[0]?.delta?.content;
            if (delta) controller.enqueue(encoder.encode(delta));
          } catch {
            /* ligne keep-alive ou partielle */
          }
        }
      },
    }),
  );

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
  });
}
