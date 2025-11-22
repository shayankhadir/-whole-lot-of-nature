"use client";

import { useState, useRef, FormEvent } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  references?: Array<{ title: string; url: string }>;
}

export default function PlantsyChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hi, I am Plantsy. Ask me anything about plant care, soil mixes, or choosing the right greens for your space.',
    },
  ]);
  const [pending, setPending] = useState(false);
  const [input, setInput] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  const toggle = () => setIsOpen((prev) => !prev);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const question = input.trim();
    if (!question) return;

    setInput('');
    const userMessage: ChatMessage = { id: crypto.randomUUID(), role: 'user', content: question };
    setMessages((prev) => [...prev, userMessage]);
    setPending(true);

    try {
      const res = await fetch('/api/agents/plantsy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });

      if (!res.ok) {
        throw new Error('Failed to reach Plantsy API');
      }

      const data = await res.json();
      const reply = data?.answer;
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: reply?.nextActions?.careAdvice || reply?.response || 'I was unable to load guidance just now.',
        references: reply?.references?.map((ref: any) => ({ title: ref.title, url: ref.url })),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: 'I could not fetch fresh data. Please retry in a moment.',
        },
      ]);
    } finally {
      setPending(false);
    }
  };

  return (
    <>
      <button
        aria-label="Chat with Plantsy"
        className="fixed bottom-6 right-6 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-2xl hover:bg-emerald-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        onClick={toggle}
      >
        {isOpen ? <X className="h-5 w-5" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 flex w-full max-w-sm flex-col overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-[0_20px_70px_-30px_rgba(16,185,129,0.8)]"
          >
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 px-4 py-4 text-white">
              <p className="text-sm uppercase tracking-wide text-emerald-50">Plantsy</p>
              <h3 className="text-lg font-semibold">Plant Doctor & Care Guide</h3>
              <p className="text-xs text-emerald-50/90">Live data from your WooCommerce catalog + blog tips.</p>
            </div>

            <div className="flex max-h-96 flex-col gap-4 overflow-y-auto bg-emerald-50/40 p-4 text-sm text-emerald-700">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`rounded-2xl px-4 py-3 ${message.role === 'user' ? 'self-end bg-white shadow' : 'bg-white/70 backdrop-blur'} `}
                >
                  <p className="whitespace-pre-line leading-relaxed">{message.content}</p>
                  {message.references && message.references.length > 0 && (
                    <div className="mt-2 text-xs">
                      <p className="font-semibold text-emerald-500">References</p>
                      <ul className="list-inside list-disc text-emerald-400">
                        {message.references.map((ref) => (
                          <li key={ref.url}>
                            <a href={ref.url} target="_blank" rel="noreferrer" className="underline">
                              {ref.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
              {pending && (
                <div className="flex items-center gap-2 rounded-2xl bg-white/70 px-4 py-2 text-emerald-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Plantsy is thinking…</span>
                </div>
              )}
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-emerald-100 bg-white px-3 py-2">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                className="flex-1 rounded-full border border-emerald-100 px-3 py-2 text-sm text-emerald-700 placeholder:text-emerald-400 focus:border-emerald-400 focus:outline-none"
                placeholder="e.g. Tips for ZZ plant in low light?"
              />
              <button
                type="submit"
                disabled={pending}
                className="inline-flex items-center justify-center rounded-full bg-emerald-400 p-2 text-white shadow hover:bg-emerald-500 disabled:opacity-50"
              >
                {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
