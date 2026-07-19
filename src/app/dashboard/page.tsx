"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge, Card, SectionHeader } from "@/components/ui/primitives";
import { loadDemoStore, type DemoStore } from "@/lib/demo-store";

export default function DashboardHome() {
  const [store, setStore] = useState<DemoStore | null>(null);

  useEffect(() => {
    setStore(loadDemoStore());
  }, []);

  if (!store) {
    return <p className="font-mono text-[12px] text-white/40">Loading kitchen…</p>;
  }

  const lows = store.inventory.filter((i) => i.qty < i.par);
  const peak = [...store.forecast].sort((a, b) => b.covers - a.covers)[0];

  const kpis = [
    {
      label: "SKUs under par",
      value: String(lows.length),
      hint: lows.length ? lows.map((i) => i.name).join(", ") : "All clear",
      href: "/dashboard/inventory",
    },
    {
      label: "Staff messages",
      value: String(store.messages.filter((m) => m.from === "staff").length),
      hint: "Telegram + app thread",
      href: "/dashboard/chat",
    },
    {
      label: "Peak covers",
      value: String(peak?.covers ?? "—"),
      hint: peak ? `${peak.day} — ${peak.note}` : "No forecast",
      href: "/dashboard/forecast",
    },
    {
      label: "Telegram",
      value: store.profile.telegramLinked ? "Linked" : "Not linked",
      hint: store.profile.telegramLinked ? "Staff can ask the bot" : "Connect in Settings",
      href: "/dashboard/settings",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeader
          eyebrow="Owner home"
          title={`Good service, ${store.session?.name ?? "chef"}.`}
          description="One brain for inventory, labor, chat, and demand — starting with what needs attention now."
        />
        {!store.profile.onboardingComplete && (
          <Badge tone="warn">Finish onboarding</Badge>
        )}
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => (
          <Link key={k.label} href={k.href}>
            <Card className="h-full transition hover:border-[var(--ember)]/50">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
                {k.label}
              </p>
              <p className="font-display mt-3 text-[2.25rem] leading-none text-[var(--ember)]">
                {k.value}
              </p>
              <p className="mt-3 text-[13px] text-white/50">{k.hint}</p>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <Card>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--ember)]">
            Needs attention
          </p>
          <ul className="mt-4 divide-y divide-white/10">
            {lows.length === 0 ? (
              <li className="py-4 text-[14px] text-white/45">No items under par.</li>
            ) : (
              lows.map((i) => (
                <li key={i.id} className="flex items-center justify-between py-3 text-[14px]">
                  <span>{i.name}</span>
                  <span className="font-mono text-[12px] text-amber-200">
                    {i.qty} / {i.par} {i.unit}
                  </span>
                </li>
              ))
            )}
          </ul>
        </Card>
        <Card>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--ember)]">
            Latest chat
          </p>
          <ul className="mt-4 space-y-3">
            {store.messages.slice(-4).map((m) => (
              <li key={m.id} className="text-[14px]">
                <span className="font-mono text-[10px] text-white/35">
                  {m.author} · {m.channel}
                </span>
                <p className="text-white/75">{m.text}</p>
              </li>
            ))}
          </ul>
          <Link
            href="/dashboard/chat"
            className="mt-4 inline-block font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--ember)]"
          >
            Open chat →
          </Link>
        </Card>
      </div>
    </div>
  );
}
