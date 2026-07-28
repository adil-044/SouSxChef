import { NextResponse } from "next/server";

export type ApiErrorCode =
  | "unauthorized"
  | "forbidden"
  | "not_found"
  | "validation"
  | "not_configured"
  | "conflict"
  | "rate_limited"
  | "internal";

export class ApiError extends Error {
  constructor(
    public code: ApiErrorCode,
    message: string,
    public status: number = 400
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function jsonOk<T extends Record<string, unknown>>(
  body: T,
  init?: { status?: number; headers?: HeadersInit; requestId?: string }
) {
  const headers = new Headers(init?.headers);
  if (init?.requestId) headers.set("x-request-id", init.requestId);
  return NextResponse.json({ ok: true, ...body }, { status: init?.status ?? 200, headers });
}

export function jsonError(err: unknown, requestId?: string) {
  const headers = new Headers();
  if (requestId) headers.set("x-request-id", requestId);

  if (err instanceof ApiError) {
    return NextResponse.json(
      { ok: false, error: err.message, code: err.code },
      { status: err.status, headers }
    );
  }

  if (err && typeof err === "object" && "issues" in err) {
    return NextResponse.json(
      { ok: false, error: "Invalid payload", code: "validation" as ApiErrorCode },
      { status: 400, headers }
    );
  }

  const message = err instanceof Error ? err.message : "Internal error";
  return NextResponse.json(
    { ok: false, error: message, code: "internal" as ApiErrorCode },
    { status: 500, headers }
  );
}

export function requestIdFrom(req: Request): string {
  return req.headers.get("x-request-id") || crypto.randomUUID();
}
