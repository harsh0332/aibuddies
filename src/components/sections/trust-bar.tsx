"use client";

import React from "react";
import { motion } from "framer-motion";
import { BRAND_CONFIG } from "@/config/content";
import CornerBorders from "../ui/corner-borders";
import ReelCounter from "../ui/reel-counter";

export default function TrustBar() {
  const { clients, trustStat } = BRAND_CONFIG;
  const hasStat = trustStat && trustStat.value && trustStat.label;

  // Clean / display name mappings for logo-chips
  const displayNames: Record<string, string> = {
    "Bluhawk Marketing": "Bluhawk",
    "MP Fertility Centre": "MP Fertility Centre",
    "DPM Entertainment Pvt. Ltd.": "DPM Entertainment",
    "Host Dhanraj": "Host Dhanraj",
    "InnovateX Media": "InnovateX Media",
    "Bizparadise10X": "Bizparadise10X",
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
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
    <section id="trust-bar" className="relative z-20 w-full py-12 border-y border-border-custom/40 bg-[#020203] px-6 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className={`grid items-center gap-8 ${
            hasStat ? "grid-cols-1 lg:grid-cols-12" : "grid-cols-1"
          }`}
        >
          {/* Headline Stat Column (If configured) */}
          {hasStat && (
            <motion.div
              variants={itemVariants}
              className="lg:col-span-4 flex flex-col items-start gap-1 border-l-2 border-signature pl-4"
            >
              <span className="font-mono text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                <ReelCounter value={trustStat.value} />
              </span>
              <span className="text-xs uppercase tracking-wider text-text-tertiary font-mono">
                {trustStat.label}
              </span>
            </motion.div>
          )}

          {/* Client Logo Grid Column */}
          <motion.div
            variants={itemVariants}
            className={`w-full flex flex-wrap gap-3 items-center ${
              hasStat ? "lg:col-span-8 justify-start lg:justify-end" : "justify-center"
            }`}
          >
            <div className={`w-full text-center mb-2 lg:text-left ${!hasStat && "text-center"}`}>
              <span className="text-[10px] font-mono tracking-widest text-signature/70 uppercase">
                Trusted by Forward-Thinking Brands
              </span>
            </div>
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              {clients.map((client) => {
                const displayName = displayNames[client.name] || client.name;
                return (
                  <div key={client.name} className="relative group">
                    <CornerBorders className="px-5 py-2.5 bg-surface-raised/30 backdrop-blur-sm hover:bg-surface-raised/60 transition-all duration-300">
                      <span className="text-xs font-mono font-semibold text-text-secondary group-hover:text-signature transition-colors duration-200">
                        {displayName}
                      </span>
                    </CornerBorders>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
