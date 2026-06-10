"use client";

import React, { useEffect, useRef, useState } from "react";
import { BRAND_CONFIG } from "@/config/content";
import { scrollToElement } from "@/components/ui/smooth-scroll-provider";
import Magnetic from "../ui/magnetic";

interface HeroProps {
  is3DActive?: boolean;
}

export default function Hero({ is3DActive = false }: HeroProps) {
  const [isArmed, setIsArmed] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Only run intro sequence animations if 3D is active
    if (!is3DActive) return;

    const armTimer = setTimeout(() => setIsArmed(true), 80);
    const doneTimer = setTimeout(() => setIsDone(true), 2100);

    return () => {
      clearTimeout(armTimer);
      clearTimeout(doneTimer);
    };
  }, [is3DActive]);

  const handleCTAClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    scrollToElement("#contact");
  };

  const lines = [
    [ { t: 'We', a: false }, { t: 'build', a: false }, { t: 'AI', a: true }, { t: 'systems', a: true } ],
    [ { t: 'that', a: false }, { t: 'run', a: false }, { t: 'your', a: false }, { t: 'business.', a: false } ],
  ];

  const renderHeadline = () => {
    return lines.map((words, li) => (
      <span key={li} className="kw-line flex justify-center">
        {words.map((w, k) => {
          const delay = li * 110 + k * 36;
          return (
            <span
              key={k}
              className="kw"
              style={{
                animationDelay: `${delay}ms`,
                color: w.a ? "#43C2D8" : "#f6f6fd",
                fontStyle: w.a ? 'italic' : 'normal',
                fontWeight: w.a ? 700 : 300,
              }}
            >
              {w.t}&nbsp;
            </span>
          );
        })}
      </span>
    ));
  };

  if (!is3DActive) {
    // Mobile / prefers-reduced-motion fallback layout
    return (
      <section
        id="hero"
        className="relative overflow-hidden bg-[#020202] w-full min-h-[90vh] flex flex-col justify-center items-center px-6 pt-28 pb-16"
      >
        {/* Ambient background glow */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: "radial-gradient(70% 50% at 50% 18%, rgba(43,194,216,0.22), rgba(14,95,181,0.05) 45%, transparent 70%)"
          }}
          aria-hidden="true"
        />

        {/* Mobile-only animated backdrop (hidden on desktop, disabled on reduced-motion) */}
        <div className="mobile-hero-bg absolute inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
          <div className="mobile-orb mobile-orb-1" />
          <div className="mobile-orb mobile-orb-2" />
          <div className="mobile-twinkles">
            <div className="twinkle-dot" style={{ top: "15%", left: "20%" }} />
            <div className="twinkle-dot" style={{ top: "25%", left: "80%" }} />
            <div className="twinkle-dot" style={{ top: "45%", left: "15%" }} />
            <div className="twinkle-dot" style={{ top: "35%", left: "70%" }} />
            <div className="twinkle-dot" style={{ top: "60%", left: "85%" }} />
            <div className="twinkle-dot" style={{ top: "70%", left: "25%" }} />
            <div className="twinkle-dot" style={{ top: "80%", left: "75%" }} />
            <div className="twinkle-dot" style={{ top: "50%", left: "50%" }} />
            <div className="twinkle-dot" style={{ top: "10%", left: "60%" }} />
            <div className="twinkle-dot" style={{ top: "90%", left: "40%" }} />
            <div className="twinkle-dot" style={{ top: "65%", left: "65%" }} />
            <div className="twinkle-dot" style={{ top: "30%", left: "45%" }} />
          </div>
        </div>

        {/* glowing orb stand-in */}
        <div className="relative mx-auto h-44 w-44 mt-8" aria-hidden="true">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: "radial-gradient(circle at 38% 32%, #43C2D8, #0E5FB5 70%)",
              boxShadow: "0 0 70px -6px #43C2D8"
            }}
          />
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: "radial-gradient(circle at 65% 70%, rgba(255,255,255,0.18), transparent 50%)"
            }}
          />
        </div>

        <h1 className="relative text-center mt-12 text-4xl md:text-5xl font-light tracking-tight text-[#f6f6fd] leading-tight max-w-2xl font-sora">
          We build <span className="text-shimmer italic font-bold">AI systems</span> that run your business.
        </h1>
        
        <p className="relative text-center mt-6 text-base md:text-lg text-[#f6f6fd]/60 max-w-xl leading-relaxed">
          We help businesses stop doing things manually and start running on AI.
        </p>

        <a
          href="https://cal.com/ai-buddies/30min"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-shine relative mx-auto flex w-fit items-center gap-2 mt-8 text-sm font-semibold text-[#021018] px-6 py-3 rounded-full bg-[#43C2D8] shadow-[0_0_10px_0_rgba(43,160,220,0.55)] transition-transform hover:scale-[1.03]"
        >
          Book a Free Call
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 6l6 6-6 6"/>
          </svg>
        </a>

        {/* Stats grid */}
        <div className="relative grid grid-cols-3 text-center mt-16 gap-6 w-full max-w-xl border-t border-border-custom/15 pt-8">
          {[
            ['6+', 'Businesses Automated'],
            ['5', 'AI Systems'],
            ['24/7', 'Always-On']
          ].map(([k, v]) => (
            <div key={v} className="flex flex-col items-center">
              <div className="text-2xl md:text-3xl font-bold text-[#f6f6fd] leading-none">{k}</div>
              <div className="text-[10px] md:text-xs text-[#f6f6fd]/60 mt-2 font-mono uppercase tracking-wider leading-tight">{v}</div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      id="hero"
      className="relative h-screen w-full overflow-hidden bg-transparent flex flex-col justify-between"
    >
      <style dangerouslySetInnerHTML={{ __html: `
        /* headline: line masks + per-word slide-up reveal */
        .kinetic { display: flex; flex-direction: column; align-items: center; }
        .kw-line { display: block; overflow: hidden; padding-bottom: 0.06em; white-space: nowrap; }
        .kinetic .kw { display: inline-block; }
        @media (prefers-reduced-motion: no-preference) {
          .kinetic.kinetic--anim .kw {
            opacity: 0;
            transform: translateY(110%);
            filter: blur(6px);
            animation: kwRise 820ms cubic-bezier(0.16,1,0.3,1) forwards;
          }
        }
        @keyframes kwRise {
          from { opacity: 0; transform: translateY(110%); filter: blur(6px); }
          60%  { opacity: 1; filter: blur(0); }
          to   { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        .kinetic--done .kw { opacity: 1 !important; transform: none !important; filter: none !important; animation: none !important; }

        .intro-up { opacity: 0; transform: translateY(18px); }
        @media (prefers-reduced-motion: no-preference) {
          .intro-up.intro-up--armed {
            animation: introUp 700ms cubic-bezier(0.16,1,0.3,1) forwards;
            animation-delay: 1000ms;
          }
        }
        @keyframes introUp { to { opacity: 1; transform: translateY(0); } }
        .intro-up.intro-up--done { opacity: 1 !important; transform: none !important; animation: none !important; }
      `}} />

      {/* Radial overlay glow behind text */}
      <div
        className="hero-light-ray pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(60% 55% at 50% 42%, rgba(43,160,220,0.20), rgba(14,95,181,0.06) 45%, transparent 72%)"
        }}
        aria-hidden="true"
      />

      {/* Parallax background watermark */}
      <div
        id="hero-watermark"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden z-0"
        style={{ willChange: "transform" }}
      >
        <span
          className="select-none whitespace-nowrap font-bold text-[#f6f6fd] opacity-[0.05]"
          style={{ fontSize: "clamp(72px, 16vw, 200px)", lineHeight: 1, letterSpacing: "0.01em" }}
        >
          AI BUDDIES
        </span>
      </div>

      {/* Center Kinetic Headline */}
      <div className="absolute inset-0 z-10 flex items-center justify-center px-6">
        <h1
          className={`kinetic text-center text-[40px] md:text-[60px] leading-[1.1] font-light tracking-tight font-sora ${
            isArmed ? "kinetic--anim" : ""
          } ${isDone ? "kinetic--done" : ""}`}
        >
          {renderHeadline()}
        </h1>
      </div>

      {/* Bottom Supporting Content & Stats */}
      <div
        className={`intro-up absolute bottom-0 left-0 right-0 z-20 px-7 md:px-12 pb-12 transition-all duration-300 ${
          isArmed ? "intro-up--armed" : ""
        } ${isDone ? "intro-up--done" : ""}`}
      >
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between max-w-5xl mx-auto w-full">
          <div className="max-w-md">
            <p className="text-lg text-[#f6f6fd]/60 leading-relaxed font-sora">
              We help businesses stop doing things manually and start running on AI.
            </p>
            <Magnetic>
              <a
                href="https://cal.com/ai-buddies/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-shine inline-flex w-fit items-center gap-2 whitespace-nowrap transition-transform hover:scale-[1.03] mt-5 text-sm font-semibold text-[#021018] px-6 py-3 rounded-full bg-[#43C2D8] shadow-[0_0_10px_0_rgba(43,160,220,0.55)] focus:outline-none focus:ring-2 focus:ring-[#f6f6fd]"
              >
                Book a Free Call
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6"/>
                </svg>
              </a>
            </Magnetic>
          </div>
          <div className="flex gap-12">
            {[
              ['6+', 'Businesses Automated'],
              ['5', 'AI Systems Under One Roof'],
              ['24/7', 'Always-On']
            ].map(([k, v]) => (
              <div key={v} className="max-w-[150px] flex flex-col justify-end">
                <div className="text-[30px] font-bold text-[#f6f6fd] leading-none font-sora">{k}</div>
                <div className="text-[11px] text-[#f6f6fd]/60 mt-3 font-mono uppercase tracking-wider leading-tight">{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
