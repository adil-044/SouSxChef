import { NextResponse } from "next/server";
import { z } from "zod";
import { answerInventoryQuestion, createSeedStore } from "@/lib/demo-store";

const schema = z.object({
  message: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const { message } = schema.parse(await req.json());
    const seed = createSeedStore();
    const reply = answerInventoryQuestion(message, seed.inventory);
    return NextResponse.json({
      ok: true,
      mode: "demo",
      reply,
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Invalid payload" },
      { status: 400 }
    );
  }
}
