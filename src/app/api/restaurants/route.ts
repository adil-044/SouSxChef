import { z } from "zod";
import { requireUser } from "@/lib/supabase/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { ApiError, jsonError, jsonOk, requestIdFrom } from "@/lib/saas/errors";
import {
  listUserRestaurants,
  resolveTenant,
  restaurantIdFromRequest,
} from "@/lib/saas/tenant";
import { addLocation } from "@/lib/domain/onboarding";
import { demoMode } from "@/lib/domain/inventory";
import { createSeedStore } from "@/lib/demo-store";

const postSchema = z.object({
  organizationId: z.string().uuid().optional(),
  name: z.string().min(1),
  location: z.string().optional().default(""),
  seats: z.number().int().nonnegative().optional().default(0),
});

export async function GET(req: Request) {
  const requestId = requestIdFrom(req);
  try {
    if (!isSupabaseConfigured() || demoMode()) {
      const seed = createSeedStore();
      return jsonOk(
        {
          mode: "demo",
          restaurants: [
            {
              id: seed.profile.id,
              name: seed.profile.name,
              location: seed.profile.location,
              seats: seed.profile.seats,
              role: "owner",
            },
          ],
        },
        { requestId }
      );
    }
    const session = await requireUser();
    if (!session) throw new ApiError("unauthorized", "Sign in required", 401);
    const restaurants = await listUserRestaurants(session.supabase, session.user.id);
    return jsonOk({ mode: "live", restaurants }, { requestId });
  } catch (err) {
    return jsonError(err, requestId);
  }
}

export async function POST(req: Request) {
  const requestId = requestIdFrom(req);
  try {
    const body = postSchema.parse(await req.json());
    if (!isSupabaseConfigured() || demoMode()) {
      return jsonOk(
        {
          mode: "demo",
          restaurant: body,
          message: "Location accepted (demo).",
        },
        { requestId }
      );
    }
    const session = await requireUser();
    if (!session) throw new ApiError("unauthorized", "Sign in required", 401);

    let orgId = body.organizationId;
    if (!orgId) {
      const tenant = await resolveTenant(
        session.supabase,
        session.user.id,
        restaurantIdFromRequest(req)
      );
      orgId = tenant.organizationId;
    }

    const result = await addLocation(session.supabase, orgId, body);
    return jsonOk(
      {
        mode: "live",
        restaurantId: result.restaurant_id,
        telegramLinkCode: result.telegram_link_code,
      },
      { requestId }
    );
  } catch (err) {
    return jsonError(err, requestId);
  }
}
