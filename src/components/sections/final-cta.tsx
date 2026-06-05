"use client";

import React from "react";
import { motion } from "framer-motion";
import { BRAND_CONFIG } from "@/config/content";
import CornerBorders from "../ui/corner-borders";
import { scrollToElement } from "@/components/ui/smooth-scroll-provider";
import Magnetic from "../ui/magnetic";

export default function FinalCTA() {
  const containerVariants = {
    hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  const handleCTAClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    scrollToElement("#contact");
  };

  return (
    <section 
      className="py-20 md:py-28 px-6 md:px-12 lg:px-24 bg-surface-base w-full overflow-hidden"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="relative"
        >
          {/* Radial signature glow */}
          <div 
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(43,160,220,0.08),transparent_60%)] -z-10 rounded-3xl" 
            aria-hidden="true" 
          />

          <CornerBorders className="p-8 md:p-16 text-center glass-card-premium">
            <div className="flex flex-col items-center gap-6 max-w-2xl mx-auto">
              {/* Category tag */}
              <span className="text-[10px] font-mono tracking-[0.25em] text-signature uppercase">
                AUTOMATION CORE // FINAL_GATE
              </span>
              
              {/* Closing Heading */}
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white font-sora leading-tight">
                {BRAND_CONFIG.closingCTA.heading}
              </h2>
              
              {/* Closing Subheading */}
              <p className="text-sm md:text-base text-text-tertiary leading-relaxed">
                {BRAND_CONFIG.closingCTA.subheading}
              </p>
              
              {/* CTA Action button */}
              <div className="mt-4 flex flex-col gap-3 items-center">
                <div className="flex flex-wrap gap-4 justify-center">
                  <Magnetic>
                    <a
                      href="#contact"
                      onClick={handleCTAClick}
                      className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-signature text-black font-extrabold uppercase tracking-wider text-xs md:text-sm border border-signature/80 hover:bg-transparent hover:text-white transition-all duration-300 hover:shadow-[0_0_20px_rgba(43,160,220,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signature"
                    >
                      {BRAND_CONFIG.closingCTA.primaryBtn}
                    </a>
                  </Magnetic>

                  <a
                    href="#process"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToElement("#process");
                    }}
                    className="inline-flex items-center justify-center px-8 py-4 rounded-full border border-border-custom/50 bg-surface-raised/40 backdrop-blur text-white font-extrabold uppercase tracking-wider text-xs md:text-sm hover:border-white transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signature"
                  >
                    {(BRAND_CONFIG as any).ctaSystem?.secondaryBtnText || "See how it works"}
                  </a>
                </div>

                <p className="text-xs text-text-tertiary/80 font-mono">
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
