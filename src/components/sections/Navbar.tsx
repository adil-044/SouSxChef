"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SynapseXLogo } from "../ui/SynapseXLogo";
import { SquashHamburger } from "../ui/SquashHamburger";
import { ScrambleText } from "../ui/ScrambleText";

const LINKS = [
  { id: "experience", label: "Story" },
  { id: "agents", label: "Agents" },
  { id: "proof", label: "Proof" },
  { id: "pricing", label: "Pricing" },
] as const;

export function Navbar({ entranceComplete }: { entranceComplete: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [ctaHovered, setCtaHovered] = useState(false);

  const scrollToId = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: entranceComplete ? 1 : 0 }}
      transition={{ duration: 0.8 }}
      className="pointer-events-none fixed top-0 left-0 z-50 flex h-20 w-full items-center justify-between px-4 sm:px-6 md:px-8"
    >
      <div className="pointer-events-auto flex h-full items-center gap-2">
        <motion.button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.18)" }}
          whileTap={{ scale: 0.98 }}
          className="flex h-9 items-center justify-center gap-2 rounded-[10px] bg-white/12 px-3.5 backdrop-blur-md sm:h-12 sm:rounded-[14px] sm:px-5"
        >
          <SynapseXLogo className="h-[14px] w-[14px] text-[var(--ember)] sm:h-[18px] sm:w-[18px]" />
          <span className="mt-[2px] text-[13px] font-medium tracking-tight text-white sm:text-[16px]">
            SousXChef
          </span>
        </motion.button>

        <motion.div
          animate={{
            width: menuOpen
              ? typeof window !== "undefined" && window.innerWidth < 640
                ? "calc(100vw - 2rem - 110px)"
                : 340
              : typeof window !== "undefined" && window.innerWidth < 640
                ? 36
                : 48,
          }}
          transition={{ stiffness: 350, damping: 28, type: "spring" }}
          className="flex h-9 items-center overflow-hidden rounded-[10px] bg-white/12 backdrop-blur-md sm:h-12 sm:rounded-[14px]"
        >
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen(!menuOpen)}
            className={`flex items-center justify-center transition-colors ${
              menuOpen
                ? "ml-1 h-7 w-7 rounded-[8px] bg-white/10 hover:bg-white/20 sm:ml-1.5 sm:h-9 sm:w-9 sm:rounded-[11px]"
                : "h-9 w-9 rounded-[10px] hover:bg-white/10 sm:h-12 sm:w-12 sm:rounded-[14px]"
            }`}
          >
            <SquashHamburger isOpen={menuOpen} />
          </button>

          <div className="ml-3 flex items-center gap-4 overflow-hidden whitespace-nowrap sm:ml-4 sm:gap-5">
            {LINKS.map((link, i) => (
              <motion.button
                key={link.id}
                type="button"
                initial={{ opacity: 0, x: 12 }}
                animate={menuOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: 12 }}
                transition={{ delay: menuOpen ? 0.08 + i * 0.04 : 0 }}
                onMouseEnter={() => setHoveredLink(link.id)}
                onMouseLeave={() => setHoveredLink(null)}
                onClick={() => scrollToId(link.id)}
                className="mt-[2px] text-[13px] text-white/85 hover:text-white sm:text-[15px]"
              >
                <ScrambleText text={link.label} isHovered={hoveredLink === link.id} />
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.a
        href="https://calendly.com/uptisement/30min"
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onMouseEnter={() => setCtaHovered(true)}
        onMouseLeave={() => setCtaHovered(false)}
        className="pointer-events-auto flex h-9 shrink-0 items-center justify-center rounded-full bg-[var(--ember)] px-5 sm:h-12 sm:px-8"
      >
        <span className="mt-[2px] text-[13px] font-bold text-[var(--ink)] sm:text-[15px]">
          <ScrambleText text="Book Demo" isHovered={ctaHovered} />
        </span>
      </motion.a>
    </motion.nav>
  );
}
