"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Input,
  SectionHeader,
} from "@/components/ui/primitives";
import {
  loadDemoStore,
  saveDemoStore,
  type DemoStore,
  type InventoryItem,
} from "@/lib/demo-store";

export default function InventoryPage() {
  const [store, setStore] = useState<DemoStore | null>(null);
  const [modal, setModal] = useState(false);
  const [name, setName] = useState("");
  const [qty, setQty] = useState("");
  const [note, setNote] = useState("");

  const refresh = () => setStore(loadDemoStore());

  useEffect(() => {
    refresh();
  }, []);

  const submitLog = async (e: FormEvent) => {
    e.preventDefault();
    const s = loadDemoStore();
    const existing = s.inventory.find(
      (i) => i.name.toLowerCase() === name.trim().toLowerCase()
    );
    if (existing) {
      existing.qty = Number(qty) || existing.qty;
    } else {
      const item: InventoryItem = {
        id: `inv_${Date.now()}`,
        name: name.trim() || "New item",
        category: "General",
        unit: "kg",
        qty: Number(qty) || 0,
        par: 2,
        highValue: false,
      };
      s.inventory.unshift(item);
    }
    saveDemoStore(s);
    await fetch("/api/inventory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, qty: Number(qty), note }),
    });
    setModal(false);
    setName("");
    setQty("");
    setNote("");
    refresh();
  };

  if (!store) return null;

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeader
          eyebrow="Inventory agent"
          title="Walk-in truth"
          description="Photo logs and counts. Demo mode updates locally until Supabase is connected."
        />
        <Button onClick={() => setModal(true)}>Log count / photo</Button>
      </div>

      {store.inventory.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            title="No inventory yet"
            body="Add high-value SKUs from onboarding or log your first count."
            action={<Button onClick={() => setModal(true)}>Add item</Button>}
          />
        </div>
      ) : (
        <Card className="mt-10 overflow-x-auto p-0 sm:p-0">
          <table className="w-full min-w-[640px] text-left text-[14px]">
            <thead>
              <tr className="border-b border-white/10 font-mono text-[10px] uppercase tracking-[0.16em] text-white/40">
                <th className="px-6 py-4 font-normal">Item</th>
                <th className="px-4 py-4 font-normal">Category</th>
                <th className="px-4 py-4 font-normal">On hand</th>
                <th className="px-4 py-4 font-normal">Par</th>
                <th className="px-6 py-4 font-normal">Status</th>
              </tr>
            </thead>
            <tbody>
              {store.inventory.map((i) => {
                const low = i.qty < i.par;
                return (
                  <tr key={i.id} className="border-b border-white/5">
                    <td className="px-6 py-4">
                      <span className="text-white">{i.name}</span>
                      {i.highValue && (
                        <span className="ml-2">
                          <Badge tone="ember">High value</Badge>
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-white/50">{i.category}</td>
                    <td className="px-4 py-4 font-mono text-[13px]">
                      {i.qty} {i.unit}
                    </td>
                    <td className="px-4 py-4 font-mono text-[13px] text-white/45">
                      {i.par} {i.unit}
                    </td>
                    <td className="px-6 py-4">
                      <Badge tone={low ? "warn" : "ok"}>{low ? "Under par" : "OK"}</Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <Card className="w-full max-w-md">
            <p className="font-display text-[1.5rem] text-white">Log inventory</p>
            <p className="mt-2 text-[13px] text-white/45">
              Upload UI ready — AI count stubs to a manual qty for now.
            </p>
            <form onSubmit={submitLog} className="mt-6 flex flex-col gap-4">
              <Input
                label="Item name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Atlantic salmon"
                required
              />
              <Input
                label="Quantity"
                type="number"
                step="0.1"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                required
              />
              <Input
                label="Note / photo ref"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Walk-in shelf B"
              />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => setModal(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save count</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
