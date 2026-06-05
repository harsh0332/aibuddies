"use client";

import { useState, useEffect, useRef } from "react";
import { useInView } from "framer-motion";

export function useCountUp(target: number, duration: number = 1500) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref as any, { once: true, margin: "-50px" });

  useEffect(() => {
    // Respect user prefers-reduced-motion preference
    if (typeof window !== "undefined") {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReduced) {
        setCount(target);
        return;
      }
    }

    if (!inView) return;

    let start = 0;
    const end = target;
    if (start === end) {
      setCount(end);
      return;
    }

    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const progressRatio = Math.min(progress / duration, 1);
      
      // easeOutQuad easing curve: t * (2 - t)
      const easeProgress = progressRatio * (2 - progressRatio);
      const currentCount = Math.floor(easeProgress * (end - start) + start);
      setCount(currentCount);

      if (progress < duration) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(animate);
  }, [inView, target, duration]);

  return { count, ref };
}
