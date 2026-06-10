/* eslint-disable */
import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { BRAND_CONFIG } from "@/config/content";

const TAU = Math.PI * 2;
const rnd = (a: number, b: number) => a + Math.random() * (b - a);

function makeBubble(n: number): Float32Array {
  const a = new Float32Array(n * 3);
  const W = 1.5, H = 1.05, cr = 0.42;
  const inRounded = (x: number, y: number) => {
    const ax = Math.abs(x), ay = Math.abs(y);
    if (ax <= W - cr || ay <= H - cr) return ax <= W && ay <= H;
    const dx = ax - (W - cr), dy = ay - (H - cr);
    return dx * dx + dy * dy <= cr * cr;
  };
  for (let i = 0; i < n; i++) {
    let x, y;
    if (i % 9 === 0) {
      const t = Math.random(), s = Math.random() * t;
      x = -0.55 + (s - t * 0.5) * 0.7;
      y = -H - t * 0.62 + 0.02;
    } else {
      do {
        x = rnd(-W, W);
        y = rnd(-H, H);
      } while (!inRounded(x, y));
    }
    a[i * 3] = x;
    a[i * 3 + 1] = y + 0.18;
    a[i * 3 + 2] = rnd(-0.1, 0.1);
  }
  return a;
}

function makeHub(n: number): Float32Array {
  const a = new Float32Array(n * 3);
  const SAT = 6, R = 1.45;
  const sat: [number, number][] = [];
  for (let s = 0; s < SAT; s++) {
    const ang = (s / SAT) * TAU + 0.3;
    sat.push([Math.cos(ang) * R, Math.sin(ang) * R]);
  }
  for (let i = 0; i < n; i++) {
    let x, y;
    const bucket = i % 5;
    if (bucket === 0) {
      const a2 = Math.random() * TAU, rr = Math.random() * 0.28;
      x = Math.cos(a2) * rr;
      y = Math.sin(a2) * rr;
    } else if (bucket === 1) {
      const s = sat[i % SAT];
      const a2 = Math.random() * TAU, rr = Math.random() * 0.2;
      x = s[0] + Math.cos(a2) * rr;
      y = s[1] + Math.sin(a2) * rr;
    } else {
      const s = sat[i % SAT];
      const t = Math.random();
      x = s[0] * t + (Math.random() - 0.5) * 0.05;
      y = s[1] * t + (Math.random() - 0.5) * 0.05;
    }
    a[i * 3] = x;
    a[i * 3 + 1] = y;
    a[i * 3 + 2] = rnd(-0.12, 0.12);
  }
  return a;
}

function makeWaves(n: number): Float32Array {
  const a = new Float32Array(n * 3);
  const rings = [0.32, 0.62, 0.92, 1.22, 1.5];
  for (let i = 0; i < n; i++) {
    const ri = i % rings.length;
    const r = rings[ri] + (Math.random() - 0.5) * 0.04;
    const ang = Math.random() * TAU;
    a[i * 3] = Math.cos(ang) * r;
    a[i * 3 + 1] = Math.sin(ang) * r;
    a[i * 3 + 2] = Math.sin(ang * 6 + ri) * 0.12;
  }
  return a;
}

function makeFunnel(n: number): Float32Array {
  const a = new Float32Array(n * 3);
  const top = 1.0, bot = -1.05, rTop = 1.45, rBot = 0.04;
  for (let i = 0; i < n; i++) {
    const t = Math.random();
    const y = top + (bot - top) * t;
    const r = rTop + (rBot - rTop) * t;
    const ang = Math.random() * TAU;
    a[i * 3] = Math.cos(ang) * r;
    a[i * 3 + 1] = y;
    a[i * 3 + 2] = Math.sin(ang) * r;
  }
  return a;
}

function makeGear(n: number): Float32Array {
  const a = new Float32Array(n * 3);
  const teeth = 9, rOut = 1.45, rIn = 1.12, rHole = 0.42;
  for (let i = 0; i < n; i++) {
    const bucket = i % 5;
    let x, y;
    if (bucket < 3) {
      const ang = Math.random() * TAU;
      const phase = ((ang / TAU) * teeth) % 1;
      const r = (phase < 0.5 ? rOut : rIn) + (Math.random() - 0.5) * 0.04;
      x = Math.cos(ang) * r;
      y = Math.sin(ang) * r;
    } else if (bucket === 3) {
      const ang = Math.random() * TAU;
      const r = rnd(rHole + 0.08, rIn - 0.04);
      x = Math.cos(ang) * r;
      y = Math.sin(ang) * r;
    } else {
      const ang = Math.random() * TAU;
      const r = rHole + (Math.random() - 0.5) * 0.05;
      x = Math.cos(ang) * r;
      y = Math.sin(ang) * r;
    }
    a[i * 3] = x;
    a[i * 3 + 1] = y;
    a[i * 3 + 2] = rnd(-0.12, 0.12);
  }
  return a;
}

interface ServicesProps {
  interactive?: boolean;
  activeIndex?: number; // Kept for compatibility but scroll updates are handled internally
  onCardClick?: (index: number) => void;
}

const SERVICE_DETAILS = [
  { id: "ai-chatbots", n: "01", shape: "bubble", sub: ["Website chat", "Context memory", "Instant replies"] },
  { id: "whatsapp-automation", n: "02", shape: "hub", sub: ["Broadcasts", "Reminders", "Booking flows"] },
  { id: "voice-agents", n: "03", shape: "waves", sub: ["After-hours answering", "Appointment booking", "Outbound calls"] },
  { id: "lead-qualification", n: "04", shape: "funnel", sub: ["Auto-scoring", "Nurture", "Routing"] },
  { id: "ai-customer-support", n: "05", shape: "gear", sub: ["Ticket deflection", "FAQ resolution", "Human handoff"] }
];

const POWERED = ["n8n", "WhatsApp API", "LLMs", "Webhooks"];

function StaticIcon({ shape }: { shape: string }) {
  const s = {
    width: 40,
    height: 40,
    fill: "none",
    stroke: "#43C2D8",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const
  };
  switch (shape) {
    case "bubble":
      return (
        <svg viewBox="0 0 24 24" {...s}>
          <path d="M5 5h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H9l-4 4v-4H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" />
        </svg>
      );
    case "hub":
      return (
        <svg viewBox="0 0 24 24" {...s}>
          <circle cx="12" cy="12" r="2.5" />
          <circle cx="4" cy="6" r="1.6" />
          <circle cx="20" cy="6" r="1.6" />
          <circle cx="4" cy="18" r="1.6" />
          <circle cx="20" cy="18" r="1.6" />
          <path d="M10 11 5 7M14 11l5-4M10 13l-5 4M14 13l5 4" />
        </svg>
      );
    case "waves":
      return (
        <svg viewBox="0 0 24 24" {...s}>
          <path d="M2 12h2M20 12h2" />
          <path d="M6 9v6M9 6v12M12 4v16M15 6v12M18 9v6" />
        </svg>
      );
    case "funnel":
      return (
        <svg viewBox="0 0 24 24" {...s}>
          <path d="M3 5h18l-7 8v6l-4 2v-8L3 5Z" />
        </svg>
      );
    case "gear":
      return (
        <svg viewBox="0 0 24 24" {...s}>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" />
        </svg>
      );
    default:
      return null;
  }
}

export default function Services({
  interactive = false,
  activeIndex = 0,
  onCardClick
}: ServicesProps) {
  const servicesRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const counterRef = useRef<HTMLDivElement>(null);

  const servicesData = BRAND_CONFIG.services.map((s) => {
    const detail = SERVICE_DETAILS.find((d) => d.id === s.id) || { n: "01", shape: "bubble", sub: [] };
    return {
      ...s,
      n: detail.n,
      shape: detail.shape,
      sub: detail.sub
    };
  });

  useEffect(() => {
    if (!interactive) return;

    let rafId = 0;
    let disposed = false;

    const CARD_STEP_FALLBACK = 468; // 440px card width + 28px gap
    let trackX = 0;

    const loop = () => {
      if (disposed) return;
      rafId = requestAnimationFrame(loop);

      const servicesEl = servicesRef.current;
      if (!servicesEl) return;

      const sr = servicesEl.getBoundingClientRect();
      const vh = window.innerHeight;
      const scrollable = sr.height - vh;
      const sp = Math.min(1, Math.max(0, -sr.top / (scrollable || 1)));
      const activeFloat = sp * (5 - 1); // 5 cards total

      // Slide the carousel track
      const cardStep = cardRefs.current[0] ? cardRefs.current[0].clientWidth + 28 : CARD_STEP_FALLBACK;
      const focal = 56;
      const targetX = focal - activeFloat * cardStep;
      trackX += (targetX - trackX) * 0.15;
      if (trackRef.current) {
        trackRef.current.style.transform = `translate(${trackX}px, -50%)`;
      }

      // Update scale, opacity, border, glow, and details for each card
      for (let i = 0; i < cardRefs.current.length; i++) {
        const card = cardRefs.current[i];
        if (!card) continue;
        const t = Math.min(1, Math.max(0, 1 - Math.abs(i - activeFloat)));

        card.style.transform = `scale(${0.9 + 0.1 * t})`;
        card.style.opacity = `${0.4 + 0.6 * t}`;
        card.style.boxShadow = `0 0 10px 0 rgba(43,160,220,${(0.55 * t).toFixed(3)})`;
        card.style.borderColor = `rgba(43,160,220,${(0.18 + 0.62 * t).toFixed(3)})`;

        const fills = card.querySelectorAll(".card-fill") as NodeListOf<HTMLElement>;
        fills.forEach((el) => {
          el.style.opacity = `${t}`;
        });

        const detail = card.querySelector(".card-detail") as HTMLElement;
        if (detail) {
          detail.style.opacity = `${Math.min(1, Math.max(0, (t - 0.45) / 0.55))}`;
        }

        const num = card.querySelector(".card-num") as HTMLElement;
        if (num) {
          // Interpolate color from COL.accent rgb(67, 194, 216) to COL.white rgb(246, 246, 253)
          const r = Math.round(67 + (246 - 67) * t);
          const g = Math.round(194 + (246 - 194) * t);
          const b = Math.round(216 + (253 - 216) * t);
          num.style.color = `rgb(${r},${g},${b})`;
        }

        const arrow = card.querySelector(".card-arrow") as HTMLElement;
        if (arrow) {
          arrow.style.background = `rgba(255,255,255,${(0.16 * t).toFixed(3)})`;
          arrow.style.borderColor = t > 0.5 ? "rgba(255,255,255,0.5)" : "rgba(67,194,216,0.35)";
          const svg = arrow.querySelector("svg") as SVGElement;
          if (svg) {
            svg.style.color = t > 0.5 ? "#ffffff" : "#43C2D8";
          }
        }
      }

      if (counterRef.current) {
        const cur = String(Math.min(5, Math.max(1, Math.round(activeFloat) + 1))).padStart(2, "0");
        counterRef.current.textContent = `${cur} / 05`;
      }
    };

    loop();

    // Expose scrollToService on window to allow external triggers to scroll smoothly
    (window as any).scrollToService = (index: number) => {
      const el = servicesRef.current;
      const lenis = (window as any).lenisInstance;
      if (el && lenis) {
        const rect = el.getBoundingClientRect();
        const start = window.scrollY + rect.top;
        const scrollable = rect.height - window.innerHeight;
        const targetScroll = start + (index / 4) * scrollable;
        lenis.scrollTo(targetScroll, {
          duration: 1.2,
          ease: (t: number) => 1 - Math.pow(1 - t, 3)
        });
      }
    };

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      if (typeof window !== "undefined") {
        delete (window as any).scrollToService;
      }
    };
  }, [interactive]);

  if (!interactive) {
    // Mobile / prefers-reduced-motion fallback layout (static stacked cards list)
    return (
      <section
        id="services"
        className="relative px-6 py-24 bg-[#020202] w-full"
      >
        <div className="max-w-xl mx-auto">
          <span className="text-xs font-mono tracking-[0.3em] text-[#43C2D8] uppercase">
            What We Build
          </span>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-[#f6f6fd] mt-3 font-sora leading-[1.1]">
            AI Automations &amp; Skills
          </h2>

          <div className="flex flex-col mt-8 gap-6">
            {servicesData.map((s) => (
              <div
                key={s.n}
                style={{
                  borderRadius: 24,
                  padding: 24,
                  border: "1px solid rgba(43,160,220,0.2)",
                  background: "linear-gradient(180deg, rgba(8,12,18,0.8), rgba(2,2,2,0.7))"
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="tabular-nums font-bold text-[#43C2D8] text-4xl leading-none">
                    {s.n}
                  </span>
                  <StaticIcon shape={s.shape} />
                </div>
                <h3 className="text-2xl font-semibold tracking-tight text-white mt-4 font-sora">
                  {s.title}
                </h3>
                <p className="text-sm text-[#f6f6fd]/60 mt-3 leading-relaxed">
                  {s.description}
                </p>
                <div className="flex flex-wrap mt-4 gap-2">
                  {s.sub.map((x) => (
                    <span
                      key={x}
                      className="text-xs text-[#f6f6fd] px-3.5 py-1.5 rounded-full bg-[rgba(67,194,216,0.10)] border border-[rgba(67,194,216,0.22)]"
                    >
                      {x}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center flex-wrap mt-8 gap-2">
            <span className="text-xs font-mono tracking-[0.18em] text-[#f6f6fd]/40 uppercase">
              Powered by
            </span>
            {POWERED.map((p) => (
              <span
                key={p}
                className="text-xs text-[#f6f6fd]/60 px-3 py-1 rounded-full border border-border-custom/10"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={servicesRef}
      id="services"
      className="relative w-full bg-transparent"
      style={{ height: "500vh" }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        .svc-card {
          width: 440px;
          transform-origin: center center;
          transition: opacity 0.25s ease;
          will-change: transform, opacity;
        }
        .svc-card:hover { box-shadow: 0 0 34px -8px rgba(67,194,216,0.35); }
        .card-fill { transition: opacity 0.3s ease; }
        .card-detail { transition: opacity 0.3s ease; }
        .glass { backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); }
      `}} />

      <div
        className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center"
      >
        <div className="flex h-full w-full">
          {/* Left Column */}
          <div className="relative w-[44%] md:w-1/2 h-full flex flex-col justify-between py-24 pl-12 pr-6 select-none">
            
            <div className="relative z-10 pt-8 max-w-sm">
              <div className="text-xs font-semibold tracking-[0.3em] text-[#43C2D8] uppercase font-mono">
                What We Build
              </div>
              <h2 className="text-[40px] font-semibold tracking-tight text-[#f6f6fd] mt-5 leading-[1.2] font-sora">
                AI Automations<br />&amp; Skills
              </h2>
              <p className="text-lg text-[#f6f6fd]/60 mt-6 leading-relaxed font-sora max-w-[28ch]">
                Five systems, one stack. Scroll to explore what each buddy does.
              </p>
            </div>
            
            <div className="relative z-10 flex items-center gap-5 pb-4">
              <div
                ref={counterRef}
                className="tabular-nums text-[20px] font-semibold text-[#f6f6fd]/40 tracking-[0.1em] font-mono"
              >
                01 / 05
              </div>
              <div className="flex items-center gap-2">
                {POWERED.map((p) => (
                  <span
                    key={p}
                    className="text-xs text-[#f6f6fd]/60 px-3 py-1 rounded-full border border-[#f6f6fd]/10 font-sora"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Sliding card track container */}
          <div className="relative w-[56%] md:w-1/2 h-full overflow-hidden z-10">
            <div
              ref={trackRef}
              className="absolute top-1/2 left-0 flex items-stretch gap-[28px] will-change-transform"
              style={{ transform: "translate(56px, -50%)" }}
            >
              {servicesData.map((s, i) => (
                <div
                  key={s.n}
                  ref={(el) => { cardRefs.current[i] = el; }}
                  className="svc-card glass relative shrink-0 overflow-hidden"
                  style={{
                    height: "64vh",
                    maxHeight: 560,
                    borderRadius: 24,
                    border: "1px solid rgba(43,160,220,0.18)",
                    background: "linear-gradient(180deg, rgba(8,12,18,0.55), rgba(2,2,2,0.5))"
                  }}
                >
                  {/* active card fill gradient */}
                  <div
                    className="card-fill pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300"
                    style={{ background: "linear-gradient(165deg, #2BA0DC 0%, #0E5FB5 78%)" }}
                  />
                  {/* active top border light indicator */}
                  <div
                    className="card-fill pointer-events-none absolute inset-x-0 top-0 h-[3px] opacity-0 transition-opacity duration-300 bg-[#43C2D8]"
                  />

                  <div className="relative h-full flex flex-col p-10 justify-between select-none">
                    <div className="flex items-start justify-between">
                      <span className="card-num tabular-nums text-[56px] font-bold leading-none text-[#43C2D8]">
                        {s.n}
                      </span>
                      <span className="card-arrow grid place-items-center h-11 w-11 rounded-full border border-[rgba(67,194,216,0.35)] transition-all duration-300">
                        <svg
                          width="17"
                          height="17"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-[#43C2D8]"
                        >
                          <path d="M7 17 17 7M9 7h8v8" />
                        </svg>
                      </span>
                    </div>

                    <h3 className="card-title text-[30px] font-semibold tracking-tight text-white font-sora mt-auto">
                      {s.title}
                    </h3>

                    <div className="card-detail opacity-0 transition-opacity duration-300">
                      <p className="text-sm text-white/92 mt-4 leading-relaxed max-w-[34ch] font-sora">
                        {s.description}
                      </p>

                      <div className="mt-6">
                        <div className="text-[12px] font-mono tracking-[0.22em] uppercase text-white/70">
                          Services
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {s.sub.map((subItem) => (
                            <span
                              key={subItem}
                              className="text-xs text-white px-3.5 py-1.5 rounded-full bg-white/14 border border-white/28 font-sora"
                            >
                              {subItem}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 mt-7">
                        <span className="text-[12px] font-mono tracking-[0.18em] uppercase text-white/60">
                          Powered by
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {POWERED.map((p) => (
                            <span key={p} className="text-xs text-white/85 font-sora">
                              {p}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
