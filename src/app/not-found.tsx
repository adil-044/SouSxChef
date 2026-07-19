import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--ink)] px-6 text-center text-white">
      <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--ember)]">404</p>
      <h1 className="font-display mt-4 text-[clamp(2rem,5vw,3rem)] font-medium">
        This page could not be found.
      </h1>
      <p className="mt-4 max-w-md text-[15px] text-white/55">
        Try the home page, blog, or get started flow.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex h-11 items-center bg-[var(--ember)] px-6 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--ink)]"
        >
          Home
        </Link>
        <Link
          href="/blog"
          className="inline-flex h-11 items-center border border-white/25 px-6 font-mono text-[11px] uppercase tracking-[0.16em] text-white"
        >
          Blog
        </Link>
        <Link
          href="/onboarding"
          className="inline-flex h-11 items-center border border-white/25 px-6 font-mono text-[11px] uppercase tracking-[0.16em] text-white"
        >
          Get started
        </Link>
      </div>
    </div>
  );
}
