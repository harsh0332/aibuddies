import React from "react";

interface CornerBordersProps {
  children?: React.ReactNode;
  className?: string;
  showCorners?: boolean;
}

export default function CornerBorders({
  children,
  className = "",
  showCorners = true,
}: CornerBordersProps) {
  return (
    <div className={`relative border border-dashed border-border-custom/40 rounded-sm-custom ${className}`}>
      {showCorners && (
        <>
          {/* Top Left */}
          <span 
            className="absolute -left-[1px] -top-[1px] text-signature/70 pointer-events-none select-none" 
            aria-hidden="true"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" overflow="visible">
              <path 
                d="M 1.5 10 L 1.5 1.5 C 1.5 1.5, 1.5 1.5, 1.5 1.5 L 10 1.5" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                fill="none"
              />
            </svg>
          </span>
          {/* Top Right */}
          <span 
            className="absolute -right-[1px] -top-[1px] text-signature/70 pointer-events-none select-none" 
            aria-hidden="true"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" overflow="visible">
              <path 
                d="M 0 1.5 L 8.5 1.5 C 8.5 1.5, 8.5 1.5, 8.5 1.5 L 8.5 10" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                fill="none"
              />
            </svg>
          </span>
          {/* Bottom Left */}
          <span 
            className="absolute -left-[1px] -bottom-[1px] text-signature/70 pointer-events-none select-none" 
            aria-hidden="true"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" overflow="visible">
              <path 
                d="M 1.5 0 L 1.5 8.5 C 1.5 8.5, 1.5 8.5, 1.5 8.5 L 10 8.5" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                fill="none"
              />
            </svg>
          </span>
          {/* Bottom Right */}
          <span 
            className="absolute -right-[1px] -bottom-[1px] text-signature/70 pointer-events-none select-none" 
            aria-hidden="true"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" overflow="visible">
              <path 
                d="M 0 8.5 L 8.5 8.5 C 8.5 8.5, 8.5 8.5, 8.5 8.5 L 8.5 0" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                fill="none"
              />
            </svg>
          </span>
        </>
      )}
      {children}
    </div>
  );
}
