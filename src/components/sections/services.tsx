"use client";

import React from "react";
import { motion } from "framer-motion";
import { BRAND_CONFIG } from "@/config/content";
import CornerBorders from "../ui/corner-borders";
import { 
  MessageSquare, 
  MessageCircleCode, 
  Mic, 
  Target, 
  HelpCircle 
} from "lucide-react";

export default function Services() {
  // Map IDs to specific Lucide icons for premium futuristic look
  const getIcon = (id: string) => {
    switch (id) {
      case "ai-chatbots":
        return <MessageSquare className="h-8 w-8 text-signature" />;
      case "whatsapp-automation":
        return <MessageCircleCode className="h-8 w-8 text-signature" />;
      case "voice-agents":
        return <Mic className="h-8 w-8 text-signature" />;
      case "lead-qualification":
        return <Target className="h-8 w-8 text-signature" />;
      case "ai-customer-support":
        return <HelpCircle className="h-8 w-8 text-signature" />;
      default:
        return <MessageSquare className="h-8 w-8 text-signature" />;
    }
  };

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
    hidden: { opacity: 0, y: 30 },
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
      id="services" 
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
              02 / What We Build
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white font-sora">
              AI Automations & Skills
            </h2>
            <p className="text-base text-text-tertiary leading-relaxed">
              We deploy custom-configured autonomous modules designed to run under one roof, integrating cleanly with your current business workflow.
            </p>
          </div>

          {/* Services Cards Grid */}
          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {BRAND_CONFIG.services.map((service) => (
              <motion.div
                key={service.id}
                variants={revealVariants}
                className="group"
              >
                <CornerBorders className="h-full p-8 bg-surface-raised/30 backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 glow-border">
                  <div className="flex flex-col gap-6 h-full justify-between">
                    <div className="flex flex-col gap-4">
                      {/* Icon */}
                      <div className="p-3 bg-signature/5 w-fit rounded-lg border border-signature/20 group-hover:bg-signature/10 group-hover:border-signature/40 transition-all duration-300">
                        {getIcon(service.id)}
                      </div>
                      
                      {/* Title */}
                      <h3 className="text-xl font-bold tracking-tight text-white font-sora group-hover:text-signature transition-colors duration-200">
                        {service.title}
                      </h3>
                      
                      {/* Description */}
                      <p className="text-sm text-text-tertiary leading-relaxed">
                        {service.description}
                      </p>
                    </div>

                    {/* Custom indicator */}
                    <div className="text-[10px] font-mono text-text-tertiary/40 group-hover:text-signature/60 transition-colors duration-200 pt-4 border-t border-border-custom/20">
                      AI_BUDDIES // SKILL_MODULE
                    </div>
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
