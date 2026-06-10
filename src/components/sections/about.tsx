"use client";

import React from "react";
import { motion } from "framer-motion";
import { BRAND_CONFIG } from "@/config/content";
import CornerBorders from "../ui/corner-borders";

export default function About() {
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
    hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.45,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <section 
      id="about" 
      className="py-20 md:py-28 px-6 md:px-12 lg:px-24 bg-surface-base w-full overflow-hidden"
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <motion.div 
              variants={revealVariants}
              className="lg:col-span-4 flex flex-col gap-2"
            >
              <span className="text-xs font-mono tracking-widest text-signature uppercase">
                01 / Who We Are
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white font-sora">
                Building the Autonomous Layer
              </h2>
            </motion.div>

            <motion.div 
              variants={revealVariants}
              className="lg:col-span-8 text-base md:text-lg text-text-tertiary leading-relaxed"
            >
              <p className="max-w-3xl">
                {BRAND_CONFIG.positioning}
              </p>
            </motion.div>
          </div>

          {/* Pillars Grid */}
          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4"
          >
            {BRAND_CONFIG.pillars.map((pillar, index) => (
              <motion.div
                key={pillar.title}
                variants={revealVariants}
                className="group"
              >
                <CornerBorders className={`h-full p-8 glass-card-premium hover:-translate-y-1.5 float-${(index % 3) + 1}`}>
                  <div className="flex flex-col gap-4">
                    {/* Step Count */}
                    <div className="font-mono text-xs text-signature/50 font-bold">
                      PILLAR // 0{index + 1}
                    </div>
                    {/* Title */}
                    <h3 className="text-xl font-bold tracking-tight text-white font-sora group-hover:text-signature transition-colors duration-200">
                      {pillar.title}
                    </h3>
                    {/* Description */}
                    <p className="text-sm text-text-tertiary leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </CornerBorders>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
