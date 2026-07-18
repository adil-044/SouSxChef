"use client";

import { useState } from "react";
import { Navbar } from "@/components/sections/Navbar";
import { Experience } from "@/components/sections/Experience";
import { AfterWalkthrough } from "@/components/sections/AfterWalkthrough";

export default function Home() {
  const [ready, setReady] = useState(false);

  return (
    <main className="min-h-screen w-full bg-[var(--ink)]">
      <Navbar entranceComplete={ready} />
      <Experience onReady={() => setReady(true)} />
      <AfterWalkthrough />
    </main>
  );
}
