"use client";
import { useState } from "react";
import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { CinematicText } from "@/components/sections/CinematicText";
import { Metrics } from "@/components/sections/Metrics";
import { Technology } from "@/components/sections/Technology";
import { Architecture } from "@/components/sections/Architecture";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  const [entranceComplete, setEntranceComplete] = useState(false);

  return (
    <main className="w-full bg-black min-h-screen">
      <Navbar entranceComplete={entranceComplete} />
      <Hero onEntranceComplete={() => setEntranceComplete(true)} />
      <CinematicText />
      <Metrics />
      <Technology />
      <Architecture />
      <Footer />
    </main>
  );
}
