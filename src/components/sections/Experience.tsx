"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CHAPTERS } from "@/lib/chapters";

gsap.registerPlugin(ScrollTrigger);

export function Experience({
  onReady,
}: {
  onReady?: () => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
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
        .catch(() => {
          /* autoplay blocked — scrub still works once metadata loads */
        });
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
        scrub: 0.65,
        anticipatePin: 1,
        onUpdate: (self) => {
          if (video.duration && Number.isFinite(video.duration)) {
            const t = self.progress * video.duration * 0.999;
            if (Math.abs(video.currentTime - t) > 0.04) {
              video.currentTime = t;
            }
          }

          let idx = 0;
          for (let i = 0; i < CHAPTERS.length; i++) {
            if (self.progress >= CHAPTERS[i].from) idx = i;
          }
          if (idx !== activeRef.current) {
            activeRef.current = idx;
            setActive(idx);
          }

          chapters.forEach((el, i) => {
            const c = CHAPTERS[i];
            const mid = (c.from + c.to) / 2;
            const half = Math.max((c.to - c.from) / 2, 0.04);
            const dist = Math.abs(self.progress - mid);
            const opacity = gsap.utils.clamp(0, 1, 1 - dist / (half * 1.2));
            const y = (self.progress - mid) * -36;
            gsap.set(el, {
              opacity,
              y,
              pointerEvents: opacity > 0.35 ? "auto" : "none",
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
      style={{ height: `${CHAPTERS.length * 100}vh` }}
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

        {/* Cinematic veils — keep copy readable without killing the plate */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(8,8,8,0.55)_70%,rgba(8,8,8,0.85)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--ink)] via-transparent to-[var(--ink)]/50" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)",
            backgroundSize: "22px 22px",
          }}
        />

        {/* Progress rail */}
        <div className="absolute right-4 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-3 sm:right-8 md:flex">
          {CHAPTERS.map((c, i) => (
            <div key={c.id} className="flex items-center gap-3">
              <span
                className={`font-mono text-[10px] tracking-[0.2em] transition-colors duration-500 ${
                  i === active ? "text-[var(--ember)]" : "text-white/25"
                }`}
              >
                {c.label}
              </span>
              <span
                className={`h-px transition-all duration-500 ${
                  i === active ? "w-8 bg-[var(--ember)]" : "w-4 bg-white/20"
                }`}
              />
            </div>
          ))}
        </div>

        {/* Chapter overlays */}
        <div className="absolute inset-0 z-10 flex items-end px-5 pb-16 pt-28 sm:px-10 sm:pb-20 md:px-16">
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
              <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--ember)]">
                {c.eyebrow}
              </p>
              <h2 className="font-display max-w-[16ch] whitespace-pre-line text-[clamp(2.4rem,7vw,5.5rem)] font-medium leading-[0.95] tracking-[-0.02em] text-white">
                {c.title}
              </h2>
              <p
                className={`mt-5 max-w-md text-[15px] leading-relaxed text-white/65 sm:text-[16px] ${
                  c.align === "center" ? "mx-auto" : ""
                }`}
              >
                {c.body}
              </p>
            </article>
          ))}
        </div>

        {/* Scroll cue — first beat only */}
        <div
          className={`pointer-events-none absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2 transition-opacity duration-700 ${
            active === 0 ? "opacity-70" : "opacity-0"
          }`}
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/50">
            Scroll the line
          </span>
          <span className="block h-8 w-px animate-pulse bg-white/40" />
        </div>
      </div>
    </section>
  );
}
