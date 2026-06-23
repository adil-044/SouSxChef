"use client";
import { motion } from "framer-motion";

export function Technology() {
  const items = [
    { title: "Text-Based Inventory", desc: "Type what you waste or what you're low on. SousXChef logs it instantly." },
    { title: "Instant Schedule Fixes", desc: "Text the system when a cook ghosts. It automatically finds qualified coverage." },
    { title: "Waste Feedback Loops", desc: "Real-time alerts when prep amounts consistently exceed historical sales volume." },
    { title: "Labor Leak Prevention", desc: "Smart warnings before scheduling staff into costly overtime brackets." }
  ];

  return (
    <section className="relative w-full h-screen h-[100dvh] bg-black overflow-hidden flex flex-col px-8 sm:px-12 md:px-16 py-12 sm:py-16">
      {/* Background Video */}
      <video
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_095750_32a52ce0-2005-45c9-9093-41f03fde9530.mp4"
        className="absolute inset-0 w-full h-full object-cover opacity-50"
        autoPlay
        playsInline
        muted
        loop
      />
      
      {/* Top area */}
      <div className="relative z-10 flex flex-col md:flex-row md:justify-between md:items-start gap-6 w-full">
        <motion.h2 
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.0 }}
          viewport={{ once: true, amount: 0.3 }}
          className="text-white font-light text-[clamp(36px,8vw,72px)] leading-[0.95] tracking-[-0.03em]"
        >
          Predictive <br /> Kitchen
        </motion.h2>
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.0, delay: 0.2 }}
          viewport={{ once: true, amount: 0.3 }}
          className="text-white/50 text-[13px] sm:text-[15px] leading-relaxed max-w-xs md:text-right md:pt-2"
        >
          The system learns your restaurant's volume baseline within 72 hours. From there, every rush is mapped, predicted, and optimized in real time.
        </motion.p>
      </div>
      
      <div className="flex-1" />
      
      {/* Bottom grid */}
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { duration: 1.0, delay: 0.3, staggerChildren: 0.1 }
          }
        }}
        className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6 w-full"
      >
        {items.map((item, i) => (
          <motion.div 
            key={i}
            variants={{
              hidden: { y: 20, opacity: 0 },
              visible: { y: 0, opacity: 1, transition: { duration: 0.7 } }
            }}
            className="flex flex-col"
          >
            <h4 className="text-white text-[14px] sm:text-[16px] font-normal mb-2">{item.title}</h4>
            <p className="text-white/40 text-[12px] sm:text-[14px] leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
