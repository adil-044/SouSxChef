"use client";

import { PROOF_QUOTES } from "@/lib/chapters";
import { useSectionReveal } from "@/hooks/useSectionReveal";

const AGENTS = [
  {
    tag: "01 — Inventory",
    title: "Photo in. Count out.",
    body: "Snap the walk-in or dry storage. The inventory agent reads shelves, flags lows, and keeps the owner dashboard honest.",
  },
  {
    tag: "02 — Labor",
    title: "Staff for the rush you will have.",
    body: "Busy Friday? Slow Tuesday? The scheduling agent drafts coverage from your history so labor cost tracks covers—not guesswork.",
  },
  {
    tag: "03 — Chat",
    title: "Answers over WhatsApp & SMS.",
    body: "“How much salmon left?” “Who closes Thursday?” Staff ask the kitchen brain. You stop being the human FAQ.",
  },
  {
    tag: "04 — Forecast",
    title: "Buy for the week ahead.",
    body: "Demand hints surface before over-prep and dead stock. Push a promo on soft nights. Protect margin on the ones that hit.",
  },
];

export function Agents() {
  const ref = useSectionReveal<HTMLElement>();

  return (
    <section
      id="agents"
      ref={ref}
      className="relative z-10 bg-[var(--ink)] px-5 py-24 sm:px-10 md:px-16 md:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <p
          data-reveal
          className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--ember)]"
        >
          The agents
        </p>
        <h2
          data-reveal
          className="font-display mt-4 max-w-[18ch] text-[clamp(2.2rem,5vw,4rem)] font-medium leading-[1.05] tracking-[-0.02em] text-white"
        >
          Four specialists. One kitchen brain.
        </h2>
        <p
          data-reveal
          className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/55 sm:text-[16px]"
        >
          SousXChef is not another dashboard you ignore. It is a set of agents that watch inventory,
          labor, and demand—and talk to your team where they already live: their phones.
        </p>

        <div className="mt-16 grid gap-px bg-white/10 sm:grid-cols-2">
          {AGENTS.map((a) => (
            <article
              key={a.tag}
              data-reveal
              className="group bg-[var(--ink)] p-8 transition-colors duration-500 hover:bg-[var(--steel)] sm:p-10"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/35 group-hover:text-[var(--ember)]">
                {a.tag}
              </p>
              <h3 className="font-display mt-4 text-[1.75rem] leading-tight text-white sm:text-[2rem]">
                {a.title}
              </h3>
              <p className="mt-3 max-w-sm text-[14px] leading-relaxed text-white/50 sm:text-[15px]">
                {a.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Proof() {
  const ref = useSectionReveal<HTMLElement>();

  return (
    <section
      id="proof"
      ref={ref}
      className="relative z-10 overflow-hidden bg-[var(--steel)] px-5 py-24 sm:px-10 md:px-16 md:py-32"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(90deg, #fff 1px, transparent 1px), linear-gradient(#fff 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      <div className="relative mx-auto max-w-6xl">
        <p
          data-reveal
          className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--ember)]"
        >
          From the floor
        </p>
        <h2
          data-reveal
          className="font-display mt-4 max-w-[16ch] text-[clamp(2.2rem,5vw,3.75rem)] font-medium leading-[1.05] text-white"
        >
          Built for people who live service—not spreadsheets.
        </h2>

        <div className="mt-16 grid gap-10 md:grid-cols-3 md:gap-8">
          {PROOF_QUOTES.map((q) => (
            <blockquote
              key={q.name}
              data-reveal
              className="flex flex-col border-t border-white/15 pt-8"
            >
              <p className="font-display text-[1.35rem] leading-snug text-white/90 sm:text-[1.5rem]">
                “{q.quote}”
              </p>
              <footer className="mt-8">
                <cite className="not-italic">
                  <span className="block text-[14px] font-medium text-white">{q.name}</span>
                  <span className="mt-1 block font-mono text-[11px] tracking-wide text-white/40">
                    {q.role}
                  </span>
                </cite>
              </footer>
            </blockquote>
          ))}
        </div>

        <div
          data-reveal
          className="mt-20 grid grid-cols-2 gap-6 border-t border-white/10 pt-12 sm:grid-cols-4"
        >
          {[
            { n: "20+", l: "fewer nightly inventory texts" },
            { n: "~18%", l: "less protein over-order*" },
            { n: "SMS", l: "native staff channel" },
            { n: "1", l: "brain for the whole house" },
          ].map((s) => (
            <div key={s.l}>
              <p className="font-display text-[2.5rem] leading-none text-[var(--ember)] sm:text-[3rem]">
                {s.n}
              </p>
              <p className="mt-2 text-[12px] leading-snug text-white/45 sm:text-[13px]">{s.l}</p>
            </div>
          ))}
        </div>
        <p data-reveal className="mt-6 font-mono text-[10px] text-white/25">
          *Early customer range — results vary by volume and menu.
        </p>
      </div>
    </section>
  );
}
