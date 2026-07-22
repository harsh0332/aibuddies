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
import Integrations from "@/components/sections/integrations";
import Process from "@/components/sections/process";
import Portfolio from "@/components/sections/portfolio";
import TrustBar from "@/components/sections/trust-bar";
import WhyUs from "@/components/sections/why-us";
import ProblemAgitation from "@/components/sections/problem";
import InlineCTA from "@/components/sections/inline-cta";
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
      (window as any).targetStage = 0;
    }
  }, []);

  // Detect 3D compatibility on client side (desktop non-touch with preferred motion and min-width 1024px)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const check3DCompatibility = () => {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      setIs3DActive(!prefersReducedMotion);
    };

    check3DCompatibility();

    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(check3DCompatibility, 150);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", check3DCompatibility);
    
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", check3DCompatibility);
      clearTimeout(resizeTimer);
    };
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
        // 1. Process Timeline line fill scroll-tied animation (horizontal & vertical)
        const processTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: "#process",
            start: "top 80%",
            end: "bottom 70%",
            scrub: true,
          }
        });

        processTimeline.fromTo(
          "#process-progress-line",
          { scaleX: 0 },
          { scaleX: 1, ease: "none" }
        );

        processTimeline.fromTo(
          "#process-progress-line-mobile",
          { scaleY: 0 },
          { scaleY: 1, ease: "none" },
          0
        );

        // Highlight process cards sequentially as they scroll into view
        const cards = gsap.utils.toArray(".process-card");
        const isDesktop = window.matchMedia("(min-width: 1024px)").matches;

        if (isDesktop) {
          cards.forEach((card: any, index: number) => {
            const startOffset = index * 22;
            const endOffset = startOffset + 22;

            ScrollTrigger.create({
              trigger: "#process",
              start: `top+=${startOffset}% 70%`,
              end: `top+=${endOffset}% 70%`,
              toggleClass: { targets: card, className: "active-step" },
            });

            gsap.fromTo(
              card,
              { opacity: 0.4, scale: 0.97 },
              {
                opacity: 1,
                scale: 1,
                scrollTrigger: {
                  trigger: "#process",
                  start: `top+=${startOffset}% 85%`,
                  end: `top+=${startOffset + 12}% 70%`,
                  scrub: true,
                }
              }
            );
          });
        } else {
          cards.forEach((card: any) => {
            gsap.fromTo(
              card,
              { 
                opacity: 0.35, 
                scale: 0.97, 
              },
              {
                opacity: 1,
                scale: 1,
                ease: "power1.out",
                scrollTrigger: {
                  trigger: card,
                  start: "top 85%",
                  end: "top 55%",
                  scrub: true,
                  toggleClass: "active-step"
                }
              }
            );
          });
        }

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

        // If 3D is active, expose scrollToService on window to allow external components to scroll to a specific service card.
        if (is3DActive) {
          (window as any).scrollToService = (index: number) => {
            const el = document.getElementById("services");
            const lenis = (window as any).lenisInstance;
            if (el && lenis) {
              const rect = el.getBoundingClientRect();
              const start = window.scrollY + rect.top;
              const scrollable = rect.height - window.innerHeight;
              const targetScroll = start + (index / 4.0) * scrollable;
              lenis.scrollTo(targetScroll, {
                duration: 1.2,
                ease: (t: number) => 1 - Math.pow(1 - t, 3)
              });
            }
          };
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
        delete (window as any).targetStage;
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

      {/* Main App Page Content - always rendered in DOM for SEO & LCP */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isLoading ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 flex flex-col min-h-screen"
      >
        {/* Global background particle canvas */}
        {!isLoading && <ParticleField is3DActive={is3DActive} />}

        {/* Header sticky navigation */}
        <Navbar />

        {/* Staggered Sections stack with explicit opaque layering contexts */}
        <main className="w-full block">
          <Hero is3DActive={is3DActive} />
          
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
            <InlineCTA heading="Ready to automate your workflows and run your business on autopilot?" />
            <TrustBar />
            <ProblemAgitation />
            <About />
            <Solutions />
            <Integrations />
            <Process />
            <Portfolio />
            <WhyUs />
            <InlineCTA heading="See how much time and revenue you can save with custom AI systems." />
            <FAQ />
            <Testimonials />
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
