"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SynapseXLogo } from "../ui/SynapseXLogo";
import { SquashHamburger } from "../ui/SquashHamburger";
import { ScrambleText } from "../ui/ScrambleText";

export function Navbar({ entranceComplete }: { entranceComplete: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [downloadHovered, setDownloadHovered] = useState(false);

  const scrollTo = (y: number) => {
    window.scrollTo({ top: y, behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: entranceComplete ? 1 : 0 }}
      transition={{ duration: 0.8 }}
      className="fixed top-0 left-0 w-full h-20 z-50 flex items-center justify-between px-4 sm:px-6 md:px-8 pointer-events-none"
    >
      {/* Left Group */}
      <div className="flex items-center gap-2 pointer-events-auto h-full">
        {/* Logo Pill */}
        <motion.div
          animate={{
            width: menuOpen ? 0 : "auto",
            opacity: menuOpen ? 0 : 1,
            marginRight: menuOpen ? 0 : "0.5rem",
          }}
          transition={{ stiffness: 350, damping: 28, type: "spring" }}
          className={`flex items-center overflow-hidden ${menuOpen ? "sm:flex hidden" : ""}`}
        >
          <motion.div
            whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.22)" }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center gap-2 h-9 sm:h-12 px-3.5 sm:px-5 bg-white/15 backdrop-blur-md rounded-[10px] sm:rounded-[14px] cursor-pointer whitespace-nowrap"
          >
            <SynapseXLogo className="w-[14px] h-[14px] sm:w-[18px] sm:h-[18px] text-white" />
            <span className="text-[13px] sm:text-[16px] font-medium tracking-tight text-white leading-none mt-[2px]">
              SousXChef
            </span>
          </motion.div>
        </motion.div>

        {/* Expanding Menu Pill */}
        <motion.div
          animate={{
            width: menuOpen ? (typeof window !== "undefined" && window.innerWidth < 640 ? "calc(100vw - 2rem - 100px)" : 290) : (typeof window !== "undefined" && window.innerWidth < 640 ? 36 : 48),
          }}
          transition={{ stiffness: 350, damping: 28, type: "spring" }}
          className="h-9 sm:h-12 bg-white/15 backdrop-blur-md rounded-[10px] sm:rounded-[14px] flex items-center overflow-hidden"
        >
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`flex items-center justify-center transition-colors ${
              menuOpen
                ? "w-7 h-7 sm:w-9 sm:h-9 rounded-[8px] sm:rounded-[11px] bg-white/10 hover:bg-white/20 ml-1 sm:ml-1.5"
                : "w-9 h-9 sm:w-12 sm:h-12 rounded-[10px] sm:rounded-[14px] hover:bg-white/10"
            }`}
          >
            <SquashHamburger isOpen={menuOpen} />
          </button>

          {/* Nav Links */}
          <div className="flex items-center gap-4 sm:gap-6 ml-3 sm:ml-4 overflow-hidden whitespace-nowrap">
            <motion.button
              initial={{ opacity: 0, x: 15 }}
              animate={menuOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: 15 }}
              transition={{ delay: menuOpen ? 0.1 : 0 }}
              onMouseEnter={() => setHoveredLink("features")}
              onMouseLeave={() => setHoveredLink(null)}
              onClick={() => scrollTo(window.innerHeight)}
              className="text-[13px] sm:text-[16px] font-normal text-white/85 hover:text-white leading-none mt-[2px]"
            >
              <ScrambleText text="Features" isHovered={hoveredLink === "features"} />
            </motion.button>
            <motion.button
              initial={{ opacity: 0, x: 15 }}
              animate={menuOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: 15 }}
              transition={{ delay: menuOpen ? 0.15 : 0 }}
              onMouseEnter={() => setHoveredLink("impact")}
              onMouseLeave={() => setHoveredLink(null)}
              onClick={() => scrollTo(window.innerHeight * 2)}
              className="text-[13px] sm:text-[16px] font-normal text-white/85 hover:text-white leading-none mt-[2px]"
            >
              <ScrambleText text="Impact" isHovered={hoveredLink === "impact"} />
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Right Group: Book Demo */}
      <motion.a
        href="https://calendly.com/uptisement/30min"
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.03, backgroundColor: "#e2e2e6" }}
        whileTap={{ scale: 0.97 }}
        onMouseEnter={() => setDownloadHovered(true)}
        onMouseLeave={() => setDownloadHovered(false)}
        className="h-9 sm:h-12 px-5 sm:px-8 bg-white rounded-full flex items-center justify-center pointer-events-auto shrink-0"
      >
        <span className="text-black text-[13px] sm:text-[16px] font-bold leading-none mt-[2px]">
          <ScrambleText text="Book Demo" isHovered={downloadHovered} />
        </span>
      </motion.a>
    </motion.nav>
  );
}
