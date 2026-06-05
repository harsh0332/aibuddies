"use client";

import React from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import ContactForm from "@/components/sections/contact-form";
import CornerBorders from "@/components/ui/corner-borders";
import { Stethoscope, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ClinicsSolutionStub() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const revealVariants = {
    hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <>
      <Navbar />

      <main className="w-full bg-[#020203] min-h-screen pt-28 md:pt-36 flex flex-col justify-between">
        <div className="max-w-4xl mx-auto px-6 md:px-12 w-full flex-1 pb-16">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-10"
          >
            {/* Back Button */}
            <motion.div variants={revealVariants}>
              <Link 
                href="/" 
                className="inline-flex items-center gap-2 text-xs font-mono uppercase text-signature hover:text-white transition-colors"
              >
                <ArrowLeft size={12} /> Back to core
              </Link>
            </motion.div>

            {/* Header block */}
            <div className="flex flex-col gap-4">
              <motion.span 
                variants={revealVariants}
                className="text-xs font-mono tracking-widest text-signature uppercase"
              >
                Solution Vertical // Healthcare
              </motion.span>
              <motion.h1 
                variants={revealVariants}
                className="text-4xl md:text-6xl font-extrabold tracking-tight text-white font-sora"
              >
                AI for Clinics
              </motion.h1>
              <motion.p 
                variants={revealVariants}
                className="text-base md:text-lg text-text-tertiary max-w-2xl leading-relaxed"
              >
                Automate appointment booking, streamline patient follow-up protocols, and handle after-hours inquiries automatically. Compliant, reliable, and integrated with clinical tools.
              </motion.p>
            </div>

            {/* Clinic details cards grid */}
            <motion.div 
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <motion.div variants={revealVariants}>
                <CornerBorders className="p-6 glass-card-premium h-full flex flex-col gap-4">
                  <div className="p-2.5 bg-signature/10 border border-signature/20 text-signature w-fit rounded-lg">
                    <Stethoscope size={20} />
                  </div>
                  <h3 className="text-lg font-bold font-sora text-white">After-Hours Assistant</h3>
                  <p className="text-xs text-text-tertiary leading-relaxed">
                    Capture patient queries outside regular clinic hours. The voice/chat bot replies instantly, schedules slots, and logs booking updates in your CRM.
                  </p>
                </CornerBorders>
              </motion.div>

              <motion.div variants={revealVariants}>
                <CornerBorders className="p-6 glass-card-premium h-full flex flex-col gap-4">
                  <div className="p-2.5 bg-signature/10 border border-signature/20 text-signature w-fit rounded-lg">
                    <Stethoscope size={20} />
                  </div>
                  <h3 className="text-lg font-bold font-sora text-white">Smart Patient Follow-Ups</h3>
                  <p className="text-xs text-text-tertiary leading-relaxed">
                    Trigger automated reminders, health check checklists, and treatment compliance guides directly on WhatsApp, dropping no-shows by 70%.
                  </p>
                </CornerBorders>
              </motion.div>
            </motion.div>

            {/* Anchor block leading to form */}
            <motion.div variants={revealVariants} className="pt-6 border-t border-border-custom/20">
              <ContactForm />
            </motion.div>
          </motion.div>
        </div>

        <Footer />
      </main>
    </>
  );
}
