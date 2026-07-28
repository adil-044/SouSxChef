import { requireUser } from "@/lib/supabase/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { ApiError, jsonError, jsonOk, requestIdFrom } from "@/lib/saas/errors";
import { resolveTenant, restaurantIdFromRequest } from "@/lib/saas/tenant";
import {
  mintTelegramLink,
  getActiveTelegramLink,
} from "@/lib/domain/onboarding";
import { demoMode } from "@/lib/domain/inventory";

export async function GET(req: Request) {
  const requestId = requestIdFrom(req);
  try {
    if (!isSupabaseConfigured() || demoMode()) {
      const code = `link_demo${Date.now().toString(36).slice(-6)}`;
      return jsonOk(
        {
          mode: "demo",
          linkCode: code,
          linked: false,
          deepLink: `https://t.me/${process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || "SousXChefBot"}?start=${code}`,
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
    const link = await getActiveTelegramLink(session.supabase, tenant.restaurantId);
    const bot = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || "SousXChefBot";
    return jsonOk(
      {
        mode: "live",
        restaurantId: tenant.restaurantId,
        linkCode: link?.link_code ?? null,
        linked: Boolean(link?.chat_id),
        chatId: link?.chat_id ?? null,
        deepLink: link?.link_code
          ? `https://t.me/${bot}?start=${link.link_code}`
          : null,
      },
      { requestId }
    );
  } catch (err) {
    return jsonError(err, requestId);
  }
}

export async function POST(req: Request) {
  const requestId = requestIdFrom(req);
  try {
    if (!isSupabaseConfigured() || demoMode()) {
      const code = `link_${crypto.randomUUID().replace(/-/g, "").slice(0, 10)}`;
      const bot = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || "SousXChefBot";
      return jsonOk(
        {
          mode: "demo",
          linkCode: code,
          deepLink: `https://t.me/${bot}?start=${code}`,
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
    if (tenant.role === "staff") {
      throw new ApiError("forbidden", "Managers only", 403);
    }
    const link = await mintTelegramLink(
      session.supabase,
      tenant.restaurantId,
      session.user.id,
      tenant.organizationId
    );
    const bot = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || "SousXChefBot";
    return jsonOk(
      {
        mode: "live",
        linkCode: link.link_code,
        expiresAt: link.expires_at,
        deepLink: `https://t.me/${bot}?start=${link.link_code}`,
      },
      { requestId }
    );
  } catch (err) {
    return jsonError(err, requestId);
  }
}
