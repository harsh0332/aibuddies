/* eslint-disable */
"use client";
 
import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import AmbientOrbs from "../ui/ambient";
import { BRAND_CONFIG } from "@/config/content";
import CornerBorders from "../ui/corner-borders";

interface ProcessCardProps {
  step: {
    step: string;
    title: string;
    description: string;
  };
  revealVariants: any;
}

function ProcessCard({ step, revealVariants }: ProcessCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      ref={cardRef}
      variants={revealVariants}
      className="group relative process-card"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Connection Dot/Node - Desktop */}
      <div 
        className="hidden lg:block absolute top-[34px] left-[-6px] z-20 size-3 rounded-full border border-border-custom bg-surface-raised transition-all duration-500 group-[.active-step]:bg-signature group-[.active-step]:border-signature group-[.active-step]:scale-125"
      >
        <div className="absolute inset-0 rounded-full bg-signature animate-ping opacity-0 group-[.active-step]:opacity-35" />
      </div>

      {/* Connection Dot/Node - Mobile */}
      <div 
        className="lg:hidden absolute top-1/2 left-[-31px] -translate-y-1/2 z-20 size-3.5 rounded-full border border-border-custom bg-surface-raised transition-all duration-500 group-[.active-step]:bg-signature group-[.active-step]:border-signature group-[.active-step]:scale-125"
      >
        <div className="absolute inset-0 rounded-full bg-signature animate-ping opacity-0 group-[.active-step]:opacity-35" />
      </div>

      <CornerBorders className="h-full p-8 bg-surface-raised/20 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 glow-border group-[.active-step]:border-signature/40 group-[.active-step]:bg-surface-raised/35 overflow-hidden">
        {/* Spotlight overlay tracking the cursor */}
        <div 
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-0"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(circle 120px at ${coords.x}px ${coords.y}px, rgba(43,160,220,0.15), transparent 80%)`
          }}
        />

        <div className="relative z-10 flex flex-col gap-5">
          {/* Glowing Step Indicator */}
          <div className="flex items-center justify-between">
            <span className="font-mono text-3xl font-extrabold text-text-tertiary/30 tracking-tighter transition-colors duration-500 group-[.active-step]:text-signature group-[.active-step]:glow-accent">
              {step.step}
            </span>
            <span className="text-[9px] font-mono text-text-tertiary/40 uppercase">
              Phase // Active
            </span>
          </div>

          {/* Step Title */}
          <h3 className="text-lg font-bold tracking-tight text-white font-sora group-hover:text-signature transition-colors duration-200">
            {step.title}
          </h3>

          {/* Step Description */}
          <p className="text-sm text-text-tertiary leading-relaxed">
            {step.description}
          </p>
        </div>
      </CornerBorders>
    </motion.div>
  );
}

export default function Process() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const revealVariants = {
    hidden: { opacity: 0, y: 35 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <section 
      id="process" 
      className="relative py-20 md:py-28 px-6 md:px-12 lg:px-24 bg-[#020203] w-full overflow-hidden"
    >
      <AmbientOrbs flip />
      <div className="max-w-6xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col gap-16"
        >
          {/* Section Header */}
          <div className="flex flex-col gap-4 max-w-2xl">
            <span className="text-xs font-mono tracking-widest text-signature uppercase">
              04 / Execution Pipeline
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white font-sora">
              Our Process
            </h2>
            <p className="text-base text-text-tertiary leading-relaxed">
              We design, build, and deploy systems that run your business while you sleep. A structured timeline built for maximum speed and scale.
            </p>
          </div>

          {/* Timeline Cards Grid with mobile margin offset to fit vertical line */}
          <div className="relative pl-10 lg:pl-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Background connection line for desktop */}
            <div 
              className="hidden lg:block absolute top-[40px] left-[5%] right-[5%] h-[1px] bg-border-custom/30 -z-10" 
              aria-hidden="true"
            />
            {/* Progress line driven by GSAP ScrollTrigger for desktop */}
            <div 
              id="process-progress-line"
              className="hidden lg:block absolute top-[40px] left-[5%] h-[1px] bg-signature origin-left scale-x-0 -z-10" 
              style={{ width: "90%" }}
              aria-hidden="true"
            />

            {/* Background connection line for mobile */}
            <div 
              className="lg:hidden absolute left-[16px] top-4 bottom-4 w-[1px] bg-border-custom/25 -z-10" 
              aria-hidden="true"
            />
            {/* Progress line driven by GSAP ScrollTrigger for mobile */}
            <div 
              id="process-progress-line-mobile"
              className="lg:hidden absolute left-[16px] top-4 bottom-4 w-[1px] bg-signature origin-top scale-y-0 -z-10" 
              aria-hidden="true"
            />

            {BRAND_CONFIG.process.map((step) => (
              <ProcessCard
                key={step.step}
                step={step}
                revealVariants={revealVariants}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
