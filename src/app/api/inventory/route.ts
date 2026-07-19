import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1),
  qty: z.number(),
  note: z.string().optional(),
});

export async function GET() {
  return NextResponse.json({
    ok: true,
    mode: "demo",
    message: "Use client demo store until Supabase inventory is wired.",
  });
}

export async function POST(req: Request) {
  try {
    const body = schema.parse(await req.json());
    return NextResponse.json({
      ok: true,
      mode: "demo",
      item: body,
      aiCount: null,
      message: "Count logged (demo). Vision count stub ready for later.",
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Invalid payload" },
      { status: 400 }
    );
  }
}
