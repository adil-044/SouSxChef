"use client";

import { useState } from "react";
import { Navbar } from "@/components/sections/Navbar";
import { Experience } from "@/components/sections/Experience";
import { ClosingCTA } from "@/components/sections/ClosingCTA";
import { Agents, Proof } from "@/components/sections/Agents";
import { Pricing } from "@/components/sections/Pricing";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  const [ready, setReady] = useState(false);

  return (
    <main className="relative min-h-screen w-full bg-[var(--ink)]">
      <Navbar entranceComplete={ready} />
      <Experience onReady={() => setReady(true)} />
      {/* Post-hero stack sits above sticky stage in paint order */}
      <div className="relative z-10 bg-[var(--ink)]">
        <ClosingCTA />
        <Agents />
        <Proof />
        <Pricing />
        <Footer />
      </div>
    </main>
  );
}
