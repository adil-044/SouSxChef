"use client";
import { motion } from "framer-motion";

export function SquashHamburger({ isOpen }: { isOpen: boolean }) {
  const springConfig = { stiffness: 300, damping: 20 };
  
  return (
    <div className="relative w-[15px] h-[10px] md:w-[18px] md:h-[12px]">
      <motion.span 
        className="absolute top-0 left-0 w-full h-[1.2px] md:h-[1.5px] bg-white rounded-full"
        animate={isOpen ? { top: "50%", y: "-50%", rotate: 45 } : { top: 0, y: 0, rotate: 0 }}
        transition={springConfig}
      />
      <motion.span 
        className="absolute top-1/2 left-0 w-full h-[1.2px] md:h-[1.5px] bg-white rounded-full -translate-y-1/2"
        animate={isOpen ? { opacity: 0, scale: 0.5 } : { opacity: 1, scale: 1 }}
        transition={springConfig}
      />
      <motion.span 
        className="absolute bottom-0 left-0 w-full h-[1.2px] md:h-[1.5px] bg-white rounded-full"
        animate={isOpen ? { bottom: "50%", y: "50%", rotate: -45 } : { bottom: 0, y: 0, rotate: 0 }}
        transition={springConfig}
      />
    </div>
  );
}
