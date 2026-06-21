"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, Sparkles, Bot, User as UserIcon, Loader2, Plus, Trash2 } from "lucide-react";
import { useCura } from "@/lib/store/useCura";

type Msg = { id: string; role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "I have a wedding in 30 days",
  "Best skincare for Mumbai humidity?",
  "Suggest salons near Powai",
  "How do I stop hair fall?",
  "What hairstyle suits a corporate look?",
  "Build me a 30-day glow routine",
  "Anti-aging in my 30s",
  "Korean glass skin routine",
];

export function ChatUI() {
  const twin = useCura((s) => s.twin);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [streaming, setStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);

  // Auto-grow textarea
  useEffect(() => {
    const el = taRef.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  }, [input]);

  // Auto-scroll to newest message
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, streaming]);

  async function send(text?: string) {
    const content = (text ?? input).trim();
    if (!content || streaming) return;
    const userMsg: Msg = { id: crypto.randomUUID(), role: "user", content };
    const assistantId = crypto.randomUUID();
    setMessages((m) => [...m, userMsg, { id: assistantId, role: "assistant", content: "" }]);
    setInput("");
    setStreaming(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(({ role, content }) => ({ role, content })),
          twin,
        }),
      });
      if (!res.ok || !res.body) throw new Error(`status ${res.status}`);
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        if (!chunk) continue;
        setMessages((m) =>
          m.map((msg) => (msg.id === assistantId ? { ...msg, content: msg.content + chunk } : msg))
        );
      }
    } catch (err) {
      setMessages((m) =>
        m.map((msg) =>
          msg.id === assistantId
            ? { ...msg, content: "Sorry — something interrupted my thinking. Try again in a moment." }
            : msg
        )
      );
    } finally {
      setStreaming(false);
    }
  }

  function newChat() {
    if (streaming) return;
    setMessages([]);
    setInput("");
    taRef.current?.focus();
  }

  function onKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 pt-10 pb-40">
      <div className="text-center mb-8">
        <div className="chip mx-auto mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse" />
          CURA Agent · streaming via Groq
        </div>
        <h1 className="font-display text-4xl md:text-5xl tracking-tight">
          What are we <span className="text-grad">working on?</span>
        </h1>
        {twin ? (
          <p className="text-xs text-muted mt-2">Personalized for your <span className="text-ink">{twin.persona}</span> persona.</p>
        ) : (
          <p className="text-xs text-muted mt-2">Tip: Create your Beauty Twin first for fully personalized replies.</p>
        )}
      </div>

      {/* Messages container */}
      <div ref={scrollRef} className="glass rounded-3xl p-2 md:p-4 h-[60vh] overflow-y-auto relative">
        {messages.length === 0 ? (
          <div className="p-8 text-center h-full flex flex-col items-center justify-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-violet to-cyan flex items-center justify-center mb-4 animate-pulse_glow"
            >
              <Sparkles className="w-7 h-7 text-white" />
            </motion.div>
            <p className="text-muted text-sm max-w-md mx-auto">
              I'm CURA — your AI Beauty Concierge. Ask me anything about hair, skin, salons, weddings, makeup, or routines.
            </p>
            <div className="flex flex-wrap gap-2 justify-center mt-6 max-w-2xl">
              {SUGGESTIONS.map((s, i) => (
                <motion.button
                  key={s}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i }}
                  onClick={() => send(s)}
                  className="chip hover:scale-105 transition cursor-pointer"
                >
                  {s}
                </motion.button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4 p-2">
            <AnimatePresence initial={false}>
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {m.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet to-cyan flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-gradient-to-br from-violet/30 to-aurora/30 border border-violet/30 text-ink"
                        : "glass text-ink/95"
                    }`}
                  >
                    {m.content ? <Markdown text={m.content} /> : <TypingDots />}
                  </div>
                  {m.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-white/10 border border-white/10 flex items-center justify-center flex-shrink-0 mt-1">
                      <UserIcon className="w-4 h-4 text-ink" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Action row above composer */}
      {messages.length > 0 && (
        <div className="flex justify-center mt-3">
          <button
            onClick={newChat}
            disabled={streaming}
            className="text-[11px] text-muted hover:text-ink inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 hover:border-white/20 transition disabled:opacity-40"
          >
            <Trash2 className="w-3 h-3" /> New chat
          </button>
        </div>
      )}

      {/* Composer */}
      <form
        onSubmit={(e) => { e.preventDefault(); send(); }}
        className="fixed bottom-5 inset-x-0 px-4 z-30"
      >
        <div className="max-w-3xl mx-auto">
          <div className="glass-strong rounded-2xl p-2.5 flex items-end gap-2 ring-glow">
            <button
              type="button"
              onClick={newChat}
              disabled={streaming}
              title="New chat"
              className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] transition flex items-center justify-center flex-shrink-0 disabled:opacity-40"
            >
              <Plus className="w-4 h-4 text-muted" />
            </button>
            <textarea
              ref={taRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKey}
              placeholder="Ask CURA anything — skin, salons, weddings, makeup, hair fall..."
              rows={1}
              className="flex-1 bg-transparent outline-none text-sm text-ink placeholder:text-muted px-2 py-2 resize-none max-h-[160px] leading-relaxed"
              disabled={streaming}
            />
            <button
              type="submit"
              disabled={!input.trim() || streaming}
              className="btn-primary !py-2 !px-3 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              title="Send"
            >
              {streaming ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowUp className="w-4 h-4" />}
            </button>
          </div>
          <div className="text-[10px] text-muted text-center mt-2">
            CURA can make mistakes. Verify with your stylist for medical or allergy guidance.
          </div>
        </div>
      </form>
    </div>
  );
}

function TypingDots() {
  return (
    <span className="inline-flex gap-1 items-center py-1">
      <span className="w-1.5 h-1.5 rounded-full bg-ink/70 animate-bounce" style={{ animationDelay: "0ms" }} />
      <span className="w-1.5 h-1.5 rounded-full bg-ink/70 animate-bounce" style={{ animationDelay: "120ms" }} />
      <span className="w-1.5 h-1.5 rounded-full bg-ink/70 animate-bounce" style={{ animationDelay: "240ms" }} />
    </span>
  );
}

/* Lightweight markdown renderer for chat bubbles.
   Handles: **bold**, bullet lists (- or *), numbered lists, blank-line paragraphs.
   No external deps — safe and tiny. */
function Markdown({ text }: { text: string }) {
  // Split into blocks separated by blank line
  const blocks = text.split(/\n{2,}/);
  return (
    <div className="space-y-2.5">
      {blocks.map((block, bi) => {
        const lines = block.split("\n");
        const isBulleted = lines.every((l) => /^\s*[-*]\s+/.test(l));
        const isNumbered = lines.every((l) => /^\s*\d+\.\s+/.test(l));
        if (isBulleted) {
          return (
            <ul key={bi} className="space-y-1.5 pl-1">
              {lines.map((l, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-violet mt-1.5 text-[6px] flex-shrink-0">●</span>
                  <span className="flex-1">{renderInline(l.replace(/^\s*[-*]\s+/, ""))}</span>
                </li>
              ))}
            </ul>
          );
        }
        if (isNumbered) {
          return (
            <ol key={bi} className="space-y-1.5 pl-1">
              {lines.map((l, i) => {
                const m = l.match(/^\s*(\d+)\.\s+(.*)$/);
                return (
                  <li key={i} className="flex gap-2">
                    <span className="text-cyan font-mono text-xs flex-shrink-0 w-4 mt-0.5">{m?.[1]}.</span>
                    <span className="flex-1">{renderInline(m?.[2] ?? l)}</span>
                  </li>
                );
              })}
            </ol>
          );
        }
        // paragraph (preserve single newlines as <br/>)
        return (
          <p key={bi} className="leading-relaxed">
            {lines.map((l, i) => (
              <span key={i}>
                {renderInline(l)}
                {i < lines.length - 1 && <br />}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}

function renderInline(text: string): React.ReactNode {
  // Split on **bold** preserving the tokens
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => {
    if (/^\*\*[^*]+\*\*$/.test(p)) {
      return <strong key={i} className="text-ink font-semibold">{p.slice(2, -2)}</strong>;
    }
    return <span key={i}>{p}</span>;
  });
}
