"use client";

import { useEffect, useMemo, useState } from "react";
import { Button, Card, EmptyState, SectionHeader } from "@/components/ui/primitives";
import { loadDemoStore, saveDemoStore, type DemoStore } from "@/lib/demo-store";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function SchedulePage() {
  const [store, setStore] = useState<DemoStore | null>(null);

  useEffect(() => {
    setStore(loadDemoStore());
  }, []);

  const byDay = useMemo(() => {
    const map: Record<string, DemoStore["schedule"]> = {};
    DAYS.forEach((d) => {
      map[d] = store?.schedule.filter((s) => s.day === d) ?? [];
    });
    return map;
  }, [store]);

  const addShift = (day: string) => {
    const s = loadDemoStore();
    s.schedule.push({
      id: `sch_${Date.now()}`,
      day,
      role: "Line",
      name: "New hire",
      start: "16:00",
      end: "23:00",
    });
    saveDemoStore(s);
    setStore(loadDemoStore());
  };

  if (!store) return null;

  return (
    <div className="mx-auto max-w-6xl">
      <SectionHeader
        eyebrow="Labor agent"
        title="Week on the line"
        description="Draft coverage for the rush you will have. Edit locally in demo mode."
      />

      {store.schedule.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            title="No shifts yet"
            body="Add your first shift for Monday to start the week."
            action={<Button onClick={() => addShift("Mon")}>Add Monday shift</Button>}
          />
        </div>
      ) : (
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {DAYS.map((day) => (
            <Card key={day} className="flex min-h-[200px] flex-col">
              <div className="flex items-center justify-between">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--ember)]">
                  {day}
                </p>
                <button
                  type="button"
                  onClick={() => addShift(day)}
                  className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/40 hover:text-white"
                >
                  + Add
                </button>
              </div>
              <ul className="mt-4 flex flex-1 flex-col gap-3">
                {(byDay[day] || []).length === 0 && (
                  <li className="text-[13px] text-white/35">Off / unassigned</li>
                )}
                {(byDay[day] || []).map((s) => (
                  <li key={s.id} className="border border-white/10 px-3 py-2 text-[13px]">
                    <p className="text-white">{s.name}</p>
                    <p className="mt-1 font-mono text-[11px] text-white/45">
                      {s.role} · {s.start}–{s.end}
                    </p>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
