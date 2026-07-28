import type { DbClient } from "@/lib/supabase/auth";
import { ApiError } from "@/lib/saas/errors";
import { writeAudit } from "@/lib/saas/audit";
import type { TenantContext } from "@/lib/saas/tenant";
import {
  answerInventoryQuestion,
  createSeedStore,
  type InventoryItem,
} from "@/lib/demo-store";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export type InventoryRow = {
  id: string;
  name: string;
  category: string | null;
  unit: string | null;
  qty: number;
  par: number;
  high_value: boolean;
  updated_at?: string;
};

export function demoMode() {
  return !isSupabaseConfigured();
}

export async function listInventory(
  supabase: DbClient | null,
  restaurantId: string
): Promise<{ mode: "live" | "demo"; items: InventoryRow[] }> {
  if (!supabase || demoMode()) {
    const seed = createSeedStore();
    return {
      mode: "demo",
      items: seed.inventory.map((i) => ({
        id: i.id,
        name: i.name,
        category: i.category,
        unit: i.unit,
        qty: i.qty,
        par: i.par,
        high_value: i.highValue,
      })),
    };
  }

  const { data, error } = await supabase
    .from("inventory_items")
    .select("id, name, category, unit, qty, par, high_value, updated_at")
    .eq("restaurant_id", restaurantId)
    .order("name");
  if (error) throw new ApiError("internal", error.message, 500);
  return { mode: "live", items: (data || []) as InventoryRow[] };
}

export async function upsertInventoryItem(
  supabase: DbClient,
  tenant: TenantContext,
  input: {
    id?: string;
    name: string;
    qty: number;
    unit?: string;
    category?: string;
    par?: number;
    highValue?: boolean;
    note?: string;
  }
) {
  const payload = {
    restaurant_id: tenant.restaurantId,
    name: input.name,
    qty: input.qty,
    unit: input.unit ?? "kg",
    category: input.category ?? null,
    par: input.par ?? 0,
    high_value: input.highValue ?? false,
    updated_at: new Date().toISOString(),
    created_by: tenant.userId,
  };

  let item: InventoryRow;
  if (input.id) {
    const { data, error } = await supabase
      .from("inventory_items")
      .update(payload)
      .eq("id", input.id)
      .eq("restaurant_id", tenant.restaurantId)
      .select("id, name, category, unit, qty, par, high_value, updated_at")
      .single();
    if (error) throw new ApiError("internal", error.message, 500);
    item = data as InventoryRow;
  } else {
    const { data, error } = await supabase
      .from("inventory_items")
      .insert(payload)
      .select("id, name, category, unit, qty, par, high_value, updated_at")
      .single();
    if (error) throw new ApiError("internal", error.message, 500);
    item = data as InventoryRow;
  }

  await supabase.from("inventory_logs").insert({
    restaurant_id: tenant.restaurantId,
    item_id: item.id,
    source: "manual",
    note: input.note ?? null,
    created_by: tenant.userId,
  });

  await writeAudit(supabase, {
    organizationId: tenant.organizationId,
    restaurantId: tenant.restaurantId,
    actorId: tenant.userId,
    action: input.id ? "inventory.updated" : "inventory.created",
    entityType: "inventory_item",
    entityId: item.id,
  });

  return item;
}

export async function logInventoryPhoto(
  supabase: DbClient,
  tenant: TenantContext,
  input: { note?: string; imageUrl?: string; itemId?: string }
) {
  const { data, error } = await supabase
    .from("inventory_logs")
    .insert({
      restaurant_id: tenant.restaurantId,
      item_id: input.itemId ?? null,
      source: "photo",
      note: input.note ?? null,
      image_url: input.imageUrl ?? null,
      created_by: tenant.userId,
    })
    .select("id, created_at")
    .single();
  if (error) throw new ApiError("internal", error.message, 500);

  await writeAudit(supabase, {
    organizationId: tenant.organizationId,
    restaurantId: tenant.restaurantId,
    actorId: tenant.userId,
    action: "inventory.photo_logged",
    entityType: "inventory_log",
    entityId: data.id,
  });

  return { ...data, aiCount: null as null };
}

export function toAnswerItems(rows: InventoryRow[]): InventoryItem[] {
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    category: r.category || "General",
    unit: r.unit || "kg",
    qty: Number(r.qty),
    par: Number(r.par),
    highValue: Boolean(r.high_value),
  }));
}

export function answerWithInventory(question: string, rows: InventoryRow[]) {
  return answerInventoryQuestion(question, toAnswerItems(rows));
}
