"use client";

import React from "react";
import { motion } from "framer-motion";
import AmbientOrbs from "../ui/ambient";
import { BRAND_CONFIG } from "@/config/content";
import CornerBorders from "../ui/corner-borders";
import { AlertCircle } from "lucide-react";

export default function ProblemAgitation() {
  const { problem } = BRAND_CONFIG;

  if (!problem) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <section
      id="problem"
      className="relative py-20 md:py-28 px-6 md:px-12 lg:px-24 bg-[#020203] w-full overflow-hidden"
    >
      <AmbientOrbs />
      <div className="max-w-6xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col gap-16"
        >
          {/* Header */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <motion.div variants={itemVariants} className="lg:col-span-5 flex flex-col gap-2">
              <span className="text-xs font-mono tracking-widest text-red-500/80 uppercase">
                {problem.eyebrow}
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white font-sora">
                {problem.heading}
              </h2>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="lg:col-span-7 text-sm md:text-base text-text-tertiary leading-relaxed pt-2"
            >
              <p className="max-w-2xl">{problem.description}</p>
            </motion.div>
          </div>

          {/* Pain Points Grid */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {problem.painPoints.map((point) => (
              <motion.div key={point.title} variants={itemVariants} className="group">
                <CornerBorders className="h-full p-6 glass-card-premium hover:-translate-y-1.5 hover:!border-red-500/30 hover:shadow-[0_10px_35px_-10px_rgba(239,68,68,0.12)]">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-red-500/60 uppercase">
                        critical // error
                      </span>
                      <AlertCircle className="h-4.5 w-4.5 text-red-500/60 group-hover:text-red-500 transition-colors duration-200" />
                    </div>
                    <h3 className="text-base font-bold tracking-tight text-white font-sora group-hover:text-red-400 transition-colors duration-200">
                      {point.title}
                    </h3>
                    <p className="text-xs text-text-tertiary leading-relaxed">
                      {point.description}
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
