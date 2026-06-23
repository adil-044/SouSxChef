"use client";
import { SynapseXLogo } from "../ui/SynapseXLogo";

export function Footer() {
  return (
    <footer className="relative w-full bg-black overflow-hidden flex flex-col md:flex-row min-h-[400px]">
      {/* Left: Video */}
      <div className="w-full md:w-1/2 h-[300px] md:h-auto relative">
        <video
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_080203_fd7f4f85-3a86-4837-8192-85e7bfe68e75.mp4"
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          playsInline
          muted
          loop
        />
      </div>
      
      {/* Right: Content */}
      <div className="w-full md:w-1/2 flex flex-col justify-between p-10 sm:p-16">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-8">
            <SynapseXLogo className="w-[18px] h-[18px] text-white/70" />
            <span className="text-[15px] font-medium text-white/70 tracking-tight">SousXChef</span>
          </div>
          <p className="text-white/40 text-[14px] sm:text-[15px] leading-relaxed max-w-sm">
            The next evolution of restaurant operations. Built for kitchens that refuse to be slowed down by clunky software.
          </p>
        </div>
        
        <div className="text-white/25 text-[12px] mt-12">
          (c) 2026 SousXChef. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
