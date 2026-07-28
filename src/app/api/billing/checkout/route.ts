import { z } from "zod";
import { isStripeConfigured } from "@/lib/supabase/config";
import { ApiError, jsonError, jsonOk, requestIdFrom } from "@/lib/saas/errors";

const checkoutSchema = z.object({
  plan: z.enum(["line", "pass"]).default("line"),
});

export async function POST(req: Request) {
  const requestId = requestIdFrom(req);
  try {
    const body = checkoutSchema.parse(await req.json().catch(() => ({})));

    if (!isStripeConfigured()) {
      return jsonOk(
        {
          mode: "stub",
          plan: body.plan,
          url: null,
          message:
            "Stripe not configured. Set STRIPE_SECRET_KEY + STRIPE_PRICE_LINE / STRIPE_PRICE_PASS.",
          prices: { line: 14900, pass: 34900, currency: "usd" },
        },
        { requestId }
      );
    }

    throw new ApiError(
      "not_configured",
      "Stripe keys present but Checkout wiring is next sprint. Contact support for House plan.",
      501
    );
  } catch (err) {
    return jsonError(err, requestId);
  }
}
