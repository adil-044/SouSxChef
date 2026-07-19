"use client";

import { useEffect, useState } from "react";
import { Badge, Button, Card, Input, SectionHeader } from "@/components/ui/primitives";
import { loadDemoStore, saveDemoStore, type DemoStore } from "@/lib/demo-store";
import { isTelegramConfigured } from "@/lib/supabase/config";

export default function SettingsPage() {
  const [store, setStore] = useState<DemoStore | null>(null);
  const [copied, setCopied] = useState(false);
  const botUser = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || "SousXChefBot";

  useEffect(() => {
    setStore(loadDemoStore());
  }, []);

  if (!store) return null;

  const deepLink = `https://t.me/${botUser}?start=${store.profile.telegramLinkCode}`;

  const copy = async () => {
    await navigator.clipboard.writeText(deepLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const simulateLink = () => {
    const s = loadDemoStore();
    s.profile.telegramLinked = true;
    s.messages.push({
      id: `msg_sys_${Date.now()}`,
      from: "system",
      author: "System",
      text: "Telegram linked (simulated). Staff can message the bot.",
      at: new Date().toISOString(),
      channel: "telegram",
    });
    saveDemoStore(s);
    setStore(loadDemoStore());
  };

  const rotateCode = () => {
    const s = loadDemoStore();
    s.profile.telegramLinkCode = `link_${Math.random().toString(36).slice(2, 10)}`;
    s.profile.telegramLinked = false;
    saveDemoStore(s);
    setStore(loadDemoStore());
  };

  return (
    <div className="mx-auto max-w-3xl">
      <SectionHeader
        eyebrow="Settings"
        title="Restaurant & Telegram"
        description="Profile from onboarding. Connect Telegram when your bot token is ready."
      />

      <Card className="mt-8 space-y-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--ember)]">
          Profile
        </p>
        <Input label="Restaurant" value={store.profile.name} readOnly />
        <Input label="Location" value={store.profile.location} readOnly />
        <Input label="Seats" value={String(store.profile.seats)} readOnly />
      </Card>

      <Card className="mt-6">
        <div className="flex flex-wrap items-center gap-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--ember)]">
            Telegram
          </p>
          {store.profile.telegramLinked ? (
            <Badge tone="ok">Linked</Badge>
          ) : (
            <Badge tone="muted">Not linked</Badge>
          )}
          {!isTelegramConfigured() && <Badge tone="warn">Bot token not set</Badge>}
        </div>
        <p className="mt-4 text-[14px] leading-relaxed text-white/55">
          Staff open this link once. The webhook maps their chat to your restaurant via the link
          code.
        </p>
        <div className="mt-4 break-all border border-white/15 px-4 py-3 font-mono text-[12px] text-white/70">
          {deepLink}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button onClick={copy}>{copied ? "Copied" : "Copy link"}</Button>
          <Button variant="secondary" onClick={rotateCode}>
            Rotate code
          </Button>
          <Button variant="ghost" onClick={simulateLink}>
            Simulate link (demo)
          </Button>
        </div>
        <p className="mt-6 font-mono text-[10px] leading-relaxed text-white/30">
          Later: set TELEGRAM_BOT_TOKEN, deploy, then
          curl &quot;https://api.telegram.org/bot$TOKEN/setWebhook?url=$APP/api/telegram/webhook&quot;
        </p>
      </Card>
    </div>
  );
}
