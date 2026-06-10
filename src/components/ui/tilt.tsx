"use client";

import React, { useEffect, useRef } from "react";

/**
 * Tilt — premium mouse-position 3D tilt + glare spotlight.
 * - transform/opacity only, single rAF loop, lerped (no snapping)
 * - fully disabled on touch (pointer: coarse) and prefers-reduced-motion
 * TWEAK KNOBS: max (deg), lerp factor inside loop (0.12), glare radius (220px)
 */
export default function Tilt({
  children,
  className = "",
  max = 6,
  glare = true,
}: {
  children: React.ReactNode;
  className?: string;
  max?: number;
  glare?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const target = useRef({ rx: 0, ry: 0, gx: 50, gy: 50, over: false });
  const cur = useRef({ rx: 0, ry: 0 });
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isTouch || reduced) return;
    const el = ref.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      target.current.ry = (px - 0.5) * 2 * max;
      target.current.rx = -(py - 0.5) * 2 * max;
      target.current.gx = px * 100;
      target.current.gy = py * 100;
      target.current.over = true;
    };
    const onLeave = () => {
      target.current.rx = 0;
      target.current.ry = 0;
      target.current.over = false;
    };

    el.addEventListener("mousemove", onMove, { passive: true });
    el.addEventListener("mouseleave", onLeave, { passive: true });

    const loop = () => {
      cur.current.rx += (target.current.rx - cur.current.rx) * 0.12;
      cur.current.ry += (target.current.ry - cur.current.ry) * 0.12;
      el.style.transform = `perspective(900px) rotateX(${cur.current.rx.toFixed(3)}deg) rotateY(${cur.current.ry.toFixed(3)}deg)`;
      if (glareRef.current) {
        glareRef.current.style.opacity = target.current.over ? "1" : "0";
        glareRef.current.style.background = `radial-gradient(220px circle at ${target.current.gx}% ${target.current.gy}%, rgba(67,194,216,0.13), transparent 70%)`;
      }
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);

    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      if (raf.current) cancelAnimationFrame(raf.current);
      el.style.transform = "";
    };
  }, [max]);

  return (
    <div
      ref={ref}
      className={`relative will-change-transform ${className}`}
      style={{ transformStyle: "preserve-3d" }}
    >
      {glare && (
        <div
          ref={glareRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] opacity-0 transition-opacity duration-300"
        />
      )}
      {children}
    </div>
  );
}
