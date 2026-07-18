"use client";

export function ClosingCTA() {
  return (
    <section
      id="cta"
      className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-[var(--ink)] px-5 py-24 sm:px-10"
    >
      {/* Static final-plate still — no scrub, no motion */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/media/hero/plate-still.jpg)" }}
        role="img"
        aria-label="Chef finalizing a plate at the pass"
      />
      <div className="absolute inset-0 bg-[var(--ink)]/72" />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)] via-[var(--ink)]/50 to-[var(--ink)]/40" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)",
          backgroundSize: "22px 22px",
        }}
      />

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--ember)]">
          Ready when you are
        </p>
        <h2 className="font-display mt-5 text-[clamp(2.6rem,7vw,4.75rem)] font-medium leading-[1.02] tracking-[-0.02em] text-white">
          One brain.
          <br />
          Your whole kitchen.
        </h2>
        <p className="mt-6 max-w-md text-[15px] leading-relaxed text-white/60 sm:text-[17px]">
          Inventory photos, labor schedules, staff chat, and demand foresight—running
          while your chefs stay on the pass.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:gap-5">
          <a
            href="https://calendly.com/uptisement/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center justify-center bg-[var(--ember)] px-10 font-mono text-[12px] uppercase tracking-[0.18em] text-[var(--ink)] transition-colors hover:bg-[var(--ember-hot)]"
          >
            Book a 30-min demo
          </a>
          <a
            href="#pricing"
            className="inline-flex h-12 items-center justify-center border border-white/25 px-8 font-mono text-[12px] uppercase tracking-[0.18em] text-white transition-colors hover:border-white hover:bg-white hover:text-[var(--ink)]"
          >
            See pricing
          </a>
        </div>

        <p className="mt-10 font-mono text-[11px] tracking-wide text-white/30">
          No per-seat tax on your line cooks · Start at one location
        </p>
      </div>
    </section>
  );
}
