import React from "react";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function Logo({ className = "", size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-xl md:text-2xl",
    lg: "text-3xl md:text-4xl",
  };

  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      <span className={`font-sora font-extrabold tracking-tight text-white ${sizeClasses[size]}`}>
        AI{" "}
        <span className="text-signature relative inline-block">
          Buddies
          <span 
            className="absolute inset-0 -z-10 bg-signature/30 blur-lg rounded-full pointer-events-none scale-110"
            aria-hidden="true"
          />
        </span>
      </span>
    </div>
  );
}
