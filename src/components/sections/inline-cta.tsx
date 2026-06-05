"use client";

import React from "react";
import { motion } from "framer-motion";
import { BRAND_CONFIG } from "@/config/content";
import { scrollToElement } from "@/components/ui/smooth-scroll-provider";
import CornerBorders from "../ui/corner-borders";
import Magnetic from "../ui/magnetic";

interface InlineCTAProps {
  heading: string;
}

export default function InlineCTA({ heading }: InlineCTAProps) {
  const handlePrimaryClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    scrollToElement("#contact");
  };

  const handleSecondaryClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    scrollToElement("#process");
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <section className="relative w-full py-16 px-6 md:px-12 lg:px-24 bg-[#020203] overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <CornerBorders className="p-8 md:p-12 glass-card-premium hover:-translate-y-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="flex flex-col gap-2 max-w-lg">
                <span className="text-[10px] font-mono tracking-[0.2em] text-signature uppercase">
                  AI_BUDDIES // AGENT_GATEWAY
                </span>
                <h3 className="text-xl md:text-2xl font-extrabold tracking-tight text-white font-sora">
                  {heading}
                </h3>
              </div>

              <div className="flex flex-col gap-3 shrink-0">
                <div className="flex flex-wrap gap-4 items-center">
                  <Magnetic>
                    <a
                      href="#contact"
                      onClick={handlePrimaryClick}
                      className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-signature text-black font-extrabold uppercase tracking-wider text-xs border border-signature/80 hover:bg-transparent hover:text-white transition-all duration-300 hover:shadow-[0_0_15px_rgba(43,160,220,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signature"
                    >
                      {BRAND_CONFIG.closingCTA.primaryBtn}
                    </a>
                  </Magnetic>

                  <a
                    href="#process"
                    onClick={handleSecondaryClick}
                    className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-border-custom/50 bg-surface-raised/40 backdrop-blur text-white font-extrabold uppercase tracking-wider text-xs hover:border-white transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signature"
                  >
                    {(BRAND_CONFIG as any).ctaSystem?.secondaryBtnText || "See how it works"}
                  </a>
                </div>

                <p className="text-[11px] text-text-tertiary/70 font-mono text-center md:text-left pl-1">
                  {(BRAND_CONFIG as any).ctaSystem?.benefitLine}
                </p>
              </div>
            </div>
          </CornerBorders>
        </motion.div>
      </div>
    </section>
  );
}
