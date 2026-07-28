import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/auth";
import { isSupabaseConfigured, isTelegramConfigured } from "@/lib/supabase/config";
import { sendTelegramMessage } from "@/lib/telegram";
import { handleTelegramUpdate } from "@/lib/domain/telegram";
import { answerInventoryQuestion, createSeedStore } from "@/lib/demo-store";
import { jsonOk } from "@/lib/saas/errors";

type TgUpdate = {
  message?: {
    chat: { id: number };
    text?: string;
    from?: { username?: string; first_name?: string };
  };
};

const recentChats = new Map<string, number>();
const RATE_WINDOW_MS = 2000;

function rateLimited(chatId: string): boolean {
  const now = Date.now();
  const last = recentChats.get(chatId) || 0;
  if (now - last < RATE_WINDOW_MS) return true;
  recentChats.set(chatId, now);
  return false;
}

/**
 * Telegram webhook — service role when Supabase live.
 * Link: /start link_xxxxx binds chat to restaurant.
 */
export async function POST(req: Request) {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  const isProd = process.env.NODE_ENV === "production";
  if (secret && secret !== "change_me") {
    const header = req.headers.get("x-telegram-bot-api-secret-token");
    if (header !== secret) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
  } else if (isProd && isTelegramConfigured()) {
    return NextResponse.json(
      { ok: false, error: "TELEGRAM_WEBHOOK_SECRET required in production" },
      { status: 503 }
    );
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
  if (rateLimited(chatId)) {
    return NextResponse.json({ ok: true, rateLimited: true });
  }

  // Live path
  if (isSupabaseConfigured()) {
    const supabase = createServiceClient();
    const result = await handleTelegramUpdate(supabase, msg);
    if ("ignored" in result && result.ignored) {
      return NextResponse.json({ ok: true, ignored: true });
    }
    const send = await sendTelegramMessage(chatId, result.reply);
    return NextResponse.json({
      ok: true,
      restaurantId: result.restaurantId,
      reply: result.reply,
      send,
    });
  }

  // Demo fallback
  const text = msg.text.trim();
  const seed = createSeedStore();
  const reply = text.startsWith("/start")
    ? "SousXChef demo mode — connect Supabase + bot token for real kitchen link. Ask “how much salmon left?”"
    : answerInventoryQuestion(text, seed.inventory);
  const send = await sendTelegramMessage(chatId, reply);
  return NextResponse.json({ ok: true, mode: "demo", chatId, reply, send });
}

export async function GET() {
  return jsonOk({
    endpoint: "/api/telegram/webhook",
    configured: isTelegramConfigured(),
    supabase: isSupabaseConfigured(),
  });
}
