"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  
  const [isEnabled, setIsEnabled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  
  const mouseRef = useRef({ x: 0, y: 0 });
  const ringPosRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number | null>(null);

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
      
      // Update dot position 1:1 instantly
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);

    // Setup hover listeners for interactive elements
    const addHoverListeners = () => {
      const interactives = document.querySelectorAll('a, button, input, select, textarea, [role="button"], label');
      interactives.forEach((el) => {
        el.addEventListener("mouseenter", handleMouseEnter);
        el.addEventListener("mouseleave", handleMouseLeave);
      });
    };

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    
    // We observe mutations in the DOM to attach listeners to dynamically mounted components
    const observer = new MutationObserver(addHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });
    
    addHoverListeners();

    // Smooth Lerp loop for the outer ring
    const render = () => {
      const lerp = 0.15;
      
      ringPosRef.current.x += (mouseRef.current.x - ringPosRef.current.x) * lerp;
      ringPosRef.current.y += (mouseRef.current.y - ringPosRef.current.y) * lerp;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPosRef.current.x}px, ${ringPosRef.current.y}px, 0)`;
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      observer.disconnect();
      const interactives = document.querySelectorAll('a, button, input, select, textarea, [role="button"], label');
      interactives.forEach((el) => {
        el.removeEventListener("mouseenter", handleMouseEnter);
        el.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, []);

  if (!isEnabled) return null;

  return (
    <>
      {/* Inner Dot: follows cursor 1:1 */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[999] h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white transition-opacity duration-300 select-none mix-blend-difference"
      />
      {/* Outer Ring: trails cursor via lerp */}
      <div
        ref={ringRef}
        className={`pointer-events-none fixed left-0 top-0 z-[998] h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-signature/60 transition-all duration-200 ease-out select-none ${
          isHovered
            ? "scale-[1.8] border-signature bg-signature/10 shadow-[0_0_15px_rgba(43,160,220,0.4)]"
            : ""
        } ${isClicked ? "scale-[0.6] bg-signature/20" : ""}`}
      />
    </>
  );
}
