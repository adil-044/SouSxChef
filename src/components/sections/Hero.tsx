"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ScrambleIn } from "../ui/ScrambleIn";

export function Hero({ onEntranceComplete }: { onEntranceComplete: () => void }) {
  const [entranceComplete, setEntranceComplete] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Scrubber state
  const isScrubbingRef = useRef(false);
  const targetTimeRef = useRef(0);
  const lastXRef = useRef<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setEntranceComplete(true);
      onEntranceComplete();
    }, 800);
    return () => clearTimeout(timer);
  }, [onEntranceComplete]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!videoRef.current || !videoRef.current.duration) return;
    
    if (lastXRef.current === null) {
      lastXRef.current = e.clientX;
      return;
    }
    
    const deltaX = e.clientX - lastXRef.current;
    lastXRef.current = e.clientX;
    
    // Sensitivity factor
    const timeDelta = (deltaX / window.innerWidth) * videoRef.current.duration * 0.8;
    
    let newTime = targetTimeRef.current + timeDelta;
    newTime = Math.max(0, Math.min(newTime, videoRef.current.duration));
    targetTimeRef.current = newTime;
    
    if (!isScrubbingRef.current) {
      isScrubbingRef.current = true;
      videoRef.current.currentTime = newTime;
    }
  };

  const handleSeeked = () => {
    if (!videoRef.current) return;
    
    if (Math.abs(videoRef.current.currentTime - targetTimeRef.current) > 0.1) {
      videoRef.current.currentTime = targetTimeRef.current;
    } else {
      isScrubbingRef.current = false;
    }
  };

  return (
    <section 
      className="relative w-full h-screen h-[100dvh] overflow-hidden bg-black flex flex-col px-4 sm:px-6 md:px-8 pt-20 sm:pt-24 pb-8 sm:pb-12"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { lastXRef.current = null; }}
    >
      {/* Background Video */}
      <video
        ref={videoRef}
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_083515_290e5a10-0b95-41af-a5e2-32b6389baa4d.mp4"
        className="absolute inset-0 w-full h-full object-cover opacity-80"
        playsInline
        muted
        onSeeked={handleSeeked}
      />
      
      {/* Dot grid overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{ backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "24px 24px" }}
      />
      
      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden mt-[50px]">
        <h2 
          className="font-anton uppercase opacity-10 select-none whitespace-nowrap text-[clamp(100px,25vw,521px)] tracking-[-4px]"
          style={{ 
            background: "radial-gradient(circle, rgba(142,127,148,0) 0%, #8E7F94 70%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}
        >
          ORCHESTRATION
        </h2>
      </div>

      <div className="flex-1" />

      {/* Content */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: entranceComplete ? 1 : 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between w-full pointer-events-none"
      >
        <div className="flex flex-col gap-4 pointer-events-auto">
          <h1 className="text-white font-light leading-[0.95] tracking-[-0.03em] text-[clamp(40px,10vw,100px)]">
            <ScrambleIn text="Kitchen" delay={200} triggered={entranceComplete} />
            <br />
            <ScrambleIn text="Intelligence" delay={500} triggered={entranceComplete} />
          </h1>
          <motion.p 
            initial={{ y: 25, opacity: 0 }}
            animate={entranceComplete ? { y: 0, opacity: 1 } : { y: 25, opacity: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.215, 0.610, 0.355, 1.000] }}
            className="max-w-sm text-[13px] sm:text-[15px] text-white/60 leading-relaxed"
          >
            Built at the intersection of restaurant operations and conversational intelligence. SousXChef maps your inventory and labor schedules into a single text-based system. Control your entire kitchen's food cost and scheduling chaos entirely through SMS.
          </motion.p>
        </div>
        
        <h1 className="text-white font-light leading-[0.95] tracking-[-0.03em] text-[clamp(40px,10vw,100px)] text-left md:text-right pointer-events-auto">
          <ScrambleIn text="Total" delay={700} triggered={entranceComplete} />
          <br />
          <ScrambleIn text="Control" delay={1000} triggered={entranceComplete} />
        </h1>
      </motion.div>
    </section>
  );
}
