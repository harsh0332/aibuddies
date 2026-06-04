import React from "react";
import Image from "next/image";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

// Single constant for easily swapping logo asset path in the future
const LOGO_IMAGE_PATH = "/whatsapp-image.jpeg";

export default function Logo({ className = "", size = "md" }: LogoProps) {
  const dimensions = {
    sm: { width: 36, height: 36 },
    md: { width: 80, height: 80 },
    lg: { width: 160, height: 160 },
  };

  const { width, height } = dimensions[size];

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
