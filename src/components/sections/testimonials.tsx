"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BRAND_CONFIG } from "@/config/content";
import CornerBorders from "../ui/corner-borders";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const testimonials = BRAND_CONFIG.testimonials;

  const handlePrev = () => {
    setIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
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
    <section 
      id="testimonials" 
      className="py-20 md:py-28 px-6 md:px-12 lg:px-24 bg-surface-base w-full overflow-hidden"
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
              07 / Impact
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white font-sora">
              Client Feedback
            </h2>
            <p className="text-sm md:text-base text-text-tertiary max-w-xl leading-relaxed">
              We help businesses stop doing things manually and start running on AI. Here is feedback from early deployments.
            </p>
          </div>

          {/* Testimonial Slider Card */}
          <div className="relative">
            <CornerBorders className="p-8 md:p-12 glass-card-premium min-h-[260px] flex flex-col justify-between relative overflow-hidden">
              
              {/* Background Quote SVG */}
              <Quote className="absolute right-8 top-8 h-28 w-28 text-signature/5 pointer-events-none" />

              <div className="relative z-10" aria-live="polite" id="testimonial-content-region">
                {/* Testimonial Quote */}
                <AnimatePresence mode="wait">
                  <motion.p
                    key={index}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                    className="text-base md:text-xl text-text-secondary font-medium italic leading-relaxed max-w-2xl"
                  >
                    &ldquo;{testimonials[index].text}&rdquo;
                  </motion.p>
                </AnimatePresence>
              </div>

              {/* Author Info & Nav Buttons */}
              <div className="flex flex-wrap items-end justify-between gap-6 mt-8 pt-6 border-t border-border-custom/20 relative z-10">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-base font-bold text-white font-sora">
                      {testimonials[index].company}
                    </div>
                    <div className="text-xs text-text-tertiary">
                      {testimonials[index].service}
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handlePrev}
                    aria-label="Previous testimonial"
                    className="p-3 rounded-full border border-border-custom bg-surface-base/50 text-text-secondary hover:border-signature hover:text-white transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signature"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={handleNext}
                    aria-label="Next testimonial"
                    className="p-3 rounded-full border border-border-custom bg-surface-base/50 text-text-secondary hover:border-signature hover:text-white transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signature"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </CornerBorders>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
