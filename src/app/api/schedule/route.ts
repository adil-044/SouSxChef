import { z } from "zod";
import { requireUser } from "@/lib/supabase/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { ApiError, jsonError, jsonOk, requestIdFrom } from "@/lib/saas/errors";
import { resolveTenant, restaurantIdFromRequest } from "@/lib/saas/tenant";
import { listSchedule, addScheduleSlot } from "@/lib/domain/schedule";
import { demoMode } from "@/lib/domain/inventory";

const postSchema = z.object({
  day: z.string().min(1),
  role: z.string().optional(),
  staffName: z.string().optional(),
  start: z.string().optional(),
  end: z.string().optional(),
});

export async function GET(req: Request) {
  const requestId = requestIdFrom(req);
  try {
    if (!isSupabaseConfigured() || demoMode()) {
      const result = await listSchedule(null, "demo");
      return jsonOk(result, { requestId });
    }
    const session = await requireUser();
    if (!session) throw new ApiError("unauthorized", "Sign in required", 401);
    const tenant = await resolveTenant(
      session.supabase,
      session.user.id,
      restaurantIdFromRequest(req)
    );
    const result = await listSchedule(session.supabase, tenant.restaurantId);
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
      return jsonOk({ mode: "demo", slot: body }, { requestId });
    }
    const session = await requireUser();
    if (!session) throw new ApiError("unauthorized", "Sign in required", 401);
    const tenant = await resolveTenant(
      session.supabase,
      session.user.id,
      restaurantIdFromRequest(req)
    );
    const slot = await addScheduleSlot(session.supabase, tenant, body);
    return jsonOk({ mode: "live", slot }, { requestId });
  } catch (err) {
    return jsonError(err, requestId);
  }
}
