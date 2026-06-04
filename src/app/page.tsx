"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

// UI Core Components
import Loader from "@/components/ui/loader";
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";

// Page Sections
import Hero from "@/components/sections/hero";
import About from "@/components/sections/about";
import Services from "@/components/sections/services";
import Solutions from "@/components/sections/solutions";
import Process from "@/components/sections/process";
import Portfolio from "@/components/sections/portfolio";
import WhyUs from "@/components/sections/why-us";
import Testimonials from "@/components/sections/testimonials";
import FAQ from "@/components/sections/faq";
import ContactForm from "@/components/sections/contact-form";
import FinalCTA from "@/components/sections/final-cta";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  // Auto-scroll to top on initial mounting / refresh
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <>
      {/* Entry Loader Animation Gate */}
      <AnimatePresence mode="wait">
        {isLoading && (
          <Loader onComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>

      {/* Main App Page Content */}
      {!isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative flex flex-col min-h-screen"
        >
          {/* Header sticky navigation */}
          <Navbar />

          {/* Staggered Sections stack */}
          <main className="flex-1 w-full flex flex-col">
            <Hero />
            <About />
            <Services />
            <Solutions />
            <Process />
            <Portfolio />
            <WhyUs />
            <Testimonials />
            <FAQ />
            <ContactForm />
            <FinalCTA />
          </main>

          {/* Footer branding */}
          <Footer />
        </motion.div>
      )}
    </>
  );
}
