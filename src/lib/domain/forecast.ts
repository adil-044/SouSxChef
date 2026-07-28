import type { DbClient } from "@/lib/supabase/auth";
import { ApiError } from "@/lib/saas/errors";
import { writeAudit } from "@/lib/saas/audit";
import type { TenantContext } from "@/lib/saas/tenant";
import { createSeedStore } from "@/lib/demo-store";
import { demoMode } from "./inventory";

export async function listForecast(supabase: DbClient | null, restaurantId: string) {
  if (!supabase || demoMode()) {
    return { mode: "demo" as const, hints: createSeedStore().forecast };
  }
  const { data, error } = await supabase
    .from("forecast_hints")
    .select("id, day, covers, note")
    .eq("restaurant_id", restaurantId)
    .order("day");
  if (error) throw new ApiError("internal", error.message, 500);
  return { mode: "live" as const, hints: data || [] };
}

export async function upsertForecastHint(
  supabase: DbClient,
  tenant: TenantContext,
  input: { day: string; covers: number; note?: string }
) {
  const { data: existing } = await supabase
    .from("forecast_hints")
    .select("id")
    .eq("restaurant_id", tenant.restaurantId)
    .eq("day", input.day)
    .maybeSingle();

  let row;
  if (existing?.id) {
    const { data, error } = await supabase
      .from("forecast_hints")
      .update({ covers: input.covers, note: input.note ?? null })
      .eq("id", existing.id)
      .select("id, day, covers, note")
      .single();
    if (error) throw new ApiError("internal", error.message, 500);
    row = data;
  } else {
    const { data, error } = await supabase
      .from("forecast_hints")
      .insert({
        restaurant_id: tenant.restaurantId,
        day: input.day,
        covers: input.covers,
        note: input.note ?? null,
      })
      .select("id, day, covers, note")
      .single();
    if (error) throw new ApiError("internal", error.message, 500);
    row = data;
  }

  await writeAudit(supabase, {
    organizationId: tenant.organizationId,
    restaurantId: tenant.restaurantId,
    actorId: tenant.userId,
    action: "forecast.upserted",
    entityType: "forecast_hint",
    entityId: row.id,
  });

  return row;
}
