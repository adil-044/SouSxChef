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

/** Everything after the pinned walkthrough — solid, readable, no opacity traps */
export function AfterWalkthrough() {
  return (
    <div className="relative z-20 bg-[var(--ink)]">
      {/* Static CTA — plate still, full viewport, clear hierarchy */}
      <section
        id="cta"
        className="relative flex min-h-[100svh] items-end overflow-hidden border-t border-white/10"
      >
        <div
          className="absolute inset-0 scale-105 bg-cover bg-center"
          style={{ backgroundImage: "url(/media/hero/plate-still.jpg)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)] via-[var(--ink)]/75 to-[var(--ink)]/35" />

        <div className="relative z-10 w-full px-5 pb-16 pt-32 sm:px-10 sm:pb-20 md:px-16">
          <div className="mx-auto flex max-w-6xl flex-col gap-10 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--ember)]">
                After the walkthrough
              </p>
              <h2 className="font-display mt-4 text-[clamp(2.5rem,6vw,4.5rem)] font-medium leading-[1.02] text-white">
                One brain.
                <br />
                Your whole kitchen.
              </h2>
              <p className="mt-5 max-w-md text-[15px] leading-relaxed text-white/60 sm:text-[16px]">
                Inventory, labor, staff chat, and demand foresight—running while chefs stay on the
                pass.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href="https://calendly.com/uptisement/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center bg-[var(--ember)] px-8 font-mono text-[12px] uppercase tracking-[0.16em] text-[var(--ink)] transition-colors hover:bg-[var(--ember-hot)]"
              >
                Book a demo
              </a>
              <a
                href="#pricing"
                className="inline-flex h-12 items-center justify-center border border-white/30 px-8 font-mono text-[12px] uppercase tracking-[0.16em] text-white transition-colors hover:bg-white hover:text-[var(--ink)]"
              >
                See pricing
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Agents */}
      <section id="agents" className="border-t border-white/10 px-5 py-20 sm:px-10 md:px-16 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--ember)]">
              The agents
            </p>
            <h2 className="font-display mt-3 text-[clamp(2rem,4.5vw,3.5rem)] font-medium leading-[1.05] text-white">
              Four specialists. One kitchen brain.
            </h2>
          </div>

          <ul className="mt-14 divide-y divide-white/10 border-y border-white/10">
            {AGENTS.map((a) => (
              <li
                key={a.tag}
                className="grid gap-4 py-8 sm:grid-cols-[4rem_1fr_1.2fr] sm:items-baseline sm:gap-8 md:py-10"
              >
                <span className="font-mono text-[12px] text-[var(--ember)]">{a.tag}</span>
                <div>
                  <h3 className="font-display text-[1.65rem] text-white sm:text-[1.85rem]">
                    {a.title}
                  </h3>
                  <p className="mt-1 text-[14px] text-white/50">{a.line}</p>
                </div>
                <p className="text-[14px] leading-relaxed text-white/55 sm:text-[15px]">{a.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Proof */}
      <section
        id="proof"
        className="border-t border-white/10 bg-[var(--steel)] px-5 py-20 sm:px-10 md:px-16 md:py-28"
      >
        <div className="mx-auto max-w-6xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--ember)]">
            From the floor
          </p>
          <h2 className="font-display mt-3 max-w-[16ch] text-[clamp(2rem,4.5vw,3.25rem)] font-medium leading-[1.05] text-white">
            Built for people who live service.
          </h2>

          <div className="mt-14 grid gap-12 md:grid-cols-3 md:gap-10">
            {PROOF_QUOTES.map((q) => (
              <blockquote key={q.name} className="border-t border-white/15 pt-6">
                <p className="font-display text-[1.25rem] leading-snug text-white/90 sm:text-[1.4rem]">
                  “{q.quote}”
                </p>
                <footer className="mt-6">
                  <cite className="not-italic">
                    <span className="block text-[14px] text-white">{q.name}</span>
                    <span className="mt-1 block font-mono text-[11px] text-white/40">{q.role}</span>
                  </cite>
                </footer>
              </blockquote>
            ))}
          </div>

          <div className="mt-16 grid grid-cols-2 gap-8 border-t border-white/10 pt-12 sm:grid-cols-4">
            {[
              { n: "20+", l: "fewer nightly inventory texts" },
              { n: "~18%", l: "less protein over-order*" },
              { n: "SMS", l: "native staff channel" },
              { n: "1", l: "brain for the whole house" },
            ].map((s) => (
              <div key={s.l}>
                <p className="font-display text-[2.4rem] leading-none text-[var(--ember)] sm:text-[2.75rem]">
                  {s.n}
                </p>
                <p className="mt-2 text-[12px] text-white/45">{s.l}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 font-mono text-[10px] text-white/25">
            *Early customer range — results vary by volume and menu.
          </p>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-t border-white/10 px-5 py-20 sm:px-10 md:px-16 md:py-28">
        <div className="mx-auto max-w-6xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--ember)]">
            Pricing
          </p>
          <h2 className="font-display mt-3 text-[clamp(2rem,4.5vw,3.25rem)] font-medium text-white">
            Clear plates. Clear pricing.
          </h2>
          <p className="mt-4 max-w-lg text-[15px] text-white/55">
            Start with one location. Expand when the agents earn their keep.
          </p>

          <div className="mt-14 grid gap-4 lg:grid-cols-3">
            {PRICING_TIERS.map((tier) => (
              <article
                key={tier.name}
                className={`flex flex-col p-8 sm:p-9 ${
                  tier.featured
                    ? "bg-[var(--ember)] text-[var(--ink)]"
                    : "border border-white/15 bg-transparent text-white"
                }`}
              >
                <div className="flex items-baseline justify-between">
                  <h3 className="font-display text-[1.75rem]">{tier.name}</h3>
                  {tier.featured && (
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] opacity-70">
                      Popular
                    </span>
                  )}
                </div>
                <p className="mt-5 flex items-baseline gap-1">
                  <span className="font-display text-[2.75rem] leading-none">{tier.price}</span>
                  {tier.period && (
                    <span
                      className={`font-mono text-[12px] ${tier.featured ? "opacity-60" : "text-white/40"}`}
                    >
                      {tier.period}
                    </span>
                  )}
                </p>
                <p
                  className={`mt-4 text-[14px] leading-relaxed ${tier.featured ? "opacity-75" : "text-white/50"}`}
                >
                  {tier.blurb}
                </p>
                <ul className="mt-7 flex flex-1 flex-col gap-2.5">
                  {tier.features.map((f) => (
                    <li
                      key={f}
                      className={`text-[13px] ${tier.featured ? "opacity-85" : "text-white/70"}`}
                    >
                      — {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="https://calendly.com/uptisement/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-9 inline-flex h-11 items-center justify-center px-5 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors ${
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
      <footer id="contact" className="border-t border-white/10 bg-[var(--steel)]">
        <div className="mx-auto flex max-w-6xl flex-col gap-12 px-5 py-16 sm:px-10 md:flex-row md:items-end md:justify-between md:px-16 md:py-20">
          <div>
            <div className="flex items-center gap-2">
              <SynapseXLogo className="h-4 w-4 text-[var(--ember)]" />
              <span className="font-mono text-[13px] text-white/80">SousXChef</span>
            </div>
            <p className="mt-6 max-w-sm text-[14px] leading-relaxed text-white/45">
              AI agents for restaurant inventory, labor scheduling, staff chat, and demand
              forecasting.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <a
              href="https://calendly.com/uptisement/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center justify-center bg-[var(--ember)] px-7 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--ink)] hover:bg-[var(--ember-hot)]"
            >
              Book a demo
            </a>
            <p className="font-mono text-[11px] text-white/30">
              © {new Date().getFullYear()} SousXChef
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
