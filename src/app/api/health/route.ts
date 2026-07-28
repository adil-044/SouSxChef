import { jsonOk } from "@/lib/saas/errors";
import {
  isSupabaseConfigured,
  isTelegramConfigured,
  isStripeConfigured,
} from "@/lib/supabase/config";

export async function GET() {
  return jsonOk({
    service: "sousxchef",
    version: "0.2.0-saas",
    supabase: isSupabaseConfigured(),
    telegram: isTelegramConfigured(),
    stripe: isStripeConfigured(),
    time: new Date().toISOString(),
  });
}
