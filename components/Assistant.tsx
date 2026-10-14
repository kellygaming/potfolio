"use client";

import { useEffect, useRef, useState } from "react";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = ["Que sait faire Kelly ?", "C'est quoi une pub vidéo IA ?", "Combien de temps pour un site ?"];

/** Assistant IA plein écran : un grand cadre, « Bonjour utilisateur », la conversation au centre, la saisie en bas. */
export default function Assistant() {
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
      if (!answer) throw new Error("Réponse vide, réessaie.");
    } catch (e) {
      if ((e as Error).name === "AbortError") return;
      setMessages(history);
      setError((e as Error).message);
    } finally {
      setBusy(false);
      field.current?.focus({ preventScroll: true });
    }
  };

  const started = messages.length > 0;
  const last = messages.at(-1);
  const waiting = busy && last?.role === "assistant" && !last.content;

  return (
    <section className="assistant" id="ia" aria-labelledby="ia-title">
      <div className="ia-frame" data-started={started}>
        <span className="ia-by" aria-hidden>
          By Kelly
        </span>
        <span className="ia-status" aria-hidden>
          <i data-busy={busy} /> {busy ? "réfléchit…" : "en ligne · DeepSeek"}
        </span>

        <header className="ia-hello">
          <h2 id="ia-title">Bonjour utilisateur</h2>
          <p>J&apos;ai été créé par Kelly.</p>
          <p>Pose-moi tes questions.</p>
        </header>

        <div className="ia-log" ref={log} aria-live="polite">
          {messages.map((m, i) =>
            m.role === "assistant" && !m.content ? null : (
              <div key={i} className={`ia-msg ia-${m.role}`}>
                <span className="ia-who">{m.role === "user" ? "Toi" : "IA de Kelly"}</span>
                <p>{m.content}</p>
              </div>
            ),
          )}
          {waiting && (
            <div className="ia-msg ia-assistant" aria-label="L'IA écrit">
              <span className="ia-who">IA de Kelly</span>
              <span className="typing">
                <i />
                <i />
                <i />
              </span>
            </div>
          )}
          {error && <p className="ia-err">{error}</p>}
        </div>

        {!started && (
          <div className="ia-suggest">
            {SUGGESTIONS.map((s) => (
              <button key={s} type="button" onClick={() => send(s)}>
                {s}
              </button>
            ))}
          </div>
        )}

        <form
          className="ia-input"
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
        >
          <label htmlFor="ia-field" className="sr-only">
            Ta question
          </label>
          <span className="ia-caret" aria-hidden />
          <input
            id="ia-field"
            ref={field}
            autoComplete="off"
            maxLength={1200}
            placeholder="Écris ta question ici…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" disabled={busy || !input.trim()} aria-label="Envoyer">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        </form>
      </div>
    </section>
  );
}
