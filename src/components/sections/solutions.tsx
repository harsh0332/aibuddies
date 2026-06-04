"use client";

import React from "react";
import { motion } from "framer-motion";
import { BRAND_CONFIG } from "@/config/content";
import CornerBorders from "../ui/corner-borders";
import { Layers, CheckCircle2 } from "lucide-react";

export default function Solutions() {
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

  const bundleFeatures = [
    "Unified AI Core: Seamless information sharing between all modules.",
    "Integrated WhatsApp Pipeline: Automates notifications, bookings, and alerts.",
    "n8n Core Workflows: Enterprise-grade database syncing and APIs.",
    "Outgoing Voice Agents: Pre-qualified leads called automatically by voice.",
    "Instant Setup: Tailored deploy, fully operational in days.",
  ];

  return (
    <section 
      id="solutions" 
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
          {/* Header */}
          <div className="flex flex-col gap-4 max-w-2xl">
            <span className="text-xs font-mono tracking-widest text-signature uppercase">
              03 / Unification
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white font-sora">
              {BRAND_CONFIG.fullStackAI.title}
            </h2>
            <p className="text-base text-text-tertiary leading-relaxed">
              {BRAND_CONFIG.fullStackAI.description}
            </p>
          </div>

          {/* Solution Highlight Panel */}
          <motion.div variants={revealVariants}>
            <CornerBorders className="p-8 md:p-12 bg-gradient-to-br from-surface-raised/60 to-[#07050d]/80 backdrop-blur-md glow-border">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                
                {/* Left side: Feature List */}
                <div className="lg:col-span-7 flex flex-col gap-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded bg-signature/10 border border-signature/30">
                      <Layers className="h-6 w-6 text-signature" />
                    </div>
                    <span className="text-sm font-mono tracking-wider text-white uppercase">
                      All-In-One Enterprise Architecture
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold tracking-tight text-white font-sora">
                    Why choose Full Stack AI?
                  </h3>

                  <ul className="flex flex-col gap-4 mt-2">
                    {bundleFeatures.map((feat) => (
                      <li key={feat} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-signature shrink-0 mt-0.5" />
                        <span className="text-sm md:text-base text-text-secondary leading-relaxed">
                          {feat}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4">
                    <a
                      href="#contact"
                      onClick={(e) => {
                        e.preventDefault();
                        document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-signature text-black font-semibold text-xs uppercase tracking-wider border border-signature/80 hover:bg-transparent hover:text-white transition-all duration-300 hover:shadow-[0_0_15px_rgba(139,127,255,0.4)]"
                    >
                      Book Free Call
                    </a>
                  </div>
                </div>

                {/* Right side: Modern Connected Hub Visual SVG */}
                <div className="lg:col-span-5 flex justify-center items-center relative h-[300px] md:h-[350px]">
                  
                  {/* Dynamic background glow */}
                  <div 
                    className="absolute w-44 h-44 rounded-full bg-signature/20 blur-[60px] pointer-events-none" 
                    aria-hidden="true" 
                  />

                  {/* Connected Network Diagram */}
                  <svg 
                    width="100%" 
                    height="100%" 
                    viewBox="0 0 300 300" 
                    className="relative overflow-visible select-none"
                    aria-hidden="true"
                  >
                    {/* Pulsing connections */}
                    <line x1="150" y1="150" x2="60" y2="70" stroke="#8b7fff" strokeWidth="1.5" strokeDasharray="5 5" className="animate-pulse" />
                    <line x1="150" y1="150" x2="240" y2="70" stroke="#8b7fff" strokeWidth="1.5" strokeDasharray="5 5" className="animate-pulse" />
                    <line x1="150" y1="150" x2="240" y2="230" stroke="#8b7fff" strokeWidth="1.5" strokeDasharray="5 5" className="animate-pulse" />
                    <line x1="150" y1="150" x2="60" y2="230" stroke="#8b7fff" strokeWidth="1.5" strokeDasharray="5 5" className="animate-pulse" />
                    <line x1="150" y1="150" x2="150" y2="50" stroke="#8b7fff" strokeWidth="1.5" strokeDasharray="5 5" className="animate-pulse" />

                    {/* Nodes */}
                    {/* Node 1: Chatbots */}
                    <circle cx="60" cy="70" r="14" fill="#0a0a0b" stroke="#242428" strokeWidth="1.5" />
                    <text x="60" y="73" fill="#9a9aa2" fontSize="9" textAnchor="middle" fontFamily="monospace">Chat</text>
                    
                    {/* Node 2: WhatsApp */}
                    <circle cx="240" cy="70" r="14" fill="#0a0a0b" stroke="#242428" strokeWidth="1.5" />
                    <text x="240" y="73" fill="#9a9aa2" fontSize="9" textAnchor="middle" fontFamily="monospace">WA</text>

                    {/* Node 3: Voice */}
                    <circle cx="240" cy="230" r="14" fill="#0a0a0b" stroke="#242428" strokeWidth="1.5" />
                    <text x="240" y="233" fill="#9a9aa2" fontSize="9" textAnchor="middle" fontFamily="monospace">Voice</text>

                    {/* Node 4: Leads */}
                    <circle cx="60" cy="230" r="14" fill="#0a0a0b" stroke="#242428" strokeWidth="1.5" />
                    <text x="60" y="233" fill="#9a9aa2" fontSize="9" textAnchor="middle" fontFamily="monospace">Lead</text>

                    {/* Node 5: Support */}
                    <circle cx="150" cy="50" r="14" fill="#0a0a0b" stroke="#242428" strokeWidth="1.5" />
                    <text x="150" y="53" fill="#9a9aa2" fontSize="9" textAnchor="middle" fontFamily="monospace">Help</text>

                    {/* Center Hub Node */}
                    <circle cx="150" cy="150" r="28" fill="#8b7fff" className="animate-pulse" />
                    <circle cx="150" cy="150" r="20" fill="#000000" />
                    <text x="150" y="153" fill="#8b7fff" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">FULL STACK</text>
                  </svg>
                </div>

              </div>
            </CornerBorders>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
