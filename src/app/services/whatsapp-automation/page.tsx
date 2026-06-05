"use client";

import React from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import ContactForm from "@/components/sections/contact-form";
import CornerBorders from "@/components/ui/corner-borders";
import { MessageSquare, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function WhatsAppAutomationStub() {
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
                Service Module // 02
              </motion.span>
              <motion.h1 
                variants={revealVariants}
                className="text-4xl md:text-6xl font-extrabold tracking-tight text-white font-sora"
              >
                WhatsApp Automation
              </motion.h1>
              <motion.p 
                variants={revealVariants}
                className="text-base md:text-lg text-text-tertiary max-w-2xl leading-relaxed"
              >
                Scale customer support, automate follow-up, and deploy AI appointment assistants directly inside WhatsApp. We integrate secure workflows built on Meta API & n8n.
              </motion.p>
            </div>

            {/* Service details cards grid */}
            <motion.div 
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <motion.div variants={revealVariants}>
                <CornerBorders className="p-6 glass-card-premium h-full flex flex-col gap-4">
                  <div className="p-2.5 bg-signature/10 border border-signature/20 text-signature w-fit rounded-lg">
                    <MessageSquare size={20} />
                  </div>
                  <h3 className="text-lg font-bold font-sora text-white">Broadcasts & Campaigns</h3>
                  <p className="text-xs text-text-tertiary leading-relaxed">
                    Broadcast personalized offers, onboarding updates, and newsletters directly to your contact list. Achieve 98% open rates compared to email.
                  </p>
                </CornerBorders>
              </motion.div>

              <motion.div variants={revealVariants}>
                <CornerBorders className="p-6 glass-card-premium h-full flex flex-col gap-4">
                  <div className="p-2.5 bg-signature/10 border border-signature/20 text-signature w-fit rounded-lg">
                    <MessageSquare size={20} />
                  </div>
                  <h3 className="text-lg font-bold font-sora text-white">24/7 AI Receptionist</h3>
                  <p className="text-xs text-text-tertiary leading-relaxed">
                    Auto-respond to client questions, qualify leads, and book slots directly in your calendar without requiring any manual coordination.
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
