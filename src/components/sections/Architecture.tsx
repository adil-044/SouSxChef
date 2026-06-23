"use client";
import { motion } from "framer-motion";

export function Architecture() {
  return (
    <section className="relative w-full min-h-screen bg-black flex flex-col items-center justify-center px-6 py-32">
      <div className="w-full max-w-4xl flex flex-col items-center text-center">
        {/* Heading block */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.0 }}
          viewport={{ once: true, amount: 0.4 }}
          className="flex flex-col items-center"
        >
          <h3 className="text-white/40 text-[13px] sm:text-[14px] tracking-[0.2em] uppercase mb-8">Architecture</h3>
          <h2 className="text-white font-light text-[clamp(28px,6vw,56px)] leading-[1.15] tracking-[-0.02em] mb-10">
            The Text Tech Stack
          </h2>
          <p className="text-white/45 text-[15px] sm:text-[17px] leading-relaxed max-w-xl mx-auto">
            SMS logic handles the chaos. Dashboard handles the insights. No apps or onboarding needed.
          </p>
        </motion.div>
        
        {/* Layer cards */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { duration: 1.2, delay: 0.4, staggerChildren: 0.15 }
            }
          }}
          className="mt-20 flex flex-col items-center gap-4 w-full"
        >
          {[
            { num: "1", title: "Text Ingestion", desc: "Managers and staff interact via standard SMS or WhatsApp. No apps, no onboarding friction." },
            { num: "2", title: "Operational Engine", desc: "The AI processes text inputs, instantly updating inventory metrics and shifts." },
            { num: "3", title: "Live Dashboard", desc: "A clean, minimal web overview for when you want a macro-view of your kitchen’s health." }
          ].map((layer) => (
            <motion.div 
              key={layer.num}
              variants={{
                hidden: { y: 15, opacity: 0 },
                visible: { y: 0, opacity: 1, transition: { duration: 0.8 } }
              }}
              className="w-full border border-white/10 rounded-lg flex flex-col md:flex-row items-start md:items-center p-6 bg-black gap-4 md:gap-8 text-left"
            >
              <div className="flex flex-col gap-1 min-w-[200px]">
                <span className="text-white/30 text-[12px] tracking-[0.15em] uppercase">Layer {layer.num}</span>
                <span className="text-white text-[16px] sm:text-[18px] font-light">{layer.title}</span>
              </div>
              <p className="text-white/50 text-[13px] sm:text-[15px] leading-relaxed m-0">
                {layer.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
