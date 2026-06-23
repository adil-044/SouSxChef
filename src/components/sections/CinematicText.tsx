"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform, useMotionTemplate } from "framer-motion";

export function CinematicText() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 15, damping: 32, mass: 1.8 });
  const yScaleValue = useTransform(smoothProgress, [0, 1], [60, -120]);
  const opacityValue = useTransform(smoothProgress, [0.3, 0.5], [0, 1]);
  
  const transform = useMotionTemplate`rotateX(24deg) translateY(${yScaleValue}px) translateZ(15px)`;

  return (
    <section ref={containerRef} className="relative w-full h-screen h-[100dvh] bg-black overflow-hidden flex items-center justify-center">
      {/* Background Video */}
      <video
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_092455_089c54f8-3b03-4966-9df1-e9746063d0ef.mp4"
        className="absolute inset-0 w-full h-full object-cover opacity-60"
        autoPlay
        playsInline
        muted
        loop
      />
      
      {/* Top gradient overlay */}
      <div className="absolute top-0 left-0 w-full h-[180px] z-10" style={{ background: "linear-gradient(to bottom, #010103, transparent)" }} />
      
      {/* Content */}
      <div className="relative z-20 max-w-5xl px-6 sm:px-12 w-full" style={{ perspective: "400px" }}>
        <motion.p 
          style={{ transform, opacity: opacityValue }}
          className="font-sans font-normal text-[22px] sm:text-[30px] md:text-[36px] lg:text-[42px] text-white leading-[1.35] tracking-[-0.02em] select-none text-center transform-gpu"
        >
          A text-driven intelligence layer built for the chaos of the commercial kitchen. SousXChef translates daily line checks and schedule shifts into organized, predictable operations. Every ingredient becomes tracked. Every open shift gets covered instantly. Culinary chaos is filtered into profitable efficiency—all via text message.
        </motion.p>
      </div>
    </section>
  );
}
