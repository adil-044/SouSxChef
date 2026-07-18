"use client";

import { PROOF_QUOTES, PRICING_TIERS } from "@/lib/chapters";
import { SynapseXLogo } from "../ui/SynapseXLogo";

const AGENTS = [
  {
    tag: "01",
    title: "Inventory",
    line: "Photo in. Count out.",
    body: "Snap the walk-in. The agent reads shelves, flags lows, and keeps the dashboard honest.",
  },
  {
    tag: "02",
    title: "Labor",
    line: "Staff for the rush you’ll have.",
    body: "Drafts coverage from your history so labor tracks covers—not Sunday-night guesswork.",
  },
  {
    tag: "03",
    title: "Chat",
    line: "Answers over WhatsApp & SMS.",
    body: "“How much salmon left?” Staff ask the kitchen brain. You stop being the human FAQ.",
  },
  {
    tag: "04",
    title: "Forecast",
    line: "Buy for the week ahead.",
    body: "Demand hints before over-prep and dead stock. Protect margin on the nights that hit.",
  },
];

const STATS = [
  { n: "20+", l: "fewer nightly inventory texts" },
  { n: "~18%", l: "less protein over-order*" },
  { n: "SMS", l: "native staff channel" },
  { n: "1", l: "brain for the whole house" },
];

export function AfterWalkthrough() {
  return (
    <div className="relative z-20 w-full bg-[var(--ink)] text-center">
      {/* CTA */}
      <section
        id="cta"
        className="relative flex min-h-[100svh] w-full items-center justify-center overflow-hidden"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(/media/hero/plate-still.jpg)" }}
        />
        <div className="absolute inset-0 bg-[var(--ink)]/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)] via-[var(--ink)]/50 to-[var(--ink)]/40" />

        <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center px-6 py-24 sm:px-10">
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--ember)]">
            Ready when you are
          </p>
          <h2 className="font-display mt-5 text-[clamp(2.6rem,7vw,4.75rem)] font-medium leading-[1.02] tracking-[-0.02em] text-white">
            One brain.
            <br />
            Your whole kitchen.
          </h2>
          <p className="mx-auto mt-6 max-w-md text-[15px] leading-relaxed text-white/60 sm:text-[17px]">
            Inventory, labor, staff chat, and demand foresight—running while chefs stay on the
            pass.
          </p>
          <div className="mt-10 flex w-full flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <a
              href="https://calendly.com/uptisement/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 w-full max-w-xs items-center justify-center bg-[var(--ember)] px-8 font-mono text-[12px] uppercase tracking-[0.16em] text-[var(--ink)] transition-colors hover:bg-[var(--ember-hot)] sm:w-auto"
            >
              Book a demo
            </a>
            <a
              href="#pricing"
              className="inline-flex h-12 w-full max-w-xs items-center justify-center border border-white/30 px-8 font-mono text-[12px] uppercase tracking-[0.16em] text-white transition-colors hover:bg-white hover:text-[var(--ink)] sm:w-auto"
            >
              See pricing
            </a>
          </div>
        </div>
      </section>

      {/* Agents — 2×2 centered grid */}
      <section id="agents" className="w-full border-t border-white/10 px-6 py-24 sm:px-10 md:py-32">
        <div className="mx-auto w-full max-w-5xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--ember)]">
            The agents
          </p>
          <h2 className="font-display mx-auto mt-4 max-w-[18ch] text-[clamp(2.2rem,5vw,3.75rem)] font-medium leading-[1.05] text-white">
            Four specialists. One kitchen brain.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-white/55">
            SousXChef watches inventory, labor, and demand—and talks to your team where they
            already live: their phones.
          </p>

          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
            {AGENTS.map((a) => (
              <article
                key={a.tag}
                className="flex flex-col items-center border border-white/12 px-8 py-10 text-center"
              >
                <span className="font-mono text-[11px] tracking-[0.2em] text-[var(--ember)]">
                  {a.tag}
                </span>
                <h3 className="font-display mt-4 text-[2rem] leading-tight text-white">{a.title}</h3>
                <p className="mt-2 text-[14px] text-white/50">{a.line}</p>
                <p className="mt-4 max-w-sm text-[14px] leading-relaxed text-white/60 sm:text-[15px]">
                  {a.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Proof */}
      <section
        id="proof"
        className="w-full border-t border-white/10 bg-[var(--steel)] px-6 py-24 sm:px-10 md:py-32"
      >
        <div className="mx-auto w-full max-w-5xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--ember)]">
            From the floor
          </p>
          <h2 className="font-display mx-auto mt-4 max-w-[16ch] text-[clamp(2.2rem,5vw,3.5rem)] font-medium leading-[1.05] text-white">
            Built for people who live service.
          </h2>

          <div className="mt-16 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
            {PROOF_QUOTES.map((q) => (
              <blockquote
                key={q.name}
                className="flex flex-col items-center border-t border-white/15 pt-8 text-center"
              >
                <p className="font-display text-[1.25rem] leading-snug text-white/90 sm:text-[1.35rem]">
                  “{q.quote}”
                </p>
                <footer className="mt-8">
                  <cite className="not-italic">
                    <span className="block text-[14px] font-medium text-white">{q.name}</span>
                    <span className="mt-1 block font-mono text-[11px] text-white/40">{q.role}</span>
                  </cite>
                </footer>
              </blockquote>
            ))}
          </div>

          <div className="mx-auto mt-20 grid max-w-4xl grid-cols-2 gap-x-6 gap-y-10 border-t border-white/10 pt-14 sm:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.l} className="flex flex-col items-center">
                <p className="font-display text-[2.5rem] leading-none text-[var(--ember)] sm:text-[2.75rem]">
                  {s.n}
                </p>
                <p className="mt-3 max-w-[12ch] text-[12px] leading-snug text-white/45">{s.l}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 font-mono text-[10px] text-white/25">
            *Early customer range — results vary by volume and menu.
          </p>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="w-full border-t border-white/10 px-6 py-24 sm:px-10 md:py-32">
        <div className="mx-auto w-full max-w-5xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--ember)]">
            Pricing
          </p>
          <h2 className="font-display mx-auto mt-4 text-[clamp(2.2rem,5vw,3.5rem)] font-medium text-white">
            Clear plates. Clear pricing.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-[15px] text-white/55">
            Start with one location. Expand when the agents earn their keep.
          </p>

          <div className="mt-16 grid grid-cols-1 items-stretch gap-5 lg:grid-cols-3">
            {PRICING_TIERS.map((tier) => (
              <article
                key={tier.name}
                className={`mx-auto flex w-full max-w-md flex-col items-center px-8 py-10 text-center lg:max-w-none ${
                  tier.featured
                    ? "bg-[var(--ember)] text-[var(--ink)]"
                    : "border border-white/15 text-white"
                }`}
              >
                <div className="flex w-full flex-col items-center">
                  {tier.featured && (
                    <span className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] opacity-70">
                      Most kitchens
                    </span>
                  )}
                  <h3 className="font-display text-[1.85rem]">{tier.name}</h3>
                  <p className="mt-5 flex items-baseline justify-center gap-1">
                    <span className="font-display text-[3rem] leading-none">{tier.price}</span>
                    {tier.period && (
                      <span
                        className={`font-mono text-[12px] ${tier.featured ? "opacity-60" : "text-white/40"}`}
                      >
                        {tier.period}
                      </span>
                    )}
                  </p>
                  <p
                    className={`mt-4 max-w-xs text-[14px] leading-relaxed ${
                      tier.featured ? "opacity-75" : "text-white/50"
                    }`}
                  >
                    {tier.blurb}
                  </p>
                </div>
                <ul className="mt-8 flex w-full flex-1 flex-col items-center gap-2.5">
                  {tier.features.map((f) => (
                    <li
                      key={f}
                      className={`max-w-xs text-[13px] ${tier.featured ? "opacity-85" : "text-white/70"}`}
                    >
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="https://calendly.com/uptisement/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-9 inline-flex h-11 w-full max-w-[220px] items-center justify-center px-5 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors ${
                    tier.featured
                      ? "bg-[var(--ink)] text-white hover:bg-black"
                      : "border border-white/25 hover:bg-white hover:text-[var(--ink)]"
                  }`}
                >
                  {tier.cta}
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="w-full border-t border-white/10 bg-[var(--steel)]">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center px-6 py-16 sm:px-10 md:py-20">
          <div className="flex items-center justify-center gap-2">
            <SynapseXLogo className="h-4 w-4 text-[var(--ember)]" />
            <span className="font-mono text-[13px] text-white/80">SousXChef</span>
          </div>
          <p className="mx-auto mt-6 max-w-md text-[14px] leading-relaxed text-white/45">
            AI agents for restaurant inventory, labor scheduling, staff chat, and demand
            forecasting.
          </p>
          <a
            href="https://calendly.com/uptisement/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex h-11 items-center justify-center bg-[var(--ember)] px-8 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--ink)] hover:bg-[var(--ember-hot)]"
          >
            Book a demo
          </a>
          <p className="mt-10 font-mono text-[11px] text-white/30">
            © {new Date().getFullYear()} SousXChef
          </p>
        </div>
      </footer>
    </div>
  );
}
