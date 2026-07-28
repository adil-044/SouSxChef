import type { DbClient } from "@/lib/supabase/auth";
import { ApiError } from "@/lib/saas/errors";
import { writeAudit } from "@/lib/saas/audit";
import { answerWithInventory, listInventory } from "./inventory";

type TgMessage = {
  chat: { id: number };
  text?: string;
  from?: { username?: string; first_name?: string };
};

/** Service-role Telegram webhook handler — no user JWT. */
export async function handleTelegramUpdate(supabase: DbClient, msg: TgMessage) {
  const chatId = String(msg.chat.id);
  const text = (msg.text || "").trim();
  if (!text) return { ignored: true as const };

  const author = msg.from?.username || msg.from?.first_name || "staff";

  if (text.startsWith("/start")) {
    const payload = text.split(/\s+/)[1] || "";
    if (payload.startsWith("link_")) {
      const { data: link, error } = await supabase
        .from("telegram_links")
        .select("id, restaurant_id, expires_at, chat_id")
        .eq("link_code", payload)
        .maybeSingle();

      if (error || !link) {
        return {
          reply:
            "Link code not found or expired. Ask your owner to mint a new code in SousXChef Settings.",
          restaurantId: null as string | null,
        };
      }
      if (link.expires_at && new Date(link.expires_at) < new Date() && !link.chat_id) {
        return {
          reply: "That link expired. Ask your owner for a fresh code in Settings.",
          restaurantId: null,
        };
      }

      const { error: upErr } = await supabase
        .from("telegram_links")
        .update({ chat_id: chatId, linked_at: new Date().toISOString() })
        .eq("id", link.id);
      if (upErr) throw new ApiError("internal", upErr.message, 500);

      await writeAudit(supabase, {
        restaurantId: link.restaurant_id,
        action: "telegram.linked",
        entityType: "telegram_link",
        entityId: link.id,
        meta: { chatId },
      });

      return {
        reply:
          "SousXChef linked to this kitchen. Ask inventory questions like “how much salmon left?” or “what's under par?”",
        restaurantId: link.restaurant_id as string,
      };
    }

    // Already linked chat?
    const linked = await findRestaurantByChat(supabase, chatId);
    if (linked) {
      return {
        reply: "Already linked. Ask “how much salmon left?” or “what's under par?”",
        restaurantId: linked,
      };
    }
    return {
      reply:
        "Open SousXChef → Settings → Telegram, then tap the deep link (or send /start link_xxxx).",
      restaurantId: null,
    };
  }

  const restaurantId = await findRestaurantByChat(supabase, chatId);
  if (!restaurantId) {
    return {
      reply: "This chat is not linked yet. Use /start with your kitchen link code.",
      restaurantId: null,
    };
  }

  const inv = await listInventory(supabase, restaurantId);
  const reply = answerWithInventory(text, inv.items);

  await supabase.from("messages").insert([
    {
      restaurant_id: restaurantId,
      channel: "telegram",
      direction: "inbound",
      author,
      body: text,
      external_id: chatId,
    },
    {
      restaurant_id: restaurantId,
      channel: "telegram",
      direction: "outbound",
      author: "SousXChef",
      body: reply,
      external_id: chatId,
    },
  ]);

  return { reply, restaurantId };
}

async function findRestaurantByChat(supabase: DbClient, chatId: string) {
  const { data } = await supabase
    .from("telegram_links")
    .select("restaurant_id")
    .eq("chat_id", chatId)
    .not("linked_at", "is", null)
    .order("linked_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return (data?.restaurant_id as string) || null;
}
