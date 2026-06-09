"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { BRAND_CONFIG } from "@/config/content";
import CornerBorders from "../ui/corner-borders";
import { Layers, CheckCircle2 } from "lucide-react";
import { scrollToElement } from "@/components/ui/smooth-scroll-provider";

export default function Solutions() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
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
                      href="https://cal.com/ai-buddies/30min"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-6 py-3.5 rounded-full bg-signature text-black font-semibold text-xs uppercase tracking-wider border border-signature/80 hover:bg-transparent hover:text-white transition-all duration-300 hover:shadow-[0_0_15px_rgba(43,160,220,0.4)]"
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
                    {/* Keyframe animation stylesheet */}
                    <style dangerouslySetInnerHTML={{ __html: `
                      @keyframes flow-line-dash {
                        to {
                          stroke-dashoffset: -20;
                        }
                      }
                      .animate-flow-dash {
                        stroke-dasharray: 6 4;
                        animation: flow-line-dash 1.2s linear infinite;
                      }
                      .animate-flow-dash-fast {
                        stroke-dasharray: 6 4;
                        animation: flow-line-dash 0.5s linear infinite;
                      }
                    `}} />

                    {/* Pulsing connections */}
                    <line 
                      x1="150" y1="150" x2="60" y2="70" 
                      stroke={hoveredNode === "chat" ? "#5ce1e6" : "var(--color-signature)"} 
                      strokeWidth={hoveredNode === "chat" ? "2.5" : "1.5"} 
                      className={`transition-all duration-300 ${
                        hoveredNode === "chat" 
                          ? "animate-flow-dash-fast opacity-100" 
                          : hoveredNode 
                            ? "animate-flow-dash opacity-25" 
                            : "animate-flow-dash opacity-70"
                      }`} 
                    />
                    <line 
                      x1="150" y1="150" x2="240" y2="70" 
                      stroke={hoveredNode === "wa" ? "#5ce1e6" : "var(--color-signature)"} 
                      strokeWidth={hoveredNode === "wa" ? "2.5" : "1.5"} 
                      className={`transition-all duration-300 ${
                        hoveredNode === "wa" 
                          ? "animate-flow-dash-fast opacity-100" 
                          : hoveredNode 
                            ? "animate-flow-dash opacity-25" 
                            : "animate-flow-dash opacity-70"
                      }`} 
                    />
                    <line 
                      x1="150" y1="150" x2="240" y2="230" 
                      stroke={hoveredNode === "voice" ? "#5ce1e6" : "var(--color-signature)"} 
                      strokeWidth={hoveredNode === "voice" ? "2.5" : "1.5"} 
                      className={`transition-all duration-300 ${
                        hoveredNode === "voice" 
                          ? "animate-flow-dash-fast opacity-100" 
                          : hoveredNode 
                            ? "animate-flow-dash opacity-25" 
                            : "animate-flow-dash opacity-70"
                      }`} 
                    />
                    <line 
                      x1="150" y1="150" x2="60" y2="230" 
                      stroke={hoveredNode === "lead" ? "#5ce1e6" : "var(--color-signature)"} 
                      strokeWidth={hoveredNode === "lead" ? "2.5" : "1.5"} 
                      className={`transition-all duration-300 ${
                        hoveredNode === "lead" 
                          ? "animate-flow-dash-fast opacity-100" 
                          : hoveredNode 
                            ? "animate-flow-dash opacity-25" 
                            : "animate-flow-dash opacity-70"
                      }`} 
                    />
                    <line 
                      x1="150" y1="150" x2="150" y2="50" 
                      stroke={hoveredNode === "help" ? "#5ce1e6" : "var(--color-signature)"} 
                      strokeWidth={hoveredNode === "help" ? "2.5" : "1.5"} 
                      className={`transition-all duration-300 ${
                        hoveredNode === "help" 
                          ? "animate-flow-dash-fast opacity-100" 
                          : hoveredNode 
                            ? "animate-flow-dash opacity-25" 
                            : "animate-flow-dash opacity-70"
                      }`} 
                    />

                    {/* Nodes */}
                    {/* Node 1: Chatbots */}
                    <g 
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredNode("chat")}
                      onMouseLeave={() => setHoveredNode(null)}
                    >
                      <circle 
                        cx="60" cy="70" r="18" 
                        fill="none" stroke="var(--color-signature)" strokeWidth="1"
                        className={`transition-all duration-300 origin-center ${
                          hoveredNode === "chat" ? "scale-100 opacity-60" : "scale-75 opacity-0"
                        }`}
                      />
                      <circle 
                        cx="60" cy="70" r="14" 
                        fill="#0a0a0b" 
                        stroke={hoveredNode === "chat" ? "var(--color-signature)" : "#242428"} 
                        strokeWidth="1.5" 
                        className="transition-all duration-300"
                      />
                      <text 
                        x="60" y="73" 
                        fill={hoveredNode === "chat" ? "#ffffff" : "#9a9aa2"} 
                        fontSize="9" textAnchor="middle" fontFamily="monospace"
                        className="transition-colors duration-300 font-bold"
                      >
                        Chat
                      </text>
                    </g>
                    
                    {/* Node 2: WhatsApp */}
                    <g 
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredNode("wa")}
                      onMouseLeave={() => setHoveredNode(null)}
                    >
                      <circle 
                        cx="240" cy="70" r="18" 
                        fill="none" stroke="var(--color-signature)" strokeWidth="1"
                        className={`transition-all duration-300 origin-center ${
                          hoveredNode === "wa" ? "scale-100 opacity-60" : "scale-75 opacity-0"
                        }`}
                      />
                      <circle 
                        cx="240" cy="70" r="14" 
                        fill="#0a0a0b" 
                        stroke={hoveredNode === "wa" ? "var(--color-signature)" : "#242428"} 
                        strokeWidth="1.5" 
                        className="transition-all duration-300"
                      />
                      <text 
                        x="240" y="73" 
                        fill={hoveredNode === "wa" ? "#ffffff" : "#9a9aa2"} 
                        fontSize="9" textAnchor="middle" fontFamily="monospace"
                        className="transition-colors duration-300 font-bold"
                      >
                        WA
                      </text>
                    </g>
 
                    {/* Node 3: Voice */}
                    <g 
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredNode("voice")}
                      onMouseLeave={() => setHoveredNode(null)}
                    >
                      <circle 
                        cx="240" cy="230" r="18" 
                        fill="none" stroke="var(--color-signature)" strokeWidth="1"
                        className={`transition-all duration-300 origin-center ${
                          hoveredNode === "voice" ? "scale-100 opacity-60" : "scale-75 opacity-0"
                        }`}
                      />
                      <circle 
                        cx="240" cy="230" r="14" 
                        fill="#0a0a0b" 
                        stroke={hoveredNode === "voice" ? "var(--color-signature)" : "#242428"} 
                        strokeWidth="1.5" 
                        className="transition-all duration-300"
                      />
                      <text 
                        x="240" y="233" 
                        fill={hoveredNode === "voice" ? "#ffffff" : "#9a9aa2"} 
                        fontSize="9" textAnchor="middle" fontFamily="monospace"
                        className="transition-colors duration-300 font-bold"
                      >
                        Voice
                      </text>
                    </g>

                    {/* Node 4: Leads */}
                    <g 
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredNode("lead")}
                      onMouseLeave={() => setHoveredNode(null)}
                    >
                      <circle 
                        cx="60" cy="230" r="18" 
                        fill="none" stroke="var(--color-signature)" strokeWidth="1"
                        className={`transition-all duration-300 origin-center ${
                          hoveredNode === "lead" ? "scale-100 opacity-60" : "scale-75 opacity-0"
                        }`}
                      />
                      <circle 
                        cx="60" cy="230" r="14" 
                        fill="#0a0a0b" 
                        stroke={hoveredNode === "lead" ? "var(--color-signature)" : "#242428"} 
                        strokeWidth="1.5" 
                        className="transition-all duration-300"
                      />
                      <text 
                        x="60" y="233" 
                        fill={hoveredNode === "lead" ? "#ffffff" : "#9a9aa2"} 
                        fontSize="9" textAnchor="middle" fontFamily="monospace"
                        className="transition-colors duration-300 font-bold"
                      >
                        Lead
                      </text>
                    </g>

                    {/* Node 5: Support */}
                    <g 
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredNode("help")}
                      onMouseLeave={() => setHoveredNode(null)}
                    >
                      <circle 
                        cx="150" cy="50" r="18" 
                        fill="none" stroke="var(--color-signature)" strokeWidth="1"
                        className={`transition-all duration-300 origin-center ${
                          hoveredNode === "help" ? "scale-100 opacity-60" : "scale-75 opacity-0"
                        }`}
                      />
                      <circle 
                        cx="150" cy="50" r="14" 
                        fill="#0a0a0b" 
                        stroke={hoveredNode === "help" ? "var(--color-signature)" : "#242428"} 
                        strokeWidth="1.5" 
                        className="transition-all duration-300"
                      />
                      <text 
                        x="150" y="53" 
                        fill={hoveredNode === "help" ? "#ffffff" : "#9a9aa2"} 
                        fontSize="9" textAnchor="middle" fontFamily="monospace"
                        className="transition-colors duration-300 font-bold"
                      >
                        Help
                      </text>
                    </g>

                    {/* Center Hub Node */}
                    <g 
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredNode("center")}
                      onMouseLeave={() => setHoveredNode(null)}
                    >
                      <circle 
                        cx="150" cy="150" r="32" 
                        fill="none" stroke="var(--color-signature)" strokeWidth="1.5" 
                        className={`transition-all duration-500 origin-center ${
                          hoveredNode ? "scale-105 opacity-50" : "scale-100 opacity-20"
                        }`} 
                      />
                      <circle cx="150" cy="150" r="28" fill="var(--color-signature)" className="opacity-15 animate-pulse" />
                      <circle cx="150" cy="150" r="20" fill="#000000" stroke="var(--color-signature)" strokeWidth="1.2" />
                      <text 
                        x="150" y="153" 
                        fill="var(--color-signature)" 
                        fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif"
                        className="transition-all duration-300"
                      >
                        FULL STACK
                      </text>
                    </g>
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
