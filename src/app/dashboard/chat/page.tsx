"use client";

import { FormEvent, useEffect, useState } from "react";
import { Button, Card, EmptyState, SectionHeader } from "@/components/ui/primitives";
import {
  answerInventoryQuestion,
  loadDemoStore,
  saveDemoStore,
  type DemoStore,
} from "@/lib/demo-store";

export default function ChatPage() {
  const [store, setStore] = useState<DemoStore | null>(null);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  const refresh = () => setStore(loadDemoStore());

  useEffect(() => {
    refresh();
  }, []);

  const send = async (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSending(true);
    const s = loadDemoStore();
    const staffMsg = {
      id: `msg_${Date.now()}`,
      from: "staff" as const,
      author: s.session?.name || "You",
      text: text.trim(),
      at: new Date().toISOString(),
      channel: "app" as const,
    };
    s.messages.push(staffMsg);
    const reply = answerInventoryQuestion(text, s.inventory);
    s.messages.push({
      id: `msg_${Date.now()}_a`,
      from: "agent",
      author: "SousXChef",
      text: reply,
      at: new Date().toISOString(),
      channel: "app",
    });
    saveDemoStore(s);
    await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text }),
    });
    setText("");
    refresh();
    setSending(false);
  };

  if (!store) return null;

  return (
    <div className="mx-auto flex max-w-3xl flex-col">
      <SectionHeader
        eyebrow="Chat agent"
        title="Kitchen brain replies"
        description="Telegram messages will mirror here. Ask inventory or schedule questions now."
      />

      <Card className="mt-8 flex min-h-[480px] flex-col p-0 sm:p-0">
        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-6 sm:px-6">
          {store.messages.length === 0 ? (
            <EmptyState
              title="No messages yet"
              body="Ask “how much salmon left?” or link Telegram in Settings."
            />
          ) : (
            store.messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.from === "staff" ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-[85%] px-4 py-3 text-[14px] ${
                    m.from === "agent"
                      ? "bg-[var(--ember)] text-[var(--ink)]"
                      : m.from === "system"
                        ? "border border-white/15 text-white/60"
                        : "bg-white/10 text-white"
                  }`}
                >
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] opacity-60">
                    {m.author} · {m.channel}
                  </p>
                  <p className="mt-1 leading-relaxed">{m.text}</p>
                </div>
              </div>
            ))
          )}
        </div>
        <form
          onSubmit={send}
          className="flex gap-2 border-t border-white/10 p-4 sm:p-5"
        >
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="How much salmon left?"
            className="h-11 flex-1 border border-white/15 bg-transparent px-4 text-[14px] outline-none focus:border-[var(--ember)]"
          />
          <Button type="submit" disabled={sending || !text.trim()}>
            Send
          </Button>
        </form>
      </Card>
    </div>
  );
}
