"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CHAPTERS } from "@/lib/chapters";

gsap.registerPlugin(ScrollTrigger);

const VIDEO_DURATION = 10;

export function Experience({ onReady }: { onReady?: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
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
    const playPromise = video.play();
    if (playPromise?.then) {
      playPromise
        .then(() => {
          video.pause();
          video.currentTime = 0;
        })
        .catch(() => {});
    }

    return () => {
      window.clearTimeout(fallback);
      video.removeEventListener("loadedmetadata", markReady);
    };
  }, [onReady]);

  useEffect(() => {
    const root = rootRef.current;
    const pin = pinRef.current;
    const video = videoRef.current;
    if (!root || !pin || !video || !ready) return;

    const ctx = gsap.context(() => {
      const chapters = gsap.utils.toArray<HTMLElement>("[data-chapter]");

      ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: "bottom bottom",
        pin: pin,
        scrub: 0.55,
        anticipatePin: 1,
        onUpdate: (self) => {
          const duration =
            video.duration && Number.isFinite(video.duration)
              ? video.duration
              : VIDEO_DURATION;
          const t = self.progress * duration * 0.999;
          if (Math.abs(video.currentTime - t) > 0.03) {
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
              opacity: mood === "void" ? 0.35 : 1,
            });
            gsap.set(veilVoid.current, {
              opacity: mood === "void" ? 0.55 : 0,
            });
          }

          chapters.forEach((el, i) => {
            const c = CHAPTERS[i];
            const mid = (c.from + c.to) / 2;
            const half = Math.max((c.to - c.from) / 2, 0.035);
            const dist = Math.abs(self.progress - mid);
            const opacity = gsap.utils.clamp(0, 1, 1 - dist / (half * 1.35));
            const y = (self.progress - mid) * -28;
            gsap.set(el, {
              opacity,
              y,
              pointerEvents: opacity > 0.4 ? "auto" : "none",
            });
          });
        },
      });
    }, root);

    return () => ctx.revert();
  }, [ready]);

  return (
    <section
      id="experience"
      ref={rootRef}
      className="relative"
      style={{ height: `${CHAPTERS.length * 90}vh` }}
    >
      <div
        ref={pinRef}
        className="relative h-[100dvh] w-full overflow-hidden bg-[var(--ink)]"
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

        <div
          ref={veilKitchen}
          className="pointer-events-none absolute inset-0 transition-opacity"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_18%,rgba(8,8,8,0.5)_68%,rgba(8,8,8,0.88)_100%)]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)] via-transparent to-[var(--ink)]/45" />
        </div>

        {/* Softer edge vignette for black-void macros so produce/protein stay hero */}
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

        {/* Timecode + beat rail */}
        <div className="absolute right-4 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-2.5 sm:right-8 md:flex">
          {CHAPTERS.map((c, i) => (
            <div key={c.id} className="flex items-center gap-3">
              <span
                className={`font-mono text-[9px] tracking-[0.16em] transition-colors duration-400 ${
                  i === active ? "text-[var(--ember)]" : "text-white/20"
                }`}
              >
                0:{String(c.t0).padStart(2, "0")}
              </span>
              <span
                className={`h-px transition-all duration-400 ${
                  i === active ? "w-7 bg-[var(--ember)]" : "w-3 bg-white/15"
                }`}
              />
            </div>
          ))}
        </div>

        <div className="absolute inset-0 z-10">
          {CHAPTERS.map((c, i) => (
            <article
              key={c.id}
              data-chapter
              className={`absolute inset-x-5 bottom-16 top-28 flex flex-col justify-end sm:inset-x-10 sm:bottom-20 md:inset-x-16 ${
                c.align === "right"
                  ? "items-end text-right"
                  : c.align === "center"
                    ? "items-center text-center"
                    : "items-start text-left"
              }`}
              style={{ opacity: i === 0 ? 1 : 0 }}
            >
              <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.26em] text-[var(--ember)] sm:text-[11px]">
                {c.eyebrow}
              </p>
              <h2 className="font-display max-w-[15ch] whitespace-pre-line text-[clamp(2.1rem,6.5vw,4.75rem)] font-medium leading-[0.96] tracking-[-0.02em] text-white">
                {c.title}
              </h2>
              <p
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
          className={`pointer-events-none absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2 transition-opacity duration-700 ${
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
