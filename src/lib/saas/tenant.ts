import type { DbClient } from "@/lib/supabase/auth";
import { ApiError } from "./errors";

export type MembershipRole = "owner" | "manager" | "staff";

export type TenantContext = {
  userId: string;
  organizationId: string;
  restaurantId: string;
  role: MembershipRole;
};

export async function listUserRestaurants(supabase: DbClient, userId: string) {
  const { data: memberships, error: mErr } = await supabase
    .from("memberships")
    .select("organization_id, role")
    .eq("user_id", userId);
  if (mErr) throw new ApiError("internal", mErr.message, 500);
  if (!memberships?.length) return [];

  const orgIds = memberships.map((m) => m.organization_id);
  const { data: restaurants, error } = await supabase
    .from("restaurants")
    .select("id, name, location, seats, organization_id, timezone, created_at")
    .in("organization_id", orgIds)
    .is("deleted_at", null)
    .order("created_at", { ascending: true });
  if (error) throw new ApiError("internal", error.message, 500);

  return (restaurants || []).map((r) => ({
    id: r.id as string,
    name: r.name as string,
    location: r.location as string | null,
    seats: r.seats as number | null,
    organization_id: r.organization_id as string,
    timezone: r.timezone as string | null,
    role: memberships.find((m) => m.organization_id === r.organization_id)?.role as MembershipRole,
  }));
}

/** Resolve active restaurant from header / query / profile. */
export async function resolveTenant(
  supabase: DbClient,
  userId: string,
  restaurantIdHint?: string | null
): Promise<TenantContext> {
  const restaurants = await listUserRestaurants(supabase, userId);
  if (!restaurants.length) {
    throw new ApiError("forbidden", "No restaurant membership", 403);
  }

  let restaurantId = restaurantIdHint || null;

  if (!restaurantId) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("active_restaurant_id")
      .eq("id", userId)
      .maybeSingle();
    restaurantId = profile?.active_restaurant_id || null;
  }

  const match =
    (restaurantId && restaurants.find((r) => r.id === restaurantId)) || restaurants[0]!;

  const { data: membership, error } = await supabase
    .from("memberships")
    .select("role, organization_id")
    .eq("user_id", userId)
    .eq("organization_id", match.organization_id)
    .maybeSingle();

  if (error || !membership) {
    throw new ApiError("forbidden", "Not a member of this organization", 403);
  }

  return {
    userId,
    organizationId: membership.organization_id as string,
    restaurantId: match.id,
    role: membership.role as MembershipRole,
  };
}

export function restaurantIdFromRequest(req: Request): string | null {
  const header = req.headers.get("x-restaurant-id");
  if (header) return header;
  const url = new URL(req.url);
  return url.searchParams.get("restaurantId") || url.searchParams.get("restaurant_id");
}
