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

interface ServicesProps {
  interactive?: boolean;
  activeIndex?: number;
  onCardClick?: (index: number) => void;
}

export default function Services({
  interactive = false,
  activeIndex = 0,
  onCardClick,
}: ServicesProps) {
  // Map IDs to specific Lucide icons for premium futuristic look
  const getIcon = (id: string, isActive: boolean) => {
    const iconClass = `h-6 w-6 transition-colors duration-300 ${
      isActive ? "text-signature" : "text-text-tertiary/40"
    }`;
    switch (id) {
      case "ai-chatbots":
        return <MessageSquare className={iconClass} />;
      case "whatsapp-automation":
        return <MessageCircleCode className={iconClass} />;
      case "voice-agents":
        return <Mic className={iconClass} />;
      case "lead-qualification":
        return <Target className={iconClass} />;
      case "ai-customer-support":
        return <HelpCircle className={iconClass} />;
      default:
        return <MessageSquare className={iconClass} />;
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

  if (interactive) {
    return (
      <section 
        id="services" 
        className="py-20 md:py-28 px-6 md:px-12 lg:px-24 bg-transparent w-full min-h-screen flex items-center overflow-hidden"
      >
        <div className="max-w-6xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left Column: Interactive vertical list */}
            <div className="col-span-1 lg:col-span-6 flex flex-col gap-10">
              {/* Section Header */}
              <div className="flex flex-col gap-4 max-w-xl">
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

              {/* Vertical list of service headers */}
              <div className="flex flex-col gap-4">
                {BRAND_CONFIG.services.map((service, index) => {
                  const isActive = index === activeIndex;
                  return (
                    <div
                      key={service.id}
                      onClick={() => onCardClick?.(index)}
                      className={`group cursor-pointer transition-all duration-300 ${
                        isActive ? "scale-[1.02]" : "opacity-50 hover:opacity-80"
                      }`}
                    >
                      <CornerBorders 
                        className={`p-6 transition-all duration-500 ${
                          isActive 
                            ? "bg-surface-raised/40 border-signature/30 shadow-[0_0_25px_-5px_rgba(43,160,220,0.15)]" 
                            : "bg-transparent border-border-custom/10"
                        }`}
                        showCorners={isActive}
                      >
                        <div className="flex items-start gap-5">
                          {/* Number Counter */}
                          <span 
                            className={`text-3xl lg:text-4xl font-mono font-bold select-none transition-colors duration-500 ${
                              isActive ? "text-signature" : "text-text-tertiary/20"
                            }`}
                          >
                            {`0${index + 1}`}
                          </span>

                          <div className="flex-1 flex flex-col">
                            {/* Icon & Title */}
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg border transition-colors duration-500 ${
                                isActive 
                                  ? "bg-signature/10 border-signature/30" 
                                  : "bg-surface-raised/20 border-border-custom/15 group-hover:border-border-custom/30"
                              }`}>
                                {getIcon(service.id, isActive)}
                              </div>
                              <h3 className={`text-lg lg:text-xl font-bold tracking-tight font-sora transition-colors duration-500 ${
                                isActive ? "text-white" : "text-text-tertiary/70"
                              }`}>
                                {service.title}
                              </h3>
                            </div>

                            {/* Expanding description container */}
                            <motion.div
                              initial={false}
                              animate={{ 
                                height: isActive ? "auto" : 0, 
                                opacity: isActive ? 1 : 0,
                                marginTop: isActive ? 12 : 0
                              }}
                              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                              className="overflow-hidden"
                            >
                              <p className="text-sm text-text-tertiary leading-relaxed">
                                {service.description}
                              </p>
                              
                              <div className="text-[9px] font-mono text-signature/40 pt-3 mt-3 border-t border-border-custom/10">
                                AI_BUDDIES // SKILL_MODULE_{service.id.toUpperCase().replace(/-/g, "_")}
                              </div>
                            </motion.div>
                          </div>
                        </div>
                      </CornerBorders>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Transparent placeholder for 3D canvas (on desktop) */}
            <div className="col-span-1 lg:col-span-6 min-h-[300px] lg:min-h-[500px] pointer-events-none hidden lg:block" />
          </div>
        </div>
      </section>
    );
  }

  // Fallback / Static cards grid (used when interactive = false)
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
                        {getIcon(service.id, true)}
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
