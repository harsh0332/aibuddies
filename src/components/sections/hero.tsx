"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { BRAND_CONFIG } from "@/config/content";
import { scrollToElement } from "@/components/ui/smooth-scroll-provider";

// Lazy-load the Three.js Canvas to optimize initial load and avoid SSR issues
const HeroCanvas = dynamic(() => import("./hero-canvas"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-[#000000] bg-[radial-gradient(circle_at_center,rgba(43,160,220,0.08),transparent_70%)]" />
  ),
});

export default function Hero() {
  const [showCanvas, setShowCanvas] = useState(false);

  useEffect(() => {
    // Check user preferences to decide whether to run the heavy 3D canvas
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Show canvas only on non-touch desktop devices when reduced motion is disabled
    if (!isTouch && !prefersReducedMotion) {
      setShowCanvas(true);
    }
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as const, // Custom premium cubic-bezier easing
      },
    },
  };

  const handleCTAClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    scrollToElement("#contact");
  };

  return (
    <section 
      id="hero" 
      className="relative min-h-[92vh] w-full flex items-center justify-start overflow-hidden pt-24 md:pt-32 pb-20 px-6 md:px-12 lg:px-24 bg-[#000000]"
    >
      {/* Premium Light Beam / Ray Ambient Glows */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-[120%] pointer-events-none select-none opacity-25 z-0"
        style={{
          background: "radial-gradient(ellipse at top, rgba(43,160,220,0.18) 0%, rgba(14,95,181,0.05) 50%, transparent 80%)"
        }}
        aria-hidden="true"
      />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[85vw] h-[100vh] pointer-events-none select-none opacity-[0.07] z-0"
        style={{
          background: "conic-gradient(from 180deg at 50% 0%, transparent 40%, var(--color-signature) 48%, var(--color-signature-bright) 50%, var(--color-signature) 52%, transparent 60%)",
          filter: "blur(70px)"
        }}
        aria-hidden="true"
      />

      {/* 3D Canvas or Radial Gradient Fallback */}
      {showCanvas ? (
        <HeroCanvas />
      ) : (
        <div 
          className="absolute inset-0 bg-[#000000] bg-[radial-gradient(circle_at_center,rgba(43,160,220,0.12),transparent_60%)] z-0" 
          aria-hidden="true"
        />
      )}

      {/* Grid Pattern overlay for tech feel */}
      <div 
        className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none select-none z-1" 
        aria-hidden="true"
      />

      {/* Subtle glowing ambient background spheres */}
      <div 
        className="absolute top-1/4 right-1/4 w-80 h-80 rounded-full bg-signature/10 blur-[130px] animate-glow-pulse pointer-events-none select-none z-0"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-4xl w-full text-left">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-6"
        >
          {/* Category Line */}
          <motion.div variants={itemVariants}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-signature/30 bg-signature/5 text-xs font-mono tracking-[0.2em] text-signature uppercase select-none">
              <span className="h-1.5 w-1.5 rounded-full bg-signature animate-pulse-slow" />
              {BRAND_CONFIG.categoryLine}
            </span>
          </motion.div>

          {/* Tagline Heading */}
          <motion.h1 
            variants={itemVariants}
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white font-sora leading-[1.1] max-w-3xl"
          >
            We build{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-text-secondary to-signature">
              AI systems
            </span>{" "}
            that run your business.
          </motion.h1>

          {/* Positioning Description */}
          <motion.p 
            variants={itemVariants}
            className="text-base md:text-lg text-text-tertiary max-w-2xl leading-relaxed"
          >
            {BRAND_CONFIG.positioning}
          </motion.p>

          {/* Call to Action Buttons */}
          <motion.div 
          variants={itemVariants}
            className="flex flex-wrap gap-4 mt-4"
          >
            <a
              href="#contact"
              onClick={handleCTAClick}
              className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-signature text-black font-bold uppercase tracking-wider text-xs md:text-sm border border-signature/80 hover:bg-transparent hover:text-white transition-all duration-300 hover:shadow-[0_0_20px_rgba(43,160,220,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signature"
            >
              {BRAND_CONFIG.closingCTA.primaryBtn}
            </a>
            
            <a
              href="#services"
              onClick={(e) => {
                e.preventDefault();
                scrollToElement("#services");
              }}
              className="inline-flex items-center justify-center px-8 py-4 rounded-full border border-border-custom/50 bg-surface-raised/40 backdrop-blur text-white font-bold uppercase tracking-wider text-xs md:text-sm hover:border-white transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signature"
            >
              Explore Solutions
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom fade cover */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent pointer-events-none select-none z-1" 
        aria-hidden="true"
      />
    </section>
  );
}
