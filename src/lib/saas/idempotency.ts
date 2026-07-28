import type { DbClient } from "@/lib/supabase/auth";

/** Simple idempotency for mutating POSTs. Returns cached response if key seen. */
export async function withIdempotency<T>(
  supabase: DbClient,
  userId: string,
  route: string,
  key: string | null,
  run: () => Promise<T>
): Promise<{ cached: boolean; value: T }> {
  if (!key) {
    return { cached: false, value: await run() };
  }

  const { data: existing } = await supabase
    .from("idempotency_keys")
    .select("response")
    .eq("user_id", userId)
    .eq("key", key)
    .eq("route", route)
    .maybeSingle();

  if (existing?.response) {
    return { cached: true, value: existing.response as T };
  }

  const value = await run();
  await supabase.from("idempotency_keys").upsert(
    {
      user_id: userId,
      key,
      route,
      response: value as unknown as Record<string, unknown>,
    },
    { onConflict: "user_id,key,route" }
  );
  return { cached: false, value };
}
