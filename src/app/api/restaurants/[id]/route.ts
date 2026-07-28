import { z } from "zod";
import { requireUser } from "@/lib/supabase/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { ApiError, jsonError, jsonOk, requestIdFrom } from "@/lib/saas/errors";
import { listUserRestaurants } from "@/lib/saas/tenant";
import { writeAudit } from "@/lib/saas/audit";
import { demoMode } from "@/lib/domain/inventory";
import { createSeedStore } from "@/lib/demo-store";

type Ctx = { params: Promise<{ id: string }> };

const patchSchema = z.object({
  name: z.string().min(1).optional(),
  location: z.string().optional(),
  seats: z.number().int().nonnegative().optional(),
  timezone: z.string().optional(),
  setActive: z.boolean().optional(),
});

export async function GET(req: Request, ctx: Ctx) {
  const requestId = requestIdFrom(req);
  try {
    const { id } = await ctx.params;
    if (!isSupabaseConfigured() || demoMode()) {
      const seed = createSeedStore();
      return jsonOk({ mode: "demo", restaurant: seed.profile }, { requestId });
    }
    const session = await requireUser();
    if (!session) throw new ApiError("unauthorized", "Sign in required", 401);
    const restaurants = await listUserRestaurants(session.supabase, session.user.id);
    const restaurant = restaurants.find((r) => r.id === id);
    if (!restaurant) throw new ApiError("not_found", "Restaurant not found", 404);
    return jsonOk({ mode: "live", restaurant }, { requestId });
  } catch (err) {
    return jsonError(err, requestId);
  }
}

export async function PATCH(req: Request, ctx: Ctx) {
  const requestId = requestIdFrom(req);
  try {
    const { id } = await ctx.params;
    const body = patchSchema.parse(await req.json());

    if (!isSupabaseConfigured() || demoMode()) {
      return jsonOk({ mode: "demo", restaurant: { id, ...body } }, { requestId });
    }

    const session = await requireUser();
    if (!session) throw new ApiError("unauthorized", "Sign in required", 401);
    const restaurants = await listUserRestaurants(session.supabase, session.user.id);
    const restaurant = restaurants.find((r) => r.id === id);
    if (!restaurant) throw new ApiError("not_found", "Restaurant not found", 404);
    if (restaurant.role === "staff" && !body.setActive) {
      throw new ApiError("forbidden", "Managers only", 403);
    }

    if (body.setActive) {
      await session.supabase
        .from("profiles")
        .upsert({
          id: session.user.id,
          active_restaurant_id: id,
          active_organization_id: restaurant.organization_id,
        });
    }

    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (body.name !== undefined) updates.name = body.name;
    if (body.location !== undefined) updates.location = body.location;
    if (body.seats !== undefined) updates.seats = body.seats;
    if (body.timezone !== undefined) updates.timezone = body.timezone;

    let updated = restaurant;
    if (Object.keys(updates).length > 1) {
      const { data, error } = await session.supabase
        .from("restaurants")
        .update(updates)
        .eq("id", id)
        .select("id, name, location, seats, organization_id, timezone")
        .single();
      if (error) throw new ApiError("internal", error.message, 500);
      updated = { ...data, role: restaurant.role } as typeof restaurant;
      await writeAudit(session.supabase, {
        organizationId: restaurant.organization_id,
        restaurantId: id,
        actorId: session.user.id,
        action: "restaurant.updated",
        entityType: "restaurant",
        entityId: id,
      });
    }

    return jsonOk({ mode: "live", restaurant: updated }, { requestId });
  } catch (err) {
    return jsonError(err, requestId);
  }
}
