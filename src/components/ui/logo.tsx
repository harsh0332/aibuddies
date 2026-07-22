import React from "react";
import Image from "next/image";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "full" | "horizontal";
}

const LOGO_IMAGE_PATH = "/logo-monogram.jpg";
const LOGO_BANNER_PATH = "/logo-horizontal.jpg";

export default function Logo({ className = "", size = "md", variant = "horizontal" }: LogoProps) {
  if (variant === "full") {
    const bannerDimensions = {
      sm: { width: 200, height: 50 },
      md: { width: 280, height: 70 },
      lg: { width: 360, height: 90 },
    };
    const { width, height } = bannerDimensions[size];

    return (
      <div className={`flex items-center justify-center select-none ${className}`}>
        <div className="relative overflow-hidden transition-transform duration-300 hover:scale-105" style={{ width, height }}>
          <Image
            src={LOGO_BANNER_PATH}
            alt="AI Buddiess Official Logo"
            width={width * 2}
            height={height * 2}
            priority
            className="w-full h-full object-contain mix-blend-screen"
          />
        </div>
      </div>
    );
  }

  // Horizontal variant tuned for navbar readability & proportion
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* "ab" Gradient Emblem Mark */}
      <div className="relative overflow-hidden shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center bg-black border border-signature/40 shadow-[0_0_20px_rgba(43,160,220,0.3)] group hover:border-signature/70 transition-all duration-300">
        <Image
          src={LOGO_IMAGE_PATH}
          alt="AI Buddiess Emblem"
          width={80}
          height={80}
          priority
          className="w-full h-full object-cover scale-[1.6] group-hover:scale-[1.65] transition-transform duration-300"
        />
      </div>

      {/* Thin Vertical Separator Line */}
      <div className="w-[1px] h-7 bg-white/20 shrink-0" aria-hidden="true" />
      
      {/* Brand Text Lockup with Double 'S' */}
      <div className="flex flex-col justify-center leading-none">
        <div className="font-sans font-bold text-base md:text-lg text-white tracking-tight flex items-center gap-1">
          <span>AI</span>
          <span className="text-signature bg-clip-text text-transparent bg-gradient-to-r from-[#2BA0DC] via-[#43C2D8] to-[#2BA0DC] font-extrabold">
            Buddiess
          </span>
        </div>

        <div className="text-[8px] md:text-[9px] font-mono tracking-widest text-text-tertiary uppercase leading-none mt-1 flex items-center gap-1 font-medium">
          <span>AGENTS</span>
          <span className="text-signature font-bold text-[9px]">·</span>
          <span>AUTOMATIONS</span>
          <span className="text-signature font-bold text-[9px]">·</span>
          <span>AI SKILLS</span>
        </div>
      </div>
    </div>
  );
}
