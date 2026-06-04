"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";

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

// Dynamically load R3F ParticleField to prevent SSR issues and optimize performance
const ParticleField = dynamic(() => import("@/components/three/particle-field"), {
  ssr: false,
});

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [is3DActive, setIs3DActive] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-scroll to top on initial mounting / refresh
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
      (window as any).scrollStage = 0;
    }
  }, []);

  // Detect 3D compatibility on client side (desktop non-touch with preferred motion)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isTouch = window.matchMedia("(pointer: coarse)").matches;
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!isTouch && !prefersReducedMotion) {
        setIs3DActive(true);
      }
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
    let scrollTriggerUpdateHandler: any;

    // Dynamically import GSAP and ScrollTrigger on client side
    Promise.all([
      import("gsap"),
      import("gsap/ScrollTrigger")
    ]).then(([{ gsap }, { ScrollTrigger }]) => {
      gsap.registerPlugin(ScrollTrigger);

      // Connect Lenis events to ScrollTrigger
      const lenis = (window as any).lenisInstance;
      if (lenis) {
        scrollTriggerUpdateHandler = ScrollTrigger.update;
        lenis.on("scroll", scrollTriggerUpdateHandler);
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

        // If 3D is active, setup scroll-triggered particle morphing triggers
        if (is3DActive) {
          // Trigger 1: Stage 0 -> 1: From Services entering bottom of screen to reaching top of screen
          ScrollTrigger.create({
            trigger: "#services-container",
            start: "top bottom",
            end: "top top",
            scrub: true,
            onUpdate: (self) => {
              (window as any).scrollStage = self.progress; // 0.0 -> 1.0 (written directly to window for R3F)
            },
          });

          // Trigger 2: Stage 1 -> 5: Services section (driven by CSS sticky progress through container)
          const servicesTrigger = ScrollTrigger.create({
            trigger: "#services-container",
            start: "top top",
            end: "bottom bottom",
            scrub: true,
            onUpdate: (self) => {
              const currentStage = 1.0 + self.progress * 4.0;
              (window as any).scrollStage = currentStage; // 1.0 -> 5.0 (written directly to window for R3F)
              
              // Throttle React state updates to only fire when activeIndex actually changes
              const p = self.progress;
              const index = Math.min(Math.floor(p * 5), 4);
              setActiveIndex((prev) => (prev !== index ? index : prev));
            },
          });

          // Expose scrollToService on window to allow card clicks to scroll smoothly
          (window as any).scrollToService = (index: number) => {
            const currentLenis = (window as any).lenisInstance;
            if (currentLenis && servicesTrigger) {
              const start = servicesTrigger.start;
              const end = servicesTrigger.end;
              // Target scroll is distributed evenly across sticky region
              const targetScroll = start + (index / 4.0) * (end - start);
              currentLenis.scrollTo(targetScroll, { 
                duration: 1.2, 
                ease: (t: number) => 1 - Math.pow(1 - t, 3) 
              });
            }
          };

          // Trigger 3: Stage 5 -> 5.5: Solutions section fade out
          ScrollTrigger.create({
            trigger: "#solutions",
            start: "top bottom",
            end: "top 50%",
            scrub: true,
            onUpdate: (self) => {
              (window as any).scrollStage = 5.0 + self.progress * 0.5; // 5.0 -> 5.5 (written directly to window for R3F)
            },
          });
        }
      });
    });

    return () => {
      if (ctx) ctx.revert();
      
      // Clean up the Lenis scroll event listener to prevent leaks
      const currentLenis = (window as any).lenisInstance;
      if (currentLenis && scrollTriggerUpdateHandler) {
        currentLenis.off("scroll", scrollTriggerUpdateHandler);
      }

      if (typeof window !== "undefined") {
        delete (window as any).scrollToService;
        delete (window as any).scrollStage;
      }
    };
  }, [isLoading, is3DActive]);

  return (
    <>
      {/* Entry Loader Animation Gate as a fixed overlay */}
      <AnimatePresence mode="wait">
        {isLoading && (
          <Loader onComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>

      {/* Global background 3D particle canvas (bypasses props, reads scroll stage from window inside R3F) */}
      {is3DActive && !isLoading && <ParticleField />}

      {/* Main App Page Content - always rendered in DOM for SEO & LCP */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isLoading ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 flex flex-col min-h-screen"
      >
        {/* Header sticky navigation */}
        <Navbar />

        {/* Staggered Sections stack with explicit opaque layering contexts */}
        <main className="flex-1 w-full flex flex-col">
          <Hero is3DActive={is3DActive} />
          
          {/* About section: opaque layer covering fixed canvas */}
          <div className="relative z-20 bg-surface-base">
            <About />
          </div>
          
          {/* Services section: transparent container for background canvas view */}
          <Services 
            interactive={is3DActive} 
            activeIndex={activeIndex} 
            onCardClick={(index) => {
              if (is3DActive && (window as any).scrollToService) {
                (window as any).scrollToService(index);
              }
            }}
          />
          
          {/* Solutions to CTAs block: opaque layer covering canvas and stacking above services sticky container */}
          <div className="relative z-20 bg-[#020203]">
            <Solutions />
            <Process />
            <Portfolio />
            <WhyUs />
            <Testimonials />
            <FAQ />
            <ContactForm />
            <FinalCTA />
          </div>
        </main>

        {/* Footer branding: opaque layer stacking above Services */}
        <div className="relative z-20 bg-black">
          <Footer />
        </div>
      </motion.div>
    </>
  );
}
