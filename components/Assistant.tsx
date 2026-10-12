"use client";

import { useEffect, useRef, useState } from "react";

type Msg = { role: "user" | "assistant"; content: string };

const GREETING =
  "Salut toi 👋 Pose-moi n'importe quelle question par écrit, je te réponds. J'ai été créé par Kelly.";

const SUGGESTIONS = [
  "Que sait faire Kelly ?",
  "Peux-tu m'expliquer une vidéo pub IA ?",
  "Combien de temps pour un site ?",
];

function Orb({ thinking = false }: { thinking?: boolean }) {
  return (
    <span className="orb" data-thinking={thinking} aria-hidden>
      <span className="halo" />
      <span className="core" />
    </span>
  );
}

export default function Assistant() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const log = useRef<HTMLDivElement>(null);
  const abort = useRef<AbortController | null>(null);

  useEffect(() => {
    log.current?.scrollTo({ top: log.current.scrollHeight });
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
    }
  };

  const onKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  const last = messages.at(-1);
  const waiting = busy && last?.role === "assistant" && !last.content;

  return (
    <section className="assistant" id="ia" aria-labelledby="ia-title">
      <div className="wrap assistant-grid">
        <div className="assistant-intro" data-reveal>
          <span className="eyebrow">Assistant IA · DeepSeek</span>
          <h2 className="section-title" id="ia-title">
            Parle à <em className="ai-text">mon IA</em>.
          </h2>
          <p>
            Un assistant que j&apos;ai conçu et branché sur DeepSeek. Il répond à tes questions en direct, sur
            l&apos;IA, le web, la vidéo… ou sur mon travail.
          </p>
          <div className="orb-wrap">
            <Orb thinking={busy} />
            <div className="bubble">{GREETING}</div>
          </div>
        </div>

        <div className="chat" data-reveal="0.15">
          <div className="chat-head">
            <Orb thinking={busy} />
            <div>
              <b>IA de Kelly</b>
              <small>Propulsée par DeepSeek</small>
            </div>
            <span className="live">
              <i /> en ligne
            </span>
          </div>

          <div className="chat-log" ref={log} aria-live="polite" data-lenis-prevent>
            <div className="msg msg-ai">{GREETING}</div>
            {messages.map((m, i) =>
              m.role === "assistant" && !m.content ? null : (
                <div key={i} className={`msg ${m.role === "user" ? "msg-user" : "msg-ai"}`}>
                  {m.content}
                </div>
              ),
            )}
            {waiting && (
              <div className="msg msg-ai" aria-label="L'IA écrit">
                <span className="typing">
                  <i />
                  <i />
                  <i />
                </span>
              </div>
            )}
            {error && <div className="msg msg-err">{error}</div>}
          </div>

          {messages.length === 0 && (
            <div className="chat-suggest">
              {SUGGESTIONS.map((s) => (
                <button key={s} type="button" onClick={() => send(s)}>
                  {s}
                </button>
              ))}
            </div>
          )}

          <form
            className="chat-form"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <label htmlFor="chat-input" className="sr-only">
              Ta question
            </label>
            <textarea
              id="chat-input"
              rows={1}
              maxLength={1200}
              placeholder="Écris ta question ici…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKey}
            />
            <button className="btn btn-primary" type="submit" disabled={busy || !input.trim()} aria-label="Envoyer">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
