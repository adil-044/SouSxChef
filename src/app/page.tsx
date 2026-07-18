"use client";

import { useState } from "react";
import { Navbar } from "@/components/sections/Navbar";
import { Experience } from "@/components/sections/Experience";
import { Agents, Proof } from "@/components/sections/Agents";
import { Pricing } from "@/components/sections/Pricing";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  const [ready, setReady] = useState(false);

  return (
    <main className="min-h-screen w-full bg-[var(--ink)]">
      <Navbar entranceComplete={ready} />
      <Experience onReady={() => setReady(true)} />
      <Agents />
      <Proof />
      <Pricing />
      <Footer />
    </main>
  );
}
