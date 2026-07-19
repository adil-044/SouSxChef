const TOKEN = () => process.env.TELEGRAM_BOT_TOKEN;

export async function sendTelegramMessage(chatId: string, text: string) {
  const token = TOKEN();
  if (!token) {
    return { ok: false as const, skipped: true, reason: "TELEGRAM_BOT_TOKEN not set" };
  }
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
  });
  const data = await res.json();
  return { ok: res.ok as boolean, data };
}

export async function setTelegramWebhook(url: string, secret?: string) {
  const token = TOKEN();
  if (!token) return { ok: false, reason: "no token" };
  const params = new URLSearchParams({ url });
  if (secret) params.set("secret_token", secret);
  const res = await fetch(`https://api.telegram.org/bot${token}/setWebhook?${params}`);
  return res.json();
}
