"use client";
import { motion } from "framer-motion";

export function Metrics() {
  return (
    <section className="relative w-full min-h-screen bg-black flex items-center justify-center pt-32 pb-32 px-6">
      {/* Background Video */}
      <video
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_095810_ecea3dd2-fc5e-4e41-8696-4219290b6589.mp4"
        className="absolute inset-0 w-full h-full object-cover opacity-40"
        autoPlay
        playsInline
        muted
        loop
      />
      
      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col">
        <motion.h3 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          viewport={{ once: true, amount: 0.3 }}
          className="text-white/40 text-[13px] sm:text-[14px] tracking-[0.2em] uppercase mb-20 text-center"
        >
          Impact Metrics
        </motion.h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8">
          {[
            { value: "20%", label: "Lower Food Costs" },
            { value: "10 Sec", label: "Inventory Updates" },
            { value: "0", label: "Missed Shifts" },
          ].map((metric, i) => (
            <motion.div 
              key={i}
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: i * 0.15 }}
              viewport={{ once: true, amount: 0.3 }}
              className="flex flex-col text-center"
            >
              <div className="text-white text-[clamp(48px,10vw,96px)] font-light tracking-[-0.04em] leading-none">
                {metric.value}
              </div>
              <div className="text-white/40 text-[13px] sm:text-[15px] mt-4 tracking-wide">
                {metric.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
