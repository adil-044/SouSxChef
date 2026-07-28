import type { DbClient } from "@/lib/supabase/auth";
import { ApiError } from "@/lib/saas/errors";
import { writeAudit } from "@/lib/saas/audit";

export type OnboardInput = {
  name: string;
  location?: string;
  seats?: number;
  pains?: string[];
  channels?: string[];
  categories?: string[];
  skus?: string[];
};

export async function onboardRestaurant(supabase: DbClient, input: OnboardInput) {
  const { data, error } = await supabase.rpc("onboard_restaurant", {
    p_name: input.name,
    p_location: input.location ?? "",
    p_seats: input.seats ?? 0,
    p_pains: input.pains ?? [],
    p_channels: input.channels ?? [],
    p_categories: input.categories ?? [],
    p_skus: input.skus ?? [],
  });
  if (error) throw new ApiError("internal", error.message, 500);
  return data as {
    organization_id: string;
    restaurant_id: string;
    telegram_link_code: string;
  };
}

export async function addLocation(
  supabase: DbClient,
  organizationId: string,
  input: { name: string; location?: string; seats?: number }
) {
  const { data, error } = await supabase.rpc("add_restaurant_location", {
    p_organization_id: organizationId,
    p_name: input.name,
    p_location: input.location ?? "",
    p_seats: input.seats ?? 0,
  });
  if (error) throw new ApiError("internal", error.message, 500);
  return data as { restaurant_id: string; telegram_link_code: string };
}

export async function mintTelegramLink(
  supabase: DbClient,
  restaurantId: string,
  userId: string,
  organizationId: string
) {
  const code = `link_${crypto.randomUUID().replace(/-/g, "").slice(0, 10)}`;
  // Soft-expire prior unused codes for this restaurant
  await supabase
    .from("telegram_links")
    .update({ expires_at: new Date().toISOString() })
    .eq("restaurant_id", restaurantId)
    .is("chat_id", null);

  const { data, error } = await supabase
    .from("telegram_links")
    .insert({
      restaurant_id: restaurantId,
      link_code: code,
      linked_by: userId,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    })
    .select("id, link_code, expires_at")
    .single();
  if (error) throw new ApiError("internal", error.message, 500);

  await writeAudit(supabase, {
    organizationId,
    restaurantId,
    actorId: userId,
    action: "telegram.link_minted",
    entityType: "telegram_link",
    entityId: data.id,
  });

  return data;
}

export async function getActiveTelegramLink(supabase: DbClient, restaurantId: string) {
  const { data } = await supabase
    .from("telegram_links")
    .select("id, link_code, chat_id, linked_at, expires_at")
    .eq("restaurant_id", restaurantId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return data;
}
