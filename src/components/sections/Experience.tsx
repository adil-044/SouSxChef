"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CHAPTERS } from "@/lib/chapters";

gsap.registerPlugin(ScrollTrigger);

const VIDEO_DURATION = 10;

/**
 * CSS sticky stage (no GSAP pin) so sections below aren't crushed by pin-spacers.
 * Scroll distance drives video scrub + chapter text timelines.
 */
export function Experience({ onReady }: { onReady?: () => void }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const veilKitchen = useRef<HTMLDivElement>(null);
  const veilVoid = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let done = false;

    const markReady = () => {
      if (done) return;
      done = true;
      setReady(true);
      onReady?.();
    };

    if (video.readyState >= 1) markReady();
    else video.addEventListener("loadedmetadata", markReady, { once: true });
    const fallback = window.setTimeout(markReady, 1200);

    video.muted = true;
    video.playsInline = true;
    video.pause();
    video.currentTime = 0;

    return () => {
      window.clearTimeout(fallback);
      video.removeEventListener("loadedmetadata", markReady);
    };
  }, [onReady]);

  useEffect(() => {
    const track = trackRef.current;
    const video = videoRef.current;
    if (!track || !video || !ready) return;

    const ctx = gsap.context(() => {
      const chapters = gsap.utils.toArray<HTMLElement>("[data-chapter]");

      // Prepare text layers for scrub animation
      chapters.forEach((el) => {
        const eyebrow = el.querySelector("[data-anim='eyebrow']");
        const title = el.querySelector("[data-anim='title']");
        const body = el.querySelector("[data-anim='body']");
        gsap.set(el, { autoAlpha: 0 });
        gsap.set([eyebrow, title, body].filter(Boolean), {
          autoAlpha: 0,
          y: 36,
          filter: "blur(8px)",
        });
      });

      // Show first beat immediately
      const first = chapters[0];
      if (first) {
        gsap.set(first, { autoAlpha: 1 });
        gsap.set(first.querySelectorAll("[data-anim]"), {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
        });
      }

      ScrollTrigger.create({
        trigger: track,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.45,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const duration =
            video.duration && Number.isFinite(video.duration)
              ? video.duration
              : VIDEO_DURATION;
          const t = self.progress * duration * 0.999;
          if (Math.abs(video.currentTime - t) > 0.025) {
            video.currentTime = t;
          }

          let idx = 0;
          for (let i = 0; i < CHAPTERS.length; i++) {
            if (self.progress >= CHAPTERS[i].from) idx = i;
          }
          if (idx !== activeRef.current) {
            activeRef.current = idx;
            setActive(idx);
          }

          const mood = CHAPTERS[idx]?.mood ?? "kitchen";
          if (veilKitchen.current && veilVoid.current) {
            gsap.set(veilKitchen.current, {
              autoAlpha: mood === "void" ? 0.4 : 1,
            });
            gsap.set(veilVoid.current, {
              autoAlpha: mood === "void" ? 0.7 : 0,
            });
          }

          chapters.forEach((el, i) => {
            const c = CHAPTERS[i];
            const mid = (c.from + c.to) / 2;
            const half = Math.max((c.to - c.from) / 2, 0.04);
            const dist = Math.abs(self.progress - mid);
            // Peak at beat center; soft crossfade between neighbors
            const visibility = gsap.utils.clamp(0, 1, 1 - dist / (half * 1.05));
            const signed = (self.progress - mid) / half;
            const y = signed * -32;
            const blur = (1 - visibility) * 10;

            gsap.set(el, { autoAlpha: visibility });

            const eyebrow = el.querySelector("[data-anim='eyebrow']");
            const title = el.querySelector("[data-anim='title']");
            const body = el.querySelector("[data-anim='body']");

            // Staggered scrub: eyebrow leads, body trails
            const apply = (node: Element | null, lag: number) => {
              if (!node) return;
              const v = gsap.utils.clamp(0, 1, visibility * 1.2 - lag);
              gsap.set(node, {
                autoAlpha: v,
                y: y + (1 - v) * 18,
                filter: `blur(${blur * (1 - v * 0.35)}px)`,
              });
            };
            apply(eyebrow, 0);
            apply(title, 0.1);
            apply(body, 0.2);
          });
        },
      });

      // Refresh after layout settles (fonts / video)
      requestAnimationFrame(() => ScrollTrigger.refresh());
    }, track);

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      ctx.revert();
    };
  }, [ready]);

  return (
    <section
      id="experience"
      ref={trackRef}
      className="relative z-0 w-full"
      style={{ height: `${CHAPTERS.length * 100}vh` }}
    >
      {/* Sticky stage — leaves normal document flow for everything below */}
      <div
        ref={stageRef}
        className="sticky top-0 z-0 h-[100dvh] w-full overflow-hidden bg-[var(--ink)]"
      >
        <video
          ref={videoRef}
          src="/media/hero/showcase.mp4"
          className="absolute inset-0 h-full w-full object-cover"
          playsInline
          muted
          preload="auto"
          aria-hidden
        />

        <div ref={veilKitchen} className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_18%,rgba(8,8,8,0.5)_68%,rgba(8,8,8,0.88)_100%)]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)] via-transparent to-[var(--ink)]/45" />
        </div>

        <div
          ref={veilVoid}
          className="pointer-events-none absolute inset-0 opacity-0"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.75) 100%)",
          }}
        />

        <div
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)",
            backgroundSize: "22px 22px",
          }}
        />

        <div className="absolute right-4 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-2.5 sm:right-8 md:flex">
          {CHAPTERS.map((c, i) => (
            <div key={c.id} className="flex items-center gap-3">
              <span
                className={`font-mono text-[9px] tracking-[0.16em] transition-colors duration-300 ${
                  i === active ? "text-[var(--ember)]" : "text-white/20"
                }`}
              >
                0:{String(c.t0).padStart(2, "0")}
              </span>
              <span
                className={`h-px transition-all duration-300 ${
                  i === active ? "w-7 bg-[var(--ember)]" : "w-3 bg-white/15"
                }`}
              />
            </div>
          ))}
        </div>

        <div className="absolute inset-0 z-10">
          {CHAPTERS.map((c) => (
            <article
              key={c.id}
              data-chapter
              className={`absolute inset-x-5 bottom-16 top-28 flex flex-col justify-end will-change-transform sm:inset-x-10 sm:bottom-20 md:inset-x-16 ${
                c.align === "right"
                  ? "items-end text-right"
                  : c.align === "center"
                    ? "items-center text-center"
                    : "items-start text-left"
              }`}
            >
              <p
                data-anim="eyebrow"
                className="mb-3 font-mono text-[10px] uppercase tracking-[0.26em] text-[var(--ember)] sm:text-[11px]"
              >
                {c.eyebrow}
              </p>
              <h2
                data-anim="title"
                className="font-display max-w-[15ch] whitespace-pre-line text-[clamp(2.1rem,6.5vw,4.75rem)] font-medium leading-[0.96] tracking-[-0.02em] text-white"
              >
                {c.title}
              </h2>
              <p
                data-anim="body"
                className={`mt-4 max-w-md text-[14px] leading-relaxed text-white/65 sm:mt-5 sm:text-[16px] ${
                  c.align === "center" ? "mx-auto" : ""
                }`}
              >
                {c.body}
              </p>
            </article>
          ))}
        </div>

        <div
          className={`pointer-events-none absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2 transition-opacity duration-500 ${
            active === 0 ? "opacity-70" : "opacity-0"
          }`}
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/50">
            Scroll the walkthrough
          </span>
          <span className="block h-8 w-px animate-pulse bg-white/40" />
        </div>
      </div>
    </section>
  );
}
