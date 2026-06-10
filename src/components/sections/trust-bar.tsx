"use client";

import React from "react";
import { motion } from "framer-motion";
import { BRAND_CONFIG } from "@/config/content";
import CornerBorders from "../ui/corner-borders";
import { useCountUp } from "@/hooks/use-count-up";

interface CountUpStatProps {
  value: number;
  suffix?: string;
}

function CountUpStat({ value, suffix = "" }: CountUpStatProps) {
  const { count, ref } = useCountUp(value);
  return (
    <span ref={ref as any}>
      {count}
      {suffix}
    </span>
  );
}

export default function TrustBar() {
  const { clients, trustStats } = BRAND_CONFIG;

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
      <div aria-hidden className="energy-line absolute top-0 left-0 right-0" />
      <div className="max-w-6xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center"
        >
          {/* Stats Column */}
          <div className="lg:col-span-5 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-6">
            {trustStats && trustStats.map((stat, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="flex flex-col items-start gap-1 border-l-2 border-signature/60 pl-4"
              >
                <span className="font-mono text-2xl md:text-3xl lg:text-2xl xl:text-3xl font-extrabold text-white tracking-tight">
                  {stat.display ? (
                    <span>{stat.display}</span>
                  ) : (
                    <CountUpStat value={stat.value} suffix={stat.suffix} />
                  )}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-text-tertiary font-mono leading-tight">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Client Logo Grid Column */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-7 w-full flex flex-col gap-4"
          >
            <div className="text-center lg:text-left">
              <span className="inline-flex items-center gap-2 text-[10px] font-mono tracking-widest text-signature/70 uppercase">
                <span className="live-dot" aria-hidden />
                Trusted by Forward-Thinking Brands
              </span>
            </div>
            <div className="marquee-mask w-full">
              <div className="marquee-track">
                {[...clients, ...clients].map((client, i) => {
                  const displayName = displayNames[client.name] || client.name;
                  return (
                    <div key={`${client.name}-${i}`} className="relative group shrink-0">
                      <CornerBorders className="px-5 py-2.5 bg-surface-raised/30 backdrop-blur-sm hover:bg-surface-raised/60 transition-all duration-300">
                        <span className="text-xs font-mono font-semibold text-text-secondary group-hover:text-signature transition-colors duration-200 whitespace-nowrap">
                          {displayName}
                        </span>
                      </CornerBorders>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
