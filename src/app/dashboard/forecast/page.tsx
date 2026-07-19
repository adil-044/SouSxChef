"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, SectionHeader } from "@/components/ui/primitives";
import { loadDemoStore, type DemoStore } from "@/lib/demo-store";

export default function ForecastPage() {
  const [store, setStore] = useState<DemoStore | null>(null);

  useEffect(() => {
    setStore(loadDemoStore());
  }, []);

  const max = useMemo(
    () => Math.max(...(store?.forecast.map((f) => f.covers) ?? [1]), 1),
    [store]
  );

  if (!store) return null;

  return (
    <div className="mx-auto max-w-6xl">
      <SectionHeader
        eyebrow="Demand forecast"
        title="Buy for the week ahead"
        description="Cover hints from seed history. Live forecasting plugs in when the agent is trained on your POS."
      />

      <Card className="mt-10">
        <div className="flex h-56 items-end gap-3 sm:gap-4">
          {store.forecast.map((f) => (
            <div key={f.id} className="flex flex-1 flex-col items-center gap-2">
              <span className="font-mono text-[11px] text-white/50">{f.covers}</span>
              <div
                className="w-full bg-[var(--ember)]/80 transition-all"
                style={{ height: `${(f.covers / max) * 100}%`, minHeight: 8 }}
              />
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/40">
                {f.day}
              </span>
            </div>
          ))}
        </div>
      </Card>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {store.forecast.map((f) => (
          <Card key={f.id}>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--ember)]">
              {f.day} · {f.covers} covers
            </p>
            <p className="mt-3 text-[15px] text-white/75">{f.note}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
