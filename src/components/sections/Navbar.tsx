"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SynapseXLogo } from "../ui/SynapseXLogo";
import { SquashHamburger } from "../ui/SquashHamburger";

const LINKS = [
  { id: "experience", label: "Story", type: "scroll" as const },
  { id: "agents", label: "Agents", type: "scroll" as const },
  { id: "proof", label: "Proof", type: "scroll" as const },
  { id: "pricing", label: "Pricing", type: "scroll" as const },
  { id: "blog", label: "Blog", type: "link" as const, href: "/blog" },
] as const;

export function Navbar({ entranceComplete = true }: { entranceComplete?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const scrollToId = (id: string) => {
    setMenuOpen(false);
    if (typeof window === "undefined") return;
    if (window.location.pathname !== "/") {
      window.location.href = `/#${id}`;
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: entranceComplete ? 1 : 0, y: entranceComplete ? 0 : -8 }}
        transition={{ duration: 0.6 }}
        className={`fixed top-0 left-0 z-50 w-full transition-colors duration-300 ${
          scrolled || menuOpen ? "bg-[var(--ink)]/85 backdrop-blur-md" : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:h-20 sm:px-6 md:px-8">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 backdrop-blur-md transition hover:bg-white/15 sm:px-4"
          >
            <SynapseXLogo className="h-4 w-4 text-[var(--ember)] sm:h-[18px] sm:w-[18px]" />
            <span className="text-[14px] font-medium tracking-tight text-white sm:text-[16px]">
              SousXChef
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden items-center gap-1 md:flex">
            {LINKS.map((link) =>
              link.type === "link" ? (
                <Link
                  key={link.id}
                  href={link.href}
                  className="rounded-lg px-3 py-2 text-[14px] text-white/70 transition hover:bg-white/10 hover:text-white"
                >
                  {link.label}
                </Link>
              ) : (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => scrollToId(link.id)}
                  className="rounded-lg px-3 py-2 text-[14px] text-white/70 transition hover:bg-white/10 hover:text-white"
                >
                  {link.label}
                </button>
              )
            )}
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/login"
              className="hidden rounded-full px-4 py-2 text-[13px] text-white/80 transition hover:text-white sm:inline-flex"
            >
              Log in
            </Link>
            <a
              href="https://calendly.com/uptisement/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-full border border-white/25 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-white transition hover:border-white hover:bg-white hover:text-[var(--ink)] lg:inline-flex"
            >
              Book demo
            </a>
            <Link
              href="/onboarding"
              className="inline-flex h-9 items-center justify-center rounded-full bg-[var(--ember)] px-4 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--ink)] transition hover:bg-[var(--ember-hot)] sm:h-10 sm:px-5"
            >
              Get started
            </Link>
            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 md:hidden"
            >
              <SquashHamburger isOpen={menuOpen} />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/70 md:hidden"
            onClick={() => setMenuOpen(false)}
          >
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="absolute top-0 right-0 flex h-full w-[min(100%,320px)] flex-col bg-[var(--steel)] px-6 pt-24 pb-10"
              onClick={(e) => e.stopPropagation()}
            >
              <nav className="flex flex-col gap-1">
                {LINKS.map((link) =>
                  link.type === "link" ? (
                    <Link
                      key={link.id}
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="rounded-xl px-3 py-3 text-left font-display text-[1.5rem] text-white transition hover:bg-white/5"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <button
                      key={link.id}
                      type="button"
                      onClick={() => scrollToId(link.id)}
                      className="rounded-xl px-3 py-3 text-left font-display text-[1.5rem] text-white transition hover:bg-white/5"
                    >
                      {link.label}
                    </button>
                  )
                )}
              </nav>
              <div className="mt-auto flex flex-col gap-3 border-t border-white/10 pt-6">
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl border border-white/20 px-4 py-3 text-center text-[14px] text-white"
                >
                  Log in
                </Link>
                <Link
                  href="/onboarding"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl bg-[var(--ember)] px-4 py-3 text-center font-mono text-[12px] uppercase tracking-[0.14em] text-[var(--ink)]"
                >
                  Get started
                </Link>
                <a
                  href="https://calendly.com/uptisement/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-center font-mono text-[11px] uppercase tracking-[0.16em] text-white/45"
                >
                  Book a demo
                </a>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
