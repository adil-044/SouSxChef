const TOKEN = () => process.env.TELEGRAM_BOT_TOKEN;

export async function sendTelegramMessage(chatId: string, text: string) {
  const token = TOKEN();
  if (!token) {
    return { ok: false as const, skipped: true, reason: "TELEGRAM_BOT_TOKEN not set" };
  }
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: text.slice(0, 4000),
      disable_web_page_preview: true,
    }),
  });
  const data = await res.json();
  return { ok: res.ok as boolean, data };
}

export async function setTelegramWebhook(url: string, secret?: string) {
  const token = TOKEN();
  if (!token) return { ok: false, reason: "no token" };
  const body: Record<string, unknown> = {
    url,
    allowed_updates: ["message"],
  };
  if (secret) body.secret_token = secret;
  const res = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function getTelegramWebhookInfo() {
  const token = TOKEN();
  if (!token) return { ok: false, reason: "no token" };
  const res = await fetch(`https://api.telegram.org/bot${token}/getWebhookInfo`);
  return res.json();
}
