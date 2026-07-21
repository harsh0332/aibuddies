import React from "react";
import Image from "next/image";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "full" | "horizontal";
}

const LOGO_IMAGE_PATH = "/logo-horizontal.jpg";

export default function Logo({ className = "", size = "md" }: LogoProps) {
  const dimensions = {
    sm: { width: 160, height: 42 },
    md: { width: 210, height: 54 },
    lg: { width: 280, height: 72 },
  };

  const { width, height } = dimensions[size];

  return (
    <div className={`flex items-center justify-center select-none ${className}`}>
      <div 
        className="relative overflow-hidden rounded-full transition-transform duration-300 hover:scale-105" 
        style={{ width, height }}
      >
        <Image
          src={LOGO_IMAGE_PATH}
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
