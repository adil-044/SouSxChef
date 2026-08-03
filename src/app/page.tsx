"use client";

import { useCallback, useState } from "react";
import { Navbar } from "@/components/sections/Navbar";
import { Experience } from "@/components/sections/Experience";
import { AfterWalkthrough } from "@/components/sections/AfterWalkthrough";
import { PageLoader } from "@/components/ui/PageLoader";

export default function Home() {
  const [ready, setReady] = useState(false);
  const onExperienceReady = useCallback(() => setReady(true), []);

  return (
    <main className="min-h-screen w-full bg-[var(--ink)]">
      <PageLoader done={ready} />
      <Navbar entranceComplete={ready} />
      <Experience onReady={onExperienceReady} />
      <AfterWalkthrough />
    </main>
  );
}
