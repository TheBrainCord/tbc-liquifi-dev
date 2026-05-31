"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, Loader2, MessageCircle, ArrowRight } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "What loans do you offer?",
  "How to improve my CIBIL score?",
  "What is balance transfer?",
  "ITR filing pricing?",
];

const WELCOME =
  "Hi! I'm **Lumi**, LiquiFi's AI financial advisor 👋\n\nI can help you with loans, CIBIL scores, EMI calculations, balance transfers, and ITR filing. What would you like to know?";

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => crypto.randomUUID());
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open, messages]);

  async function send(text: string) {
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/support/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, session_id: sessionId }),
      });
      const data = await res.json().catch(() => ({}));
      const reply =
        res.ok && data.reply
          ? data.reply
          : "Sorry, I couldn't process that. Please try again or call 1800-123-4567.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Network error. Please check your connection and try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function formatContent(text: string) {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br/>");
  }

  return (
    <>
      {/* Floating trigger */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-full bg-[#1e3a8a] px-5 py-3.5 text-sm font-bold text-white shadow-2xl shadow-blue-900/30 transition-all hover:bg-[#1d4ed8] hover:scale-105 active:scale-95"
          aria-label="Open chat with Lumi"
        >
          <MessageCircle size={18} />
          Ask Lumi (AI)
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col w-[370px] max-w-[calc(100vw-24px)] h-[520px] max-h-[calc(100vh-48px)] rounded-2xl bg-white shadow-2xl shadow-slate-900/20 border border-slate-100 overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3.5 bg-[#1e3a8a] shrink-0">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-base">
              🤖
            </div>
            <div className="flex-1">
              <div className="text-sm font-black text-white">Lumi</div>
              <div className="text-xs text-blue-200">LiquiFi AI Advisor</div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-full text-blue-200 hover:bg-white/10 hover:text-white transition-colors"
              aria-label="Close chat"
            >
              <X size={16} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-[#f8fafc]">
            {/* Welcome bubble */}
            <div className="flex gap-2.5 items-start">
              <div className="w-7 h-7 rounded-full bg-[#1e3a8a]/10 flex items-center justify-center text-sm shrink-0 mt-0.5">
                🤖
              </div>
              <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-slate-700 shadow-sm max-w-[85%] leading-relaxed">
                <p
                  dangerouslySetInnerHTML={{ __html: formatContent(WELCOME) }}
                />
              </div>
            </div>

            {/* Suggestion pills (only when no messages yet) */}
            {messages.length === 0 && (
              <div className="flex flex-wrap gap-2 pl-9">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="flex items-center gap-1 rounded-full border border-[#1e3a8a]/20 bg-white px-3 py-1.5 text-xs font-semibold text-[#1e3a8a] hover:bg-blue-50 transition-colors shadow-sm"
                  >
                    {s} <ArrowRight size={11} />
                  </button>
                ))}
              </div>
            )}

            {/* Conversation */}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2.5 items-start ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 rounded-full bg-[#1e3a8a]/10 flex items-center justify-center text-sm shrink-0 mt-0.5">
                    🤖
                  </div>
                )}
                <div
                  className={`rounded-2xl px-4 py-3 text-sm max-w-[85%] leading-relaxed shadow-sm ${
                    msg.role === "user"
                      ? "bg-[#1e3a8a] text-white rounded-tr-sm"
                      : "bg-white text-slate-700 rounded-tl-sm"
                  }`}
                  dangerouslySetInnerHTML={{
                    __html: formatContent(msg.content),
                  }}
                />
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="flex gap-2.5 items-start">
                <div className="w-7 h-7 rounded-full bg-[#1e3a8a]/10 flex items-center justify-center text-sm shrink-0">
                  🤖
                </div>
                <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                  <Loader2 size={14} className="animate-spin text-[#1e3a8a]" />
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-3 py-3 border-t border-slate-100 bg-white shrink-0">
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-[#f8fafc] px-3 py-2 focus-within:border-[#1e3a8a] focus-within:ring-2 focus-within:ring-[#1e3a8a]/10 transition-all">
              <input
                ref={inputRef}
                type="text"
                placeholder="Ask about loans, CIBIL, ITR…"
                className="flex-1 bg-transparent text-sm text-[#0f172a] placeholder-slate-400 outline-none"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send(input)}
                disabled={loading}
              />
              <button
                onClick={() => send(input)}
                disabled={!input.trim() || loading}
                className="w-8 h-8 rounded-lg bg-[#1e3a8a] flex items-center justify-center text-white transition-all hover:bg-[#1d4ed8] disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                aria-label="Send message"
              >
                <Send size={13} />
              </button>
            </div>
            <p className="text-center text-[10px] text-slate-400 mt-1.5">
              AI answers are informational · For guaranteed rates book a free
              expert call
            </p>
          </div>
        </div>
      )}
    </>
  );
}
