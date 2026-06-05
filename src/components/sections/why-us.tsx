"use client";

import React from "react";
import { motion } from "framer-motion";
import { BRAND_CONFIG } from "@/config/content";
import CornerBorders from "../ui/corner-borders";
import { Zap, Clock, ShieldCheck, TrendingUp, Cpu } from "lucide-react";
import { scrollToElement } from "@/components/ui/smooth-scroll-provider";

export default function WhyUs() {
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

  // Map reasons to specific Lucide icons
  const getIcon = (title: string) => {
    switch (title) {
      case "Fast Delivery":
        return <Zap className="h-6 w-6 text-signature" />;
      case "24/7 Running":
        return <Clock className="h-6 w-6 text-signature" />;
      case "n8n Powered":
        return <Cpu className="h-6 w-6 text-signature" />;
      case "Real Results":
        return <TrendingUp className="h-6 w-6 text-signature" />;
      case "Full Stack":
        return <ShieldCheck className="h-6 w-6 text-signature" />;
      default:
        return <Cpu className="h-6 w-6 text-signature" />;
    }
  };

  return (
    <section 
      id="why-us" 
      className="py-20 md:py-28 px-6 md:px-12 lg:px-24 bg-[#020203] w-full overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start"
        >
          {/* Left Column: Heading and intro copy */}
          <motion.div 
            variants={revealVariants}
            className="lg:col-span-4 flex flex-col gap-6 sticky top-28"
          >
            <div className="flex flex-col gap-2">
              <span className="text-xs font-mono tracking-widest text-signature uppercase">
                06 / Our Edge
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white font-sora leading-tight">
                Why Choose Us?
              </h2>
            </div>
            
            <p className="text-sm md:text-base text-text-tertiary leading-relaxed">
              We focus on building reliable production-grade architectures. No brittle custom scripts or slow enterprise timelines. We deliver functional AI systems in days.
            </p>

            <div className="mt-2 hidden lg:block">
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToElement("#contact");
                }}
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-full bg-signature text-black font-semibold text-xs uppercase tracking-wider border border-signature/80 hover:bg-transparent hover:text-white transition-all duration-300"
              >
                Schedule Consultation
              </a>
            </div>
          </motion.div>

          {/* Right Column: Grid of why-us cards */}
          <motion.div 
            variants={containerVariants}
            className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {BRAND_CONFIG.whyUs.map((reason, index) => (
              <motion.div
                key={reason.title}
                variants={revealVariants}
                className={`group ${index === 4 ? "md:col-span-2" : ""}`}
              >
                <CornerBorders className="h-full p-8 glass-card-premium hover:-translate-y-1.5">
                  <div className="flex flex-col gap-4">
                    {/* Header: Icon */}
                    <div className="p-2.5 bg-signature/5 w-fit rounded-lg border border-signature/10 group-hover:bg-signature/10 group-hover:border-signature/30 transition-all duration-300">
                      {getIcon(reason.title)}
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold tracking-tight text-white font-sora group-hover:text-signature transition-colors duration-200">
                      {reason.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-text-tertiary leading-relaxed">
                      {reason.description}
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
