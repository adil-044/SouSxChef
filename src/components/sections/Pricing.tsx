"use client";

import { PRICING_TIERS } from "@/lib/chapters";

export function Pricing() {
  return (
    <section id="pricing" className="relative bg-[var(--ink)] px-5 py-24 sm:px-10 md:px-16 md:py-32">
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--ember)]">
          Pricing
        </p>
        <h2 className="font-display mt-4 max-w-[14ch] text-[clamp(2.2rem,5vw,3.75rem)] font-medium leading-[1.05] text-white">
          Clear plates. Clear pricing.
        </h2>
        <p className="mt-5 max-w-lg text-[15px] text-white/55">
          Start with one location. Expand when the agents earn their keep. No per-seat tax on your
          line cooks.
        </p>

        <div className="mt-16 grid gap-4 lg:grid-cols-3">
          {PRICING_TIERS.map((tier) => (
            <article
              key={tier.name}
              className={`flex flex-col border p-8 sm:p-10 ${
                tier.featured
                  ? "border-[var(--ember)] bg-[var(--steel)]"
                  : "border-white/12 bg-transparent"
              }`}
            >
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-display text-[1.75rem] text-white">{tier.name}</h3>
                {tier.featured && (
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--ember)]">
                    Most kitchens
                  </span>
                )}
              </div>
              <p className="mt-6 flex items-baseline gap-1">
                <span className="font-display text-[3rem] leading-none text-white">{tier.price}</span>
                {tier.period && (
                  <span className="font-mono text-[12px] text-white/40">{tier.period}</span>
                )}
              </p>
              <p className="mt-4 text-[14px] leading-relaxed text-white/50">{tier.blurb}</p>
              <ul className="mt-8 flex flex-1 flex-col gap-3">
                {tier.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-3 text-[13px] text-white/70 sm:text-[14px]"
                  >
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[var(--ember)]" />
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="https://calendly.com/uptisement/30min"
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-10 inline-flex h-12 items-center justify-center px-6 font-mono text-[12px] uppercase tracking-[0.18em] transition-colors ${
                  tier.featured
                    ? "bg-[var(--ember)] text-[var(--ink)] hover:bg-[var(--ember-hot)]"
                    : "border border-white/25 text-white hover:border-white hover:bg-white hover:text-[var(--ink)]"
                }`}
              >
                {tier.cta}
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
