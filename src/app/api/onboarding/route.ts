import { z } from "zod";
import { requireUser } from "@/lib/supabase/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { ApiError, jsonError, jsonOk, requestIdFrom } from "@/lib/saas/errors";
import { onboardRestaurant } from "@/lib/domain/onboarding";

const schema = z.object({
  name: z.string().min(1),
  location: z.string().optional().default(""),
  seats: z.number().int().nonnegative().optional().default(0),
  pains: z.array(z.string()).optional().default([]),
  channels: z.array(z.string()).optional().default([]),
  categories: z.array(z.string()).optional().default([]),
  skus: z.array(z.string()).optional().default([]),
});

export async function POST(req: Request) {
  const requestId = requestIdFrom(req);
  try {
    const body = schema.parse(await req.json());

    if (!isSupabaseConfigured()) {
      return jsonOk(
        {
          mode: "demo",
          restaurant: body,
          message: "Onboarding accepted (demo). Connect Supabase to persist.",
        },
        { requestId }
      );
    }

    const session = await requireUser();
    if (!session) throw new ApiError("unauthorized", "Sign in required", 401);

    const result = await onboardRestaurant(session.supabase, body);
    return jsonOk(
      {
        mode: "live",
        organizationId: result.organization_id,
        restaurantId: result.restaurant_id,
        telegramLinkCode: result.telegram_link_code,
        restaurant: body,
      },
      { requestId }
    );
  } catch (err) {
    return jsonError(err, requestId);
  }
}
