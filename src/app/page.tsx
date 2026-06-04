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

  // Control Lenis scrolling state based on loading state
  useEffect(() => {
    const toggleScroll = () => {
      const lenis = (window as any).lenisInstance;
      if (lenis) {
        if (isLoading) {
          lenis.stop();
        } else {
          lenis.start();
        }
      }
    };
    toggleScroll();
    
    // Poll to catch lazy Lenis initialization
    const interval = setInterval(toggleScroll, 50);
    const timeout = setTimeout(() => clearInterval(interval), 1500);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isLoading]);

  // GSAP ScrollTrigger setup driven via Lenis
  useEffect(() => {
    if (isLoading) return;

    // Check prefers-reduced-motion to disable scrub effects
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    let ctx: any;

    // Dynamically import GSAP and ScrollTrigger on client side
    Promise.all([
      import("gsap"),
      import("gsap/ScrollTrigger")
    ]).then(([{ gsap }, { ScrollTrigger }]) => {
      gsap.registerPlugin(ScrollTrigger);

      // Connect Lenis events to ScrollTrigger
      const lenis = (window as any).lenisInstance;
      if (lenis) {
        lenis.on("scroll", ScrollTrigger.update);
      }

      ctx = gsap.context(() => {
        // 1. Process Timeline line fill scroll-tied animation
        gsap.fromTo(
          "#process-progress-line",
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: "#process",
              start: "top 75%",
              end: "bottom 60%",
              scrub: true,
            },
          }
        );

        // 2. Hero parallax / slight scale scale-out
        gsap.to(".hero-light-ray", {
          y: 80,
          scale: 0.96,
          ease: "none",
          scrollTrigger: {
            trigger: "#hero",
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });

        gsap.to("#hero-canvas-wrap", {
          y: 40,
          scale: 0.98,
          ease: "none",
          scrollTrigger: {
            trigger: "#hero",
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      });
    });

    return () => {
      if (ctx) ctx.revert();
    };
  }, [isLoading]);

  return (
    <>
      {/* Entry Loader Animation Gate as a fixed overlay */}
      <AnimatePresence mode="wait">
        {isLoading && (
          <Loader onComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>

      {/* Main App Page Content - always rendered in DOM for SEO & LCP */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isLoading ? { opacity: 0 } : { opacity: 1 }}
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
    </>
  );
}
