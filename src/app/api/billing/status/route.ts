import { requireUser } from "@/lib/supabase/auth";
import { isSupabaseConfigured, isStripeConfigured } from "@/lib/supabase/config";
import { ApiError, jsonError, jsonOk, requestIdFrom } from "@/lib/saas/errors";
import { resolveTenant, restaurantIdFromRequest } from "@/lib/saas/tenant";
import { demoMode } from "@/lib/domain/inventory";

/** Alias of billing status — GET /api/billing/status */
export async function GET(req: Request) {
  const requestId = requestIdFrom(req);
  try {
    if (!isSupabaseConfigured() || demoMode()) {
      return jsonOk(
        {
          mode: "demo",
          plan: "line",
          status: "trialing",
          stripeConfigured: isStripeConfigured(),
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
    const { data } = await session.supabase
      .from("subscriptions")
      .select("plan, status, current_period_end")
      .eq("organization_id", tenant.organizationId)
      .maybeSingle();

    return jsonOk(
      {
        mode: "live",
        organizationId: tenant.organizationId,
        plan: data?.plan ?? "line",
        status: data?.status ?? "trialing",
        currentPeriodEnd: data?.current_period_end ?? null,
        stripeConfigured: isStripeConfigured(),
      },
      { requestId }
    );
  } catch (err) {
    return jsonError(err, requestId);
  }
}
