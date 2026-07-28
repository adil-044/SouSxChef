import { z } from "zod";
import { requireUser } from "@/lib/supabase/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { ApiError, jsonError, jsonOk, requestIdFrom } from "@/lib/saas/errors";
import { resolveTenant, restaurantIdFromRequest } from "@/lib/saas/tenant";
import { withIdempotency } from "@/lib/saas/idempotency";
import {
  listInventory,
  upsertInventoryItem,
  demoMode,
} from "@/lib/domain/inventory";
import { createSeedStore } from "@/lib/demo-store";

const postSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1),
  qty: z.number(),
  unit: z.string().optional(),
  category: z.string().optional(),
  par: z.number().optional(),
  highValue: z.boolean().optional(),
  note: z.string().optional(),
});

export async function GET(req: Request) {
  const requestId = requestIdFrom(req);
  try {
    if (!isSupabaseConfigured() || demoMode()) {
      const seed = createSeedStore();
      return jsonOk({ mode: "demo", items: seed.inventory }, { requestId });
    }
    const session = await requireUser();
    if (!session) throw new ApiError("unauthorized", "Sign in required", 401);
    const tenant = await resolveTenant(
      session.supabase,
      session.user.id,
      restaurantIdFromRequest(req)
    );
    const result = await listInventory(session.supabase, tenant.restaurantId);
    return jsonOk({ ...result, restaurantId: tenant.restaurantId }, { requestId });
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
          item: body,
          aiCount: null,
          message: "Count logged (demo).",
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

    const idemKey = req.headers.get("idempotency-key");
    const { value } = await withIdempotency(
      session.supabase,
      session.user.id,
      "POST /api/inventory",
      idemKey,
      async () => {
        const item = await upsertInventoryItem(session.supabase, tenant, body);
        return { mode: "live" as const, item, aiCount: null };
      }
    );

    return jsonOk(value, { requestId });
  } catch (err) {
    return jsonError(err, requestId);
  }
}
