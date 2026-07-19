import { NextResponse } from "next/server";
import { answerInventoryQuestion, createSeedStore } from "@/lib/demo-store";
import { sendTelegramMessage } from "@/lib/telegram";

type TgUpdate = {
  message?: {
    chat: { id: number };
    text?: string;
    from?: { username?: string; first_name?: string };
  };
};

/**
 * Telegram webhook.
 * Without TELEGRAM_BOT_TOKEN, still accepts updates and returns a simulated reply.
 * Link codes: /start link_xxxxx — stub accepts any start payload.
 */
export async function POST(req: Request) {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (secret && secret !== "change_me") {
    const header = req.headers.get("x-telegram-bot-api-secret-token");
    if (header !== secret) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
  }

  let update: TgUpdate;
  try {
    update = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const msg = update.message;
  if (!msg?.text) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const chatId = String(msg.chat.id);
  const text = msg.text.trim();
  const seed = createSeedStore();

  if (text.startsWith("/start")) {
    const reply =
      "SousXChef linked (or ready to link). Ask inventory questions like “how much salmon left?”";
    const send = await sendTelegramMessage(chatId, reply);
    return NextResponse.json({ ok: true, linked: true, send });
  }

  const reply = answerInventoryQuestion(text, seed.inventory);
  const send = await sendTelegramMessage(chatId, reply);

  return NextResponse.json({
    ok: true,
    chatId,
    question: text,
    reply,
    send,
  });
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    endpoint: "/api/telegram/webhook",
    configured: Boolean(process.env.TELEGRAM_BOT_TOKEN),
  });
}
