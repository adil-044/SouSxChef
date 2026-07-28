import { z } from "zod";
import { requireUser } from "@/lib/supabase/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { ApiError, jsonError, jsonOk, requestIdFrom } from "@/lib/saas/errors";
import { resolveTenant, restaurantIdFromRequest } from "@/lib/saas/tenant";
import { logInventoryPhoto, demoMode } from "@/lib/domain/inventory";

const schema = z.object({
  note: z.string().optional(),
  imageUrl: z.string().url().optional(),
  itemId: z.string().uuid().optional(),
});

export async function POST(req: Request) {
  const requestId = requestIdFrom(req);
  try {
    const body = schema.parse(await req.json());

    if (!isSupabaseConfigured() || demoMode()) {
      return jsonOk(
        {
          mode: "demo",
          log: { id: `demo_${Date.now()}`, ...body },
          aiCount: null,
          message: "Photo logged (demo). Vision count ships with OpenRouter key.",
        },
        { requestId }
      );
    }

    const session = await requireUser();
    if (!session) throw new ApiError("unauthorized", "Sign in required", 401);
    const tenant = await resolveTenant(
      session.supabase,
      session.user.id,
      restaurantIdFromRequest(req)
    );
    const log = await logInventoryPhoto(session.supabase, tenant, body);
    return jsonOk({ mode: "live", log }, { requestId });
  } catch (err) {
    return jsonError(err, requestId);
  }
}
