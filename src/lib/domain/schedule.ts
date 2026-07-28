import type { DbClient } from "@/lib/supabase/auth";
import { ApiError } from "@/lib/saas/errors";
import { writeAudit } from "@/lib/saas/audit";
import type { TenantContext } from "@/lib/saas/tenant";
import { createSeedStore } from "@/lib/demo-store";
import { demoMode } from "./inventory";

export async function listSchedule(supabase: DbClient | null, restaurantId: string) {
  if (!supabase || demoMode()) {
    return { mode: "demo" as const, slots: createSeedStore().schedule };
  }
  const { data, error } = await supabase
    .from("schedules")
    .select("id, day, role, staff_name, start_time, end_time")
    .eq("restaurant_id", restaurantId)
    .order("day");
  if (error) throw new ApiError("internal", error.message, 500);
  return {
    mode: "live" as const,
    slots: (data || []).map((s) => ({
      id: s.id as string,
      day: s.day as string,
      role: (s.role as string) || "",
      name: (s.staff_name as string) || "",
      start: (s.start_time as string) || "",
      end: (s.end_time as string) || "",
    })),
  };
}

export async function addScheduleSlot(
  supabase: DbClient,
  tenant: TenantContext,
  input: { day: string; role?: string; staffName?: string; start?: string; end?: string }
) {
  const { data, error } = await supabase
    .from("schedules")
    .insert({
      restaurant_id: tenant.restaurantId,
      day: input.day,
      role: input.role ?? null,
      staff_name: input.staffName ?? null,
      start_time: input.start ?? null,
      end_time: input.end ?? null,
      created_by: tenant.userId,
    })
    .select("id, day, role, staff_name, start_time, end_time")
    .single();
  if (error) throw new ApiError("internal", error.message, 500);

  await writeAudit(supabase, {
    organizationId: tenant.organizationId,
    restaurantId: tenant.restaurantId,
    actorId: tenant.userId,
    action: "schedule.created",
    entityType: "schedule",
    entityId: data.id,
  });

  return data;
}
