import { NextResponse, type NextRequest } from "next/server";

/** Soft gate: dashboard is open in demo mode; real auth hooks in when Supabase is configured. */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (!pathname.startsWith("/dashboard")) {
    return NextResponse.next();
  }
  // Structure ready — client demo session handles UX without cookies for now.
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
