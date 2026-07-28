import type { DbClient } from "@/lib/supabase/auth";

export async function writeAudit(
  supabase: DbClient,
  input: {
    organizationId?: string | null;
    restaurantId?: string | null;
    actorId?: string | null;
    action: string;
    entityType?: string;
    entityId?: string;
    meta?: Record<string, unknown>;
  }
) {
  const { error } = await supabase.from("audit_events").insert({
    organization_id: input.organizationId ?? null,
    restaurant_id: input.restaurantId ?? null,
    actor_id: input.actorId ?? null,
    action: input.action,
    entity_type: input.entityType ?? null,
    entity_id: input.entityId ?? null,
    meta: input.meta ?? {},
  });
  if (error) {
    console.error("[audit]", error.message);
  }
}
