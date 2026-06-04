"use client";

import React from "react";
import { motion } from "framer-motion";
import { BRAND_CONFIG } from "@/config/content";
import { scrollToElement } from "@/components/ui/smooth-scroll-provider";
import ReelCounter from "../ui/reel-counter";

interface HeroProps {
  is3DActive?: boolean;
}

export default function Hero({ is3DActive = false }: HeroProps) {
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
    hidden: { opacity: 0, y: 24 },
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
      className={`relative min-h-screen w-full flex flex-col justify-between overflow-hidden pt-28 md:pt-36 pb-16 px-6 md:px-12 lg:px-24 transition-colors duration-500 ${
        is3DActive ? "bg-transparent" : "bg-[#000000]"
      }`}
    >
      {/* Premium Light Beam / Ray Ambient Glows */}
      <div 
        className="hero-light-ray absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-[120%] pointer-events-none select-none opacity-25 z-0"
        style={{
          background: "radial-gradient(ellipse at top, rgba(43,160,220,0.18) 0%, rgba(14,95,181,0.05) 50%, transparent 80%)"
        }}
        aria-hidden="true"
      />
      <div
        className="hero-light-ray absolute top-0 left-1/2 -translate-x-1/2 w-[85vw] h-[100vh] pointer-events-none select-none opacity-[0.07] z-0"
        style={{
          background: "conic-gradient(from 180deg at 50% 0%, transparent 40%, var(--color-signature) 48%, var(--color-signature-bright) 50%, var(--color-signature) 52%, transparent 60%)",
          filter: "blur(70px)"
        }}
        aria-hidden="true"
      />

      {/* 3D Canvas Background Overlay (Solid black fallback for mobile, transparent glow for 3D) */}
      <div 
        className={`absolute inset-0 z-0 ${
          is3DActive 
            ? "bg-[radial-gradient(circle_at_center,rgba(43,160,220,0.12),transparent_60%)]" 
            : "bg-[#000000] bg-[radial-gradient(circle_at_center,rgba(43,160,220,0.12),transparent_60%)]"
        }`} 
        aria-hidden="true"
      />

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

      <div className="relative z-10 max-w-5xl w-full text-left flex flex-col justify-center flex-1 py-12">
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

          {/* Tagline Heading with horizontal sliding meeting lines */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white font-sora leading-[1.1] max-w-4xl overflow-hidden flex flex-col gap-2">
            <motion.div
              initial={{ opacity: 0, x: 120 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="flex items-center flex-wrap gap-x-3"
            >
              We Build
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-text-secondary to-signature">
                AI Systems
              </span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -120 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
              className="text-left font-light text-2xl md:text-4xl lg:text-5xl text-text-secondary mt-1"
            >
              that run your business — so you don't have to.
            </motion.div>
          </h1>

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

      {/* Hero Stats Section at the bottom */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
        className="relative z-10 w-full max-w-5xl border-t border-border-custom/15 pt-8 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-8"
      >
        <div className="flex flex-col md:flex-row justify-between w-full gap-6 md:gap-4 items-start md:items-center" id="hero-stats">
          <div className="flex max-w-xs lg:max-w-md flex-col gap-2">
            <p className="text-sm text-text-tertiary">
              We empower organizations with AI that turns complex challenges into real-world outcomes.
            </p>
          </div>
          
          <div className="flex text-xs md:text-sm gap-8 lg:gap-16 justify-between w-full md:w-auto">
            <div className="flex items-center gap-3">
              <div className="text-3xl lg:text-4xl text-white font-bold flex items-baseline">
                <ReelCounter value="15" />
                <span className="text-signature ml-0.5 font-sans font-medium">+</span>
              </div>
              <div className="text-xs text-text-tertiary leading-tight font-mono uppercase tracking-wider">
                Projects <br /> Delivered
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-3xl lg:text-4xl text-white font-bold flex items-baseline">
                <ReelCounter value="100" />
                <span className="text-signature ml-0.5 font-sans font-medium">%</span>
              </div>
              <div className="text-xs text-text-tertiary leading-tight font-mono uppercase tracking-wider">
                Client <br /> Satisfaction
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-3xl lg:text-4xl text-white font-bold font-mono">
                24<span className="text-signature font-sans">/</span>7
              </div>
              <div className="text-xs text-text-tertiary leading-tight font-mono uppercase tracking-wider">
                Support <br /> Available
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Bottom fade cover */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent pointer-events-none select-none z-1" 
        aria-hidden="true"
      />
    </section>
  );
}
