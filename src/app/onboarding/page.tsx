"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Navbar } from "@/components/sections/Navbar";
import { Button, Card, Input, SectionHeader } from "@/components/ui/primitives";
import { loadDemoStore, saveDemoStore } from "@/lib/demo-store";

const PAINS = [
  { id: "inventory", label: "Walk-in / inventory chaos" },
  { id: "labor", label: "Scheduling Sundays" },
  { id: "chat", label: "Staff texts all night" },
  { id: "forecast", label: "Over-ordering / waste" },
] as const;

const CHANNELS = [
  { id: "telegram", label: "Telegram (recommended)" },
  { id: "sms", label: "SMS (later)" },
  { id: "whatsapp", label: "WhatsApp (later)" },
] as const;

const CATEGORIES = ["Proteins", "Produce", "Dairy", "Dry goods", "Specialty", "Beverages"];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("Maison Demo");
  const [location, setLocation] = useState("Ottawa, ON");
  const [seats, setSeats] = useState("48");
  const [pains, setPains] = useState<string[]>(["inventory", "chat"]);
  const [channels, setChannels] = useState<string[]>(["telegram"]);
  const [categories, setCategories] = useState<string[]>(["Proteins", "Produce"]);
  const [skus, setSkus] = useState("A5 Wagyu, Atlantic salmon, Heirloom tomatoes");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const progress = useMemo(() => ((step + 1) / 5) * 100, [step]);

  const toggle = (list: string[], id: string, setter: (v: string[]) => void) => {
    setter(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);
  };

  const finish = async () => {
    setSaving(true);
    setError("");
    try {
      const payload = {
        name,
        location,
        seats: Number(seats) || 0,
        pains,
        channels,
        categories,
        skus: skus
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };
      await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const store = loadDemoStore();
      store.profile = {
        ...store.profile,
        ...payload,
        onboardingComplete: true,
        telegramLinked: false,
      };
      if (!store.session) {
        store.session = { email: "owner@maison.demo", name: "Owner" };
      }
      // Seed inventory names from SKUs if empty-ish
      payload.skus.forEach((sku, i) => {
        if (!store.inventory.some((x) => x.name === sku)) {
          store.inventory.push({
            id: `inv_onb_${i}`,
            name: sku,
            category: categories[0] || "General",
            unit: "kg",
            qty: 2,
            par: 3,
            highValue: true,
          });
        }
      });
      saveDemoStore(store);
      router.push("/dashboard");
    } catch {
      setError("Could not save. Try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--ink)]">
      <Navbar entranceComplete />
      <div className="mx-auto max-w-2xl px-5 py-28 sm:px-8">
        <SectionHeader
          eyebrow={`Step ${step + 1} of 5`}
          title="Kitchen onboarding"
          description="Two minutes. Then your agents have a brain to work with."
        />

        <div className="mt-8 h-1 w-full bg-white/10">
          <div
            className="h-full bg-[var(--ember)] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <Card className="mt-8">
          {step === 0 && (
            <div className="flex flex-col gap-4">
              <Input label="Restaurant name" value={name} onChange={(e) => setName(e.target.value)} />
              <Input
                label="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <Input
                label="Seats"
                type="number"
                value={seats}
                onChange={(e) => setSeats(e.target.value)}
              />
            </div>
          )}

          {step === 1 && (
            <div>
              <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-white/45">
                What hurts most?
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {PAINS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => toggle(pains, p.id, setPains)}
                    className={`border px-4 py-4 text-left text-[14px] transition ${
                      pains.includes(p.id)
                        ? "border-[var(--ember)] bg-[var(--ember)]/10 text-white"
                        : "border-white/15 text-white/60 hover:border-white/30"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-white/45">
                Staff channel
              </p>
              <div className="flex flex-col gap-3">
                {CHANNELS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => toggle(channels, c.id, setChannels)}
                    className={`border px-4 py-4 text-left text-[14px] transition ${
                      channels.includes(c.id)
                        ? "border-[var(--ember)] bg-[var(--ember)]/10 text-white"
                        : "border-white/15 text-white/60"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col gap-6">
              <div>
                <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-white/45">
                  Menu categories
                </p>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => toggle(categories, c, setCategories)}
                      className={`border px-3 py-2 text-[13px] ${
                        categories.includes(c)
                          ? "border-[var(--ember)] text-[var(--ember)]"
                          : "border-white/15 text-white/55"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <Input
                label="High-value SKUs (comma separated)"
                value={skus}
                onChange={(e) => setSkus(e.target.value)}
              />
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4 text-[14px] text-white/70">
              <p>
                <span className="text-white/40">Restaurant:</span> {name} · {location} · {seats}{" "}
                seats
              </p>
              <p>
                <span className="text-white/40">Pains:</span> {pains.join(", ") || "—"}
              </p>
              <p>
                <span className="text-white/40">Channels:</span> {channels.join(", ") || "—"}
              </p>
              <p>
                <span className="text-white/40">Categories:</span> {categories.join(", ") || "—"}
              </p>
              <p>
                <span className="text-white/40">SKUs:</span> {skus}
              </p>
              {error && <p className="text-red-300">{error}</p>}
            </div>
          )}

          <div className="mt-8 flex items-center justify-between gap-3">
            <Button
              variant="ghost"
              disabled={step === 0}
              onClick={() => setStep((s) => Math.max(0, s - 1))}
            >
              Back
            </Button>
            {step < 4 ? (
              <Button
                onClick={() => setStep((s) => s + 1)}
                disabled={step === 0 && !name.trim()}
              >
                Continue
              </Button>
            ) : (
              <Button onClick={finish} disabled={saving}>
                {saving ? "Opening kitchen…" : "Enter dashboard"}
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
