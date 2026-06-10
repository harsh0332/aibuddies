"use client";

import React from "react";

/**
 * AmbientOrbs — floating blurred gradient orbs behind section content.
 * Pure CSS animation (transform only), hidden on mobile + reduced-motion
 * via .float-orb rules in globals.css. Parent section must be `relative`.
 */
export default function AmbientOrbs({ flip = false }: { flip?: boolean }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden hidden md:block"
    >
      <div
        className="float-orb orb-a"
        style={{
          width: 420,
          height: 420,
          top: "-12%",
          [flip ? "left" : "right"]: "-6%",
          background:
            "radial-gradient(circle, rgba(43,160,220,0.55), transparent 70%)",
        } as React.CSSProperties}
      />
      <div
        className="float-orb orb-b"
        style={{
          width: 340,
          height: 340,
          bottom: "-14%",
          [flip ? "right" : "left"]: "-4%",
          background:
            "radial-gradient(circle, rgba(124,111,240,0.45), transparent 70%)",
        } as React.CSSProperties}
      />
    </div>
  );
}
