"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BRAND_CONFIG } from "@/config/content";
import CornerBorders from "../ui/corner-borders";
import { Plus, Minus } from "lucide-react";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
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

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <section 
      id="faq" 
      className="py-20 md:py-28 px-6 md:px-12 lg:px-24 bg-[#020203] w-full overflow-hidden"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col gap-12"
        >
          {/* Section Header */}
          <div className="flex flex-col gap-4 text-center items-center">
            <span className="text-xs font-mono tracking-widest text-signature uppercase">
              08 / Inquiries
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white font-sora">
              Frequently Asked Questions
            </h2>
            <p className="text-sm md:text-base text-text-tertiary max-w-xl leading-relaxed">
              Find answers to commonly asked questions about our AI deployment cycles, infrastructure tools, and support contracts.
            </p>
          </div>

          {/* Accordion List */}
          <div className="flex flex-col gap-4">
            {BRAND_CONFIG.faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="w-full"
                >
                  <CornerBorders className="p-1 bg-surface-raised/40 backdrop-blur-sm transition-all duration-300 glow-border">
                    <button
                      id={`faq-question-${index}`}
                      onClick={() => toggleFAQ(index)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-answer-${index}`}
                      className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 font-sora font-semibold text-base text-white hover:text-signature transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-signature rounded-lg"
                    >
                      <span>{faq.question}</span>
                      <span className="shrink-0 p-1 rounded-full border border-border-custom bg-surface-base">
                        {isOpen ? <Minus size={14} className="text-signature" /> : <Plus size={14} />}
                      </span>
                    </button>
                    
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={`faq-answer-${index}`}
                          role="region"
                          aria-labelledby={`faq-question-${index}`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ 
                            height: "auto", 
                            opacity: 1,
                            transition: { height: { duration: 0.35, ease: "easeOut" }, opacity: { duration: 0.25, delay: 0.05 } }
                          }}
                          exit={{ 
                            height: 0, 
                            opacity: 0,
                            transition: { height: { duration: 0.3, ease: "easeIn" }, opacity: { duration: 0.15 } }
                          }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6 pt-1 text-sm md:text-base text-text-tertiary leading-relaxed border-t border-border-custom/10 mt-1">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CornerBorders>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
