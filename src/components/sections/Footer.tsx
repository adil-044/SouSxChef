"use client";

import { SynapseXLogo } from "../ui/SynapseXLogo";

export function Footer() {
  return (
    <footer id="contact" className="relative overflow-hidden bg-[var(--steel)]">
      <div className="relative mx-auto grid max-w-6xl gap-0 lg:grid-cols-2">
        <div className="relative min-h-[320px] lg:min-h-[480px]">
          <video
            src="/media/hero/showcase.mp4"
            className="absolute inset-0 h-full w-full object-cover opacity-70"
            autoPlay
            playsInline
            muted
            loop
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[var(--steel)]/80 max-lg:bg-gradient-to-t max-lg:from-[var(--steel)] max-lg:to-transparent" />
        </div>

        <div className="flex flex-col justify-between px-5 py-16 sm:px-10 md:px-14 md:py-20">
          <div>
            <div className="flex items-center gap-2">
              <SynapseXLogo className="h-4 w-4 text-[var(--ember)]" />
              <span className="font-mono text-[13px] tracking-tight text-white/80">SousXChef</span>
            </div>
            <h2 className="font-display mt-8 max-w-[12ch] text-[clamp(2.4rem,5vw,3.5rem)] font-medium leading-[1.05] text-white">
              Ready for a quieter service?
            </h2>
            <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-white/50">
              Book a 30-minute walkthrough. We map your inventory and labor pain, then show the
              agents live on a kitchen that looks like yours.
            </p>
            <a
              href="https://calendly.com/uptisement/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 inline-flex h-12 items-center justify-center bg-[var(--ember)] px-8 font-mono text-[12px] uppercase tracking-[0.18em] text-[var(--ink)] transition-colors hover:bg-[var(--ember-hot)]"
            >
              Book a demo
            </a>
          </div>

          <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-end sm:justify-between">
            <p className="max-w-xs text-[13px] leading-relaxed text-white/35">
              AI agents for restaurant inventory, labor scheduling, staff chat, and demand
              forecasting.
            </p>
            <p className="font-mono text-[11px] text-white/25">
              © {new Date().getFullYear()} SousXChef
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
