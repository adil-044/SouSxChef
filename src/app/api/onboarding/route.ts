import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1),
  location: z.string().optional().default(""),
  seats: z.number().int().nonnegative().optional().default(0),
  pains: z.array(z.string()).optional().default([]),
  channels: z.array(z.string()).optional().default([]),
  categories: z.array(z.string()).optional().default([]),
  skus: z.array(z.string()).optional().default([]),
});

export async function POST(req: Request) {
  try {
    const body = schema.parse(await req.json());
    // Persist to Supabase when configured; demo clients also write localStorage.
    return NextResponse.json({
      ok: true,
      mode: "demo",
      restaurant: body,
      message: "Onboarding accepted. Connect Supabase to persist server-side.",
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Invalid payload" },
      { status: 400 }
    );
  }
}
