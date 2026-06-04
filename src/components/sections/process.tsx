"use client";

import React from "react";
import { motion } from "framer-motion";
import { BRAND_CONFIG } from "@/config/content";
import CornerBorders from "../ui/corner-borders";

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
      className="py-20 md:py-28 px-6 md:px-12 lg:px-24 bg-[#020203] w-full overflow-hidden"
    >
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

          {/* Timeline Cards Grid */}
          <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Background connection line for desktop */}
            <div 
              className="hidden lg:block absolute top-[40px] left-[5%] right-[5%] h-[1px] bg-border-custom/30 -z-10" 
              aria-hidden="true"
            />
            {/* Progress line driven by GSAP ScrollTrigger */}
            <div 
              id="process-progress-line"
              className="hidden lg:block absolute top-[40px] left-[5%] h-[1px] bg-signature origin-left scale-x-0 -z-10" 
              style={{ width: "90%" }}
              aria-hidden="true"
            />

            {BRAND_CONFIG.process.map((step) => (
              <motion.div
                key={step.step}
                variants={revealVariants}
                className="group relative"
              >
                <CornerBorders className="h-full p-8 bg-surface-raised/20 backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 glow-border">
                  <div className="flex flex-col gap-5">
                    
                    {/* Glowing Step Indicator */}
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-3xl font-extrabold text-signature tracking-tighter glow-accent">
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
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
