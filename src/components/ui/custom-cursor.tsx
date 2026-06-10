/* eslint-disable */
"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  
  const [isEnabled, setIsEnabled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [cursorLabel, setCursorLabel] = useState("");
  
  const mouseRef = useRef({ x: -100, y: -100 });
  const dotPosRef = useRef({ x: -100, y: -100 });
  const ringPosRef = useRef({ x: -100, y: -100 });
  const glowPosRef = useRef({ x: -100, y: -100 });
  const animationFrameRef = useRef<number | null>(null);

  // Ref tracker to throttle React state changes
  const hoverStateRef = useRef(false);

  useEffect(() => {
    // Disable on touch devices and when prefers-reduced-motion is active
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (isTouch || prefersReducedMotion) {
      return;
    }

    setIsEnabled(true);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);

    // Event Delegation: single listener on document instead of MutationObserver
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target && target.closest) {
        const isOverInteractive = !!target.closest(
          'a, button, input, select, textarea, [role="button"], label'
        );
        if (isOverInteractive !== hoverStateRef.current) {
          hoverStateRef.current = isOverInteractive;
          setIsHovered(isOverInteractive);
        }

        // Handle data-cursor-label
        const labeledElement = target.closest('[data-cursor-label]');
        if (labeledElement) {
          setCursorLabel(labeledElement.getAttribute('data-cursor-label') || "");
        } else {
          setCursorLabel("");
        }
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.relatedTarget as HTMLElement;
      if (!target || !target.closest) {
        // If cursor moves out of the viewport
        if (hoverStateRef.current) {
          hoverStateRef.current = false;
          setIsHovered(false);
        }
        setCursorLabel("");
        return;
      }
      const isOverInteractive = !!target.closest(
        'a, button, input, select, textarea, [role="button"], label'
      );
      if (isOverInteractive !== hoverStateRef.current) {
        hoverStateRef.current = isOverInteractive;
        setIsHovered(isOverInteractive);
      }

      // Handle data-cursor-label
      const labeledElement = target.closest('[data-cursor-label]');
      if (labeledElement) {
        setCursorLabel(labeledElement.getAttribute('data-cursor-label') || "");
      } else {
        setCursorLabel("");
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown, { passive: true });
    window.addEventListener("mouseup", handleMouseUp, { passive: true });
    
    // Bind delegation listeners
    document.addEventListener("mouseover", handleMouseOver, { passive: true });
    document.addEventListener("mouseout", handleMouseOut, { passive: true });

    // Single requestAnimationFrame loop driving BOTH dot and ring positioning
    const render = () => {
      // 1. Snappy dot positioning (lerp = 0.65)
      const dotLerp = 0.65;
      dotPosRef.current.x += (mouseRef.current.x - dotPosRef.current.x) * dotLerp;
      dotPosRef.current.y += (mouseRef.current.y - dotPosRef.current.y) * dotLerp;

      if (dotRef.current) {
        // Subtract half-width/height (4px for h-2 w-2 dot) to center precisely without CSS class conflicts
        dotRef.current.style.transform = `translate3d(${dotPosRef.current.x - 4}px, ${dotPosRef.current.y - 4}px, 0)`;
      }

      // 2. Responsive ring trailing (lerp = 0.35)
      const ringLerp = 0.35;
      ringPosRef.current.x += (mouseRef.current.x - ringPosRef.current.x) * ringLerp;
      ringPosRef.current.y += (mouseRef.current.y - ringPosRef.current.y) * ringLerp;

      if (ringRef.current) {
        // Subtract half-width/height (16px for h-8 w-8 ring) to center precisely without CSS class conflicts
        ringRef.current.style.transform = `translate3d(${ringPosRef.current.x - 16}px, ${ringPosRef.current.y - 16}px, 0)`;
      }

      // 3. Soft trailing glow halo (slow lerp = 0.10 for a dreamy lag)
      const glowLerp = 0.1;
      glowPosRef.current.x += (mouseRef.current.x - glowPosRef.current.x) * glowLerp;
      glowPosRef.current.y += (mouseRef.current.y - glowPosRef.current.y) * glowLerp;
      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${glowPosRef.current.x - 80}px, ${glowPosRef.current.y - 80}px, 0)`;
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  if (!isEnabled) return null;

  return (
    <>
      {/* Trailing glow halo: slow lerp, sits behind everything */}
      <div
        ref={glowRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[997] select-none"
        style={{ willChange: "transform" }}
      >
        <div
          className="h-40 w-40 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(43,160,220,0.10), rgba(67,194,216,0.05) 45%, transparent 70%)",
            filter: "blur(6px)",
          }}
        />
      </div>

      {/* Inner Dot Wrapper: Pure translate3d, no transition, centered in JS */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[999] select-none mix-blend-difference"
        style={{ willChange: "transform" }}
      >
        {/* Visual Dot */}
        <div className="h-2 w-2 rounded-full bg-white" />
      </div>

      {/* Outer Ring Wrapper: Pure translate3d, no transition, centered in JS */}
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[998] select-none flex items-center justify-center"
        style={{ willChange: "transform" }}
      >
        {/* Visual Ring: Styled and scaled via CSS transitions */}
        <div
          className={`h-8 w-8 rounded-full border border-signature/60 transition-[transform,background-color,border-color,box-shadow] duration-150 ease-out flex items-center justify-center relative ${
            isHovered
              ? "scale-[1.8] border-signature bg-signature/10 shadow-[0_0_15px_rgba(43,160,220,0.4)]"
              : ""
          } ${isClicked ? "scale-[0.6] bg-signature/20" : ""}`}
        >
          {cursorLabel && (
            <span className="absolute text-[8px] font-extrabold text-white tracking-widest uppercase scale-[0.6] origin-center font-mono select-none">
              {cursorLabel}
            </span>
          )}
        </div>
      </div>
    </>
  );
}
