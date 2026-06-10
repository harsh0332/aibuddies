"use client";

import React from "react";
import { motion } from "framer-motion";
import { BRAND_CONFIG } from "@/config/content";
import CornerBorders from "../ui/corner-borders";
import Tilt from "../ui/tilt";
import { Briefcase, ArrowUpRight } from "lucide-react";

export default function Portfolio() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
      id="portfolio" 
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
          <div className="flex flex-col gap-4 max-w-2xl">
            <span className="text-xs font-mono tracking-widest text-signature uppercase">
              05 / Client Deployments
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white font-sora">
              Case Studies & Portfolio
            </h2>
            <motion.div
              aria-hidden
              variants={{ hidden: { width: 0 }, visible: { width: 64, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as const, delay: 0.3 } } }}
              className="h-0.5 bg-gradient-to-r from-signature to-transparent rounded-full"
            />
            <p className="text-base text-text-tertiary leading-relaxed">
              We deploy automated business systems across clinics, media companies, marketing agencies, and hosting firms. Real infrastructure powering active operations.
            </p>
          </div>

          {/* Portfolio Grid */}
          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {BRAND_CONFIG.clients.map((client) => (
              <motion.div
                key={client.name}
                variants={revealVariants}
                className="group"
                data-cursor-label="View"
              >
                <Tilt className="h-full rounded-[12px]">
                <CornerBorders className="h-full p-8 glass-card-premium hover:-translate-y-1.5 flex flex-col justify-between">
                  <div className="flex flex-col gap-6">
                    {/* Header: Service Badge */}
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-signature/10 border border-signature/20 text-[10px] font-mono font-semibold tracking-wider text-signature uppercase">
                        {client.service}
                      </span>
                      <ArrowUpRight className="h-4 w-4 text-text-tertiary/40 group-hover:text-signature group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
                    </div>

                    {/* Client Name */}
                    <h3 className="text-xl font-bold tracking-tight text-white font-sora group-hover:text-signature transition-colors duration-200">
                      {client.name}
                    </h3>

                    {/* Core Deployment Highlights */}
                    <p className="text-sm text-text-tertiary leading-relaxed">
                      {client.highlight}
                    </p>
                  </div>

                  {/* Footing note */}
                  <div className="text-[10px] font-mono text-text-tertiary/30 uppercase mt-6 pt-4 border-t border-border-custom/25">
                    DEPLOYMENT // COMPILED
                  </div>
                </CornerBorders>
                </Tilt>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
