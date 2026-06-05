import React from "react";
import Image from "next/image";
import { BRAND_CONFIG } from "@/config/content";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "full" | "horizontal";
}

// Single constant for easily swapping logo asset path in the future
const LOGO_IMAGE_PATH = "/whatsapp-image.jpeg";

export default function Logo({ className = "", size = "md", variant = "full" }: LogoProps) {
  const dimensions = {
    sm: { width: 36, height: 36 },
    md: { width: 80, height: 80 },
    lg: { width: 160, height: 160 },
  };

  const { width, height } = dimensions[size];

  if (variant === "horizontal") {
    return (
      <div className={`flex items-center gap-3 select-none ${className}`}>
        {/* Monogram Cropped Box */}
        <div 
          className="relative overflow-hidden mix-blend-screen flex items-center justify-center shrink-0" 
          style={{ width: 36, height: 36 }}
        >
          <Image
            src={LOGO_IMAGE_PATH}
            alt="AI Buddies Monogram"
            width={72}
            height={72}
            priority
            className="max-w-none object-cover object-top scale-[1.7] origin-top"
          />
        </div>
        
        {/* Text Lockup */}
        <div className="flex flex-col justify-center leading-none">
          <span className="font-sans font-semibold text-base md:text-lg text-text-primary tracking-tight">
            AI <span className="text-signature font-bold">Buddies</span>
          </span>
          <span className="hidden md:block text-[8px] font-mono tracking-widest text-text-tertiary uppercase leading-none mt-1">
            {BRAND_CONFIG.categoryLine}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center select-none ${className}`}>
      {/* mix-blend-screen drops the black background out on dark surfaces */}
      <div className="relative mix-blend-screen overflow-hidden" style={{ width, height }}>
        <Image
          src={LOGO_IMAGE_PATH}
          alt="AI Buddies"
          width={width}
          height={height}
          priority
          className="object-contain"
        />
      </div>
    </div>
  );
}
