"use client";

import { useEffect, useState } from "react";

type Props = {
  done: boolean;
  /** Min time on screen so it doesn't flash (ms) */
  minMs?: number;
};

/**
 * First-paint gate for the immersive home.
 * Covers the FOUC where every walkthrough chapter stacks before GSAP.
 */
export function PageLoader({ done, minMs = 700 }: Props) {
  const [minElapsed, setMinElapsed] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setMinElapsed(true), minMs);
    return () => window.clearTimeout(t);
  }, [minMs]);

  useEffect(() => {
    if (!done || !minElapsed || exiting || gone) return;
    setExiting(true);
    const t = window.setTimeout(() => setGone(true), 520);
    return () => window.clearTimeout(t);
  }, [done, minElapsed, exiting, gone]);

  useEffect(() => {
    if (gone) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [gone]);

  if (gone) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[var(--ink)] transition-opacity duration-500 ease-out ${
        exiting ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      aria-busy={!done}
      aria-live="polite"
      role="status"
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-[var(--ember)]">
        SousXChef
      </p>
      <p className="font-display mt-5 text-[clamp(1.75rem,4vw,2.5rem)] font-medium tracking-[-0.02em] text-white text-balance">
        Opening the kitchen
      </p>
      <div className="mt-10 h-px w-28 overflow-hidden bg-white/10">
        <div
          className="h-full w-full origin-left bg-[var(--ember)]"
          style={{
            animation: exiting
              ? "none"
              : "sx-loader-bar 1.1s ease-in-out infinite",
            transform: exiting ? "scaleX(1)" : undefined,
          }}
        />
      </div>
      <span className="sr-only">Loading walkthrough</span>
    </div>
  );
}
