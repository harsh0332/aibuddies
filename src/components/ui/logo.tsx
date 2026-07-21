import React from "react";
import Image from "next/image";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "full" | "horizontal";
}

const LOGO_IMAGE_PATH = "/logo-official.jpg";

export default function Logo({ className = "", size = "md", variant = "full" }: LogoProps) {
  const dimensions = {
    sm: { width: 44, height: 44 },
    md: { width: 160, height: 80 },
    lg: { width: 240, height: 120 },
  };

  const { width, height } = dimensions[size];

  if (variant === "horizontal") {
    return (
      <div className={`flex items-center gap-3.5 select-none ${className}`}>
        {/* Monogram "ab" Icon Box */}
        <div className="relative overflow-hidden shrink-0 w-10 h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center bg-black/80 border border-signature/30 shadow-[0_0_20px_rgba(43,160,220,0.25)] group hover:border-signature/60 transition-all duration-300">
          <Image
            src={LOGO_IMAGE_PATH}
            alt="AI Buddies Monogram"
            width={120}
            height={120}
            priority
            className="w-full h-full object-cover mix-blend-screen scale-110 group-hover:scale-115 transition-transform duration-300"
          />
        </div>

        {/* Thin Vertical Separator Divider */}
        <div className="w-[1px] h-7 bg-white/20 shrink-0" aria-hidden="true" />
        
        {/* Text Lockup */}
        <div className="flex flex-col justify-center leading-tight">
          <div className="font-sans font-bold text-base md:text-xl text-white tracking-tight flex items-center gap-1">
            <span>AI</span>
            <span className="text-signature bg-clip-text text-transparent bg-gradient-to-r from-[#2BA0DC] via-[#43C2D8] to-[#2BA0DC] font-extrabold">
              Buddies
            </span>
          </div>

          <div className="text-[8px] md:text-[9px] font-mono tracking-widest text-text-tertiary uppercase leading-none mt-1 flex items-center gap-1.5 font-medium">
            <span>AGENTS</span>
            <span className="text-signature font-bold text-[10px]">·</span>
            <span>AUTOMATIONS</span>
            <span className="text-signature font-bold text-[10px]">·</span>
            <span>AI SKILLS</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center select-none ${className}`}>
      <div className="relative overflow-hidden rounded-2xl bg-black/90 border border-signature/30 p-2.5 shadow-[0_0_35px_rgba(43,160,220,0.2)]" style={{ width, height }}>
        <Image
          src={LOGO_IMAGE_PATH}
          alt="AI Buddies Official Logo"
          width={width * 2}
          height={height * 2}
          priority
          className="w-full h-full object-contain mix-blend-screen"
        />
      </div>
    </div>
  );
}
