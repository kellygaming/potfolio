"use client";

import { useEffect, useRef, useState } from "react";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = ["Que sait faire Kelly ?", "C'est quoi une pub vidéo IA ?", "Parle-moi de Motion.ai"];

/** L'IA de Kelly : une carte sombre, la conversation en streaming (DeepSeek via /api/chat). */
export default function AskAI() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const log = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLInputElement>(null);
  const abort = useRef<AbortController | null>(null);

  useEffect(() => {
    log.current?.scrollTo({ top: log.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  useEffect(() => () => abort.current?.abort(), []);

  const send = async (text: string) => {
    const q = text.trim();
    if (!q || busy) return;
    setError("");
    setInput("");
    const history: Msg[] = [...messages, { role: "user", content: q }];
    setMessages([...history, { role: "assistant", content: "" }]);
    setBusy(true);
    abort.current = new AbortController();
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
        signal: abort.current.signal,
      });
      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "L'IA n'a pas pu répondre.");
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let answer = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        answer += decoder.decode(value, { stream: true });
        setMessages([...history, { role: "assistant", content: answer }]);
      }
      if (!answer) throw new Error("Réponse vide, réessayez.");
    } catch (e) {
      if ((e as Error).name === "AbortError") return;
      setMessages(history);
      setError((e as Error).message);
    } finally {
      setBusy(false);
      field.current?.focus({ preventScroll: true });
    }
  };

  const last = messages.at(-1);
  const waiting = busy && last?.role === "assistant" && !last.content;

  return (
    <section className="ask" id="ia" aria-labelledby="ia-title">
      <header className="head">
        <h2 className="h2 h2-lg" id="ia-title">
          Posez la question <em>à mon</em> IA
        </h2>
        <p>Je l&apos;ai créée pour vous répondre, même quand je dors</p>
      </header>

      <div className="ask-card">
        <div className="ask-top">
          <span className="ask-dot" data-busy={busy} />
          <span>{busy ? "réfléchit…" : "IA de Kelly · en ligne"}</span>
        </div>

        <div className="ask-log" ref={log} aria-live="polite">
          {messages.length === 0 && (
            <p className="ask-hello">
              Bonjour&nbsp;! Je suis l&apos;assistant de Kelly. Demandez-moi ce qu&apos;il sait faire, ses projets, ou comment l&apos;IA
              peut servir votre entreprise.
            </p>
          )}
          {messages.map((m, i) =>
            m.role === "assistant" && !m.content ? null : (
              <div key={i} className={`ask-msg is-${m.role}`}>
                <span>{m.role === "user" ? "Vous" : "IA de Kelly"}</span>
                <p>{m.content}</p>
              </div>
            ),
          )}
          {waiting && (
            <div className="ask-msg is-assistant" aria-label="L'IA écrit">
              <span>IA de Kelly</span>
              <span className="typing">
                <i />
                <i />
                <i />
              </span>
            </div>
          )}
          {error && <p className="ask-err">{error}</p>}
        </div>

        {messages.length === 0 && (
          <div className="ask-suggest">
            {SUGGESTIONS.map((s) => (
              <button key={s} type="button" onClick={() => send(s)}>
                {s}
              </button>
            ))}
          </div>
        )}

        <form
          className="ask-input"
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
        >
          <label htmlFor="ia-field" className="sr-only">
            Votre question
          </label>
          <input
            id="ia-field"
            ref={field}
            autoComplete="off"
            maxLength={1200}
            placeholder="Écrivez votre question…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" disabled={busy || !input.trim()} aria-label="Envoyer">
            →
          </button>
        </form>
      </div>
    </section>
  );
}
