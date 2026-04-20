"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Minus, Bot, Sparkles } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTED_QUESTIONS = [
  "What types of properties do you offer?",
  "How do I buy a property?",
  "Can I book a site visit?",
  "What areas do you cover?",
];

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm Aria, your SS Royal property assistant. How can I help you today? 🏡",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    setShowSuggestions(false);
    const userMessage: Message = { role: "user", content };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();

      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content:
            data.text ||
            "I'm sorry, I couldn't process that. Please try again or contact our team directly.",
        },
      ]);
    } catch {
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content:
            "Something went wrong. Please try again or call the SS Royal team directly.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <>
      {/* ── Floating trigger ── */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            id="chatbot-trigger"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center gap-2 px-4 sm:px-5 py-3 rounded-full cursor-pointer select-none"
            style={{
              background: "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)",
              boxShadow: "0 8px 32px rgba(59,130,246,0.45)",
            }}
          >
            {/* Pulse ring */}
            <span className="absolute inset-0 rounded-full animate-ping opacity-20 bg-blue-400 pointer-events-none" />
            <motion.div
              animate={{ rotate: [0, -12, 12, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 4 }}
            >
              <Sparkles size={17} color="white" />
            </motion.div>
            <span className="text-white text-sm font-semibold tracking-wide">
              Ask Aria
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Chat window ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="chatbot-window"
            initial={{ opacity: 0, scale: 0.88, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 24 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="fixed z-50 flex flex-col overflow-hidden bottom-0 right-0 w-full h-[85dvh] rounded-t-2xl sm:bottom-6 sm:right-6 sm:w-[380px] sm:h-[600px] sm:max-h-[85vh] sm:rounded-2xl"
            style={{
              background: "rgba(10, 15, 28, 0.98)",
              border: "1px solid rgba(59,130,246,0.18)",
              backdropFilter: "blur(24px)",
              boxShadow:
                "0 -10px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(59,130,246,0.08)",
            }}
          >
            {/* ── Header ── */}
            <div
              className="flex items-center justify-between px-4 py-3 flex-shrink-0"
              style={{
                background:
                  "linear-gradient(135deg, #0f172a 0%, #1a2f6b 100%)",
                borderBottom: "1px solid rgba(59,130,246,0.12)",
              }}
            >
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="relative">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      background: "linear-gradient(135deg, #b45309, #f59e0b)",
                      boxShadow: "0 0 12px rgba(245,158,11,0.3)",
                    }}
                  >
                    <Bot size={17} color="white" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#0f172a]" />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold leading-none mb-0.5">
                    Aria
                  </p>
                  <p className="text-emerald-400 text-[11px] font-medium">
                    Online · SS Royal AI
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-1">
                <button
                  id="chatbot-minimize"
                  onClick={() => setIsOpen(false)}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Minimise"
                >
                  <Minus size={13} />
                </button>
                <button
                  id="chatbot-close"
                  onClick={() => setIsOpen(false)}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-red-400 hover:bg-white/10 transition-colors cursor-pointer"
                  title="Close"
                >
                  <X size={13} />
                </button>
              </div>
            </div>

            {/* ── Messages ── */}
            <div className="flex-1 overflow-y-auto flex flex-col gap-3 p-4 scroll-smooth">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  } items-end gap-2`}
                >
                  {/* Bot avatar beside message */}
                  {msg.role === "assistant" && (
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        background:
                          "linear-gradient(135deg, #b45309, #f59e0b)",
                      }}
                    >
                      <Bot size={12} color="white" />
                    </div>
                  )}

                  <div
                    className="max-w-[78%] px-3 py-2.5 text-sm leading-relaxed"
                    style={
                      msg.role === "user"
                        ? {
                            background:
                              "linear-gradient(135deg, #1e40af, #3b82f6)",
                            color: "white",
                            borderRadius: "16px 16px 4px 16px",
                          }
                        : {
                            background: "rgba(255,255,255,0.06)",
                            color: "#cbd5e1",
                            border: "1px solid rgba(255,255,255,0.07)",
                            borderRadius: "16px 16px 16px 4px",
                          }
                    }
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              <AnimatePresence>
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-end gap-2 justify-start"
                  >
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        background:
                          "linear-gradient(135deg, #b45309, #f59e0b)",
                      }}
                    >
                      <Bot size={12} color="white" />
                    </div>
                    <div
                      className="px-4 py-3 flex items-center gap-1"
                      style={{
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.07)",
                        borderRadius: "16px 16px 16px 4px",
                      }}
                    >
                      {[0, 1, 2].map((dot) => (
                        <motion.span
                          key={dot}
                          className="w-1.5 h-1.5 rounded-full bg-slate-400 block"
                          animate={{ y: [0, -5, 0] }}
                          transition={{
                            duration: 0.55,
                            repeat: Infinity,
                            delay: dot * 0.14,
                            ease: "easeInOut",
                          }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Suggested quick questions */}
              <AnimatePresence>
                {showSuggestions && messages.length <= 1 && !isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-col gap-2 mt-1"
                  >
                    <p className="text-[11px] text-slate-500 text-center">
                      Quick questions
                    </p>
                    {SUGGESTED_QUESTIONS.map((q, i) => (
                      <motion.button
                        key={i}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.45 + i * 0.08 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => sendMessage(q)}
                        className="text-left text-xs px-3 py-2 rounded-xl cursor-pointer transition-all"
                        style={{
                          background: "rgba(59,130,246,0.07)",
                          border: "1px solid rgba(59,130,246,0.18)",
                          color: "#93c5fd",
                        }}
                      >
                        {q}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </div>

            {/* ── Input bar ── */}
            <div
              className="flex items-center gap-2 px-3 py-3 flex-shrink-0"
              style={{
                borderTop: "1px solid rgba(255,255,255,0.06)",
                background: "rgba(255,255,255,0.02)",
              }}
            >
              <input
                ref={inputRef}
                id="chatbot-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about properties…"
                disabled={isLoading}
                className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 outline-none disabled:opacity-60"
                style={{ caretColor: "#3b82f6" }}
              />
              <motion.button
                id="chatbot-send"
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isLoading}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                style={{
                  background:
                    input.trim() && !isLoading
                      ? "linear-gradient(135deg, #1e40af, #3b82f6)"
                      : "rgba(255,255,255,0.07)",
                }}
              >
                <Send size={13} color="white" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
