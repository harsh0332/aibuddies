import React from "react";
import Image from "next/image";
import { BRAND_CONFIG } from "@/config/content";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "full" | "horizontal";
}

const LOGO_IMAGE_PATH = "/logo-official.jpg";

export default function Logo({ className = "", size = "md", variant = "full" }: LogoProps) {
  const dimensions = {
    sm: { width: 40, height: 40 },
    md: { width: 140, height: 70 },
    lg: { width: 220, height: 110 },
  };

  const { width, height } = dimensions[size];

  if (variant === "horizontal") {
    return (
      <div className={`flex items-center gap-3 select-none ${className}`}>
        {/* Emblem Image with Mix-Blend-Screen for Dark Navbar */}
        <div className="relative overflow-hidden shrink-0 w-10 h-10 rounded-lg flex items-center justify-center bg-black/60 border border-signature/30 shadow-[0_0_15px_rgba(43,160,220,0.2)]">
          <Image
            src={LOGO_IMAGE_PATH}
            alt="AI Buddies Monogram"
            width={120}
            height={120}
            priority
            className="w-full h-full object-cover mix-blend-screen scale-110"
          />
        </div>
        
        {/* Text Lockup */}
        <div className="flex flex-col justify-center leading-none">
          <span className="font-sans font-bold text-base md:text-lg text-text-primary tracking-tight">
            AI <span className="text-signature">Buddies</span>
          </span>
          <span className="hidden md:block text-[8px] font-mono tracking-widest text-text-tertiary uppercase leading-none mt-1">
            {BRAND_CONFIG.categoryLine}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center select-none ${className}`}>
      <div className="relative overflow-hidden rounded-xl bg-black/80 border border-signature/20 p-2 shadow-[0_0_30px_rgba(43,160,220,0.15)]" style={{ width, height }}>
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
