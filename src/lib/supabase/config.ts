export function isSupabaseConfigured() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(
    url &&
      key &&
      !url.includes("placeholder") &&
      key !== "placeholder" &&
      url.startsWith("http")
  );
}

export function isTelegramConfigured() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  return Boolean(token && token !== "placeholder");
}
