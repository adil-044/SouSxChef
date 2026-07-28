import type { DbClient } from "@/lib/supabase/auth";
import { ApiError } from "@/lib/saas/errors";
import { writeAudit } from "@/lib/saas/audit";
import type { TenantContext } from "@/lib/saas/tenant";
import { createSeedStore } from "@/lib/demo-store";
import { demoMode, answerWithInventory, listInventory } from "./inventory";

export async function listMessages(supabase: DbClient | null, restaurantId: string) {
  if (!supabase || demoMode()) {
    return { mode: "demo" as const, messages: createSeedStore().messages };
  }
  const { data, error } = await supabase
    .from("messages")
    .select("id, channel, direction, author, body, created_at")
    .eq("restaurant_id", restaurantId)
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) throw new ApiError("internal", error.message, 500);
  return {
    mode: "live" as const,
    messages: (data || []).map((m) => ({
      id: m.id as string,
      from: (m.direction === "outbound" ? "agent" : "staff") as "agent" | "staff",
      author: (m.author as string) || "staff",
      text: m.body as string,
      at: m.created_at as string,
      channel: ((m.channel as string) || "app") as "telegram" | "sms" | "app",
    })),
  };
}

export async function chatReply(
  supabase: DbClient | null,
  tenant: TenantContext | null,
  input: { message: string; author?: string; channel?: string }
) {
  const restaurantId = tenant?.restaurantId || "demo";
  const inv = await listInventory(supabase, restaurantId);
  const reply = answerWithInventory(input.message, inv.items);

  if (supabase && tenant && !demoMode()) {
    await supabase.from("messages").insert([
      {
        restaurant_id: tenant.restaurantId,
        channel: input.channel || "app",
        direction: "inbound",
        author: input.author || "owner",
        body: input.message,
      },
      {
        restaurant_id: tenant.restaurantId,
        channel: input.channel || "app",
        direction: "outbound",
        author: "SousXChef",
        body: reply,
      },
    ]);
    await writeAudit(supabase, {
      organizationId: tenant.organizationId,
      restaurantId: tenant.restaurantId,
      actorId: tenant.userId,
      action: "chat.answered",
      entityType: "message",
      meta: { preview: input.message.slice(0, 80) },
    });
  }

  return { reply, mode: inv.mode };
}
