"use client";

import React, { useState, useId, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BRAND_CONFIG } from "@/config/content";
import CornerBorders from "../ui/corner-borders";
import { CheckCircle2, MessageCircle, ChevronRight, ChevronLeft, ArrowRight, Lock } from "lucide-react";

interface FormFields {
  industry: string;
  goal: string;
  name: string;
  whatsapp: string;
  email: string;
}

interface FormErrors {
  name?: string;
  whatsapp?: string;
  email?: string;
}

export default function ContactForm() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormFields>({
    industry: "",
    goal: "",
    name: "",
    whatsapp: "",
    email: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [announcement, setAnnouncement] = useState("");

  const nameId = useId();
  const whatsappId = useId();
  const emailId = useId();

  // Read the booking URL from environment variables
  const bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL || "https://cal.com/ai-buddies/30min";

  // Set screen-reader announcements on step changes
  useEffect(() => {
    if (step === 1) {
      setAnnouncement("Step 1 of 3: Select your industry.");
    } else if (step === 2) {
      setAnnouncement("Step 2 of 3: Select your primary business goal.");
    } else if (step === 3) {
      setAnnouncement("Step 3 of 3: Enter your contact details.");
    } else if (status === "success") {
      setAnnouncement(bookingUrl ? "Form submitted. Please schedule your call on the scheduler below." : "Form submitted successfully.");
    }
  }, [step, status, bookingUrl]);

  const industries = [
    { value: "Clinic/Healthcare", label: "Clinic / Healthcare" },
    { value: "Marketing Agency", label: "Marketing Agency" },
    { value: "Coach/Consultant", label: "Coach / Consultant" },
    { value: "Media Company", label: "Media Company" },
    { value: "Other Service Business", label: "Other Service Business" },
  ];

  const goals = [
    { value: "More leads", label: "Get More Leads" },
    { value: "24-7 support", label: "Automate Support (24/7)" },
    { value: "WhatsApp automation", label: "WhatsApp Automation" },
    { value: "Voice agent", label: "AI Voice Agents" },
    { value: "Not sure", label: "Not Sure (Need Audit)" },
  ];

  // Validate WhatsApp formats (Indian and International)
  const validateWhatsApp = (num: string) => {
    const clean = num.replace(/[\s\-\(\)]/g, "");
    const indianRegex = /^(?:\+?91|0)?[6-9]\d{9}$/;
    const intlRegex = /^\+\d{1,4}\d{6,14}$/;
    return indianRegex.test(clean) || intlRegex.test(clean);
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSelectField = (field: "industry" | "goal", value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Automatically advance steps for low-friction flow
    setTimeout(() => {
      setStep((prev) => prev + 1);
    }, 250);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate Step 3
    const newErrors: FormErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required.";
    
    if (!form.whatsapp.trim()) {
      newErrors.whatsapp = "WhatsApp number is required.";
    } else if (!validateWhatsApp(form.whatsapp)) {
      newErrors.whatsapp = "Please enter a valid WhatsApp number (e.g. +91 98765 43210).";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!validateEmail(form.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setStatus("loading");

    // Simulate lead submission endpoint API call
    setTimeout(() => {
      // 1. Log the payload to the console
      console.log("AI BUDDIES - QUALIFIED LEAD PAYLOAD:", form);
      
      // TODO: Send payload to your CRM/Webhook endpoint (e.g. n8n) for instant speed-to-lead follow-up
      // fetch(process.env.NEXT_PUBLIC_LEAD_WEBHOOK_URL || '', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(form)
      // });

      setStatus("success");
    }, 1500);
  };

  const slideVariants = {
    enter: { opacity: 0, x: 20 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <section 
      id="contact" 
      className="py-20 md:py-28 px-6 md:px-12 lg:px-24 bg-surface-base w-full overflow-hidden"
    >
      {/* Screen Reader Live region for accessibility */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left: Contact Info Block */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-mono tracking-widest text-signature uppercase">
                09 / Book A Call
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white font-sora">
                Start Running on AI
              </h2>
            </div>
            
            <p className="text-sm md:text-base text-text-tertiary leading-relaxed">
              Answer 3 simple questions to qualify your workflows, then instantly schedule a direct consultation call to automate your business bottlenecks.
            </p>

            <div className="flex flex-col gap-4 mt-4">
              <a 
                href={BRAND_CONFIG.contact.whatsappLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3.5 rounded-xl bg-whatsapp/5 border border-whatsapp/10 hover:bg-whatsapp/10 hover:border-whatsapp/25 transition-all duration-300 group select-none min-h-[48px]"
              >
                <div className="p-2 rounded bg-whatsapp/10 border border-whatsapp/20 text-whatsapp transition-colors group-hover:bg-whatsapp/20">
                  <MessageCircle size={18} />
                </div>
                <div className="flex-1">
                  <div className="text-[10px] text-text-tertiary flex items-center gap-1.5">
                    <span>WhatsApp Chat</span>
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-whatsapp/10 border border-whatsapp/30 text-[9px] text-whatsapp font-bold font-sans">
                      <svg className="w-2.5 h-2.5 fill-current text-whatsapp" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {(BRAND_CONFIG as any).trustSignals?.verifiedBadgeText}
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-white group-hover:text-whatsapp transition-colors mt-0.5">
                    {(BRAND_CONFIG as any).trustSignals?.whatsappClickToChat} ({BRAND_CONFIG.contact.whatsapp})
                  </div>
                </div>
              </a>
            </div>
          </div>

          {/* Right: Multi-Step Qualifier Panel */}
          <div className="lg:col-span-7 w-full">
            <CornerBorders className="p-8 bg-surface-raised/40 backdrop-blur-sm glow-border">
              
              {status === "success" ? (
                // Success screen / Scheduler Embed
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full flex flex-col gap-6"
                >
                  <div className="text-center flex flex-col items-center gap-3">
                    <div className="p-3 bg-whatsapp/10 rounded-full text-whatsapp border border-whatsapp/30">
                      <CheckCircle2 className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white font-sora">
                      Workflows Analyzed Successfully
                    </h3>
                    <p className="text-sm text-text-tertiary max-w-sm mx-auto leading-relaxed">
                      Thank you, <strong className="text-white">{form.name}</strong>. We have saved your qualifier data. Please select a booking slot below:
                    </p>
                  </div>

                  {bookingUrl ? (
                    // Embedded Cal.com / Calendly Scheduler iframe
                    <div className="w-full border border-border-custom/50 rounded-lg overflow-hidden bg-black/40 h-[500px]">
                      <iframe
                        src={bookingUrl}
                        title="Schedule Consultation"
                        className="w-full h-full border-none"
                        allow="camera; microphone; autoplay; clipboard-write"
                      />
                    </div>
                  ) : (
                    // Graceful FallbackSuccess message + Click-to-Chat WhatsApp button
                    <div className="text-center pt-2">
                      <p className="text-xs text-text-tertiary/80 leading-relaxed mb-6">
                        No online calendar configured. No problem! Click the button below to start chat directly with our AI integration team:
                      </p>
                      <a
                        href={BRAND_CONFIG.contact.whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-whatsapp hover:bg-whatsapp/90 text-black font-extrabold uppercase tracking-wider text-xs md:text-sm transition-all duration-300 hover:shadow-[0_0_20px_rgba(37,211,102,0.4)]"
                      >
                        <MessageCircle size={16} />
                        <span>Chat on WhatsApp</span>
                      </a>
                    </div>
                  )}
                </motion.div>
              ) : (
                // Active form steps
                <div className="flex flex-col gap-6">
                  
                  {/* Progress Indicator */}
                  <div className="flex items-center justify-between w-full relative pb-4 border-b border-border-custom/20">
                    <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-border-custom/30 -translate-y-1/2 z-0" />
                    <div 
                      className="absolute top-1/2 left-0 h-[2px] bg-signature -translate-y-1/2 z-0 transition-all duration-500" 
                      style={{ width: `${((step - 1) / 2) * 100}%` }}
                    />
                    
                    {[1, 2, 3].map((s) => (
                      <button
                        key={s}
                        onClick={() => {
                          // Allow backtracking only if value is present or step is less than current
                          if (s < step || (s === 2 && form.industry) || (s === 3 && form.industry && form.goal)) {
                            setStep(s);
                          }
                        }}
                        disabled={s > step && (!form.industry || (s === 3 && !form.goal))}
                        className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-all duration-300 border before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-11 before:h-11 ${
                          s < step 
                            ? "bg-signature text-black border-signature" 
                            : s === step
                            ? "bg-surface-base text-white border-signature shadow-[0_0_12px_rgba(43,160,220,0.5)]"
                            : "bg-surface-raised text-text-tertiary/40 border-border-custom/50"
                        }`}
                        aria-label={`Go to step ${s}`}
                      >
                        {s < step ? "✓" : s}
                      </button>
                    ))}
                  </div>

                  {/* Form Step Wrapper with slide animation */}
                  <div className="min-h-[280px]">
                    <AnimatePresence mode="wait">
                      {step === 1 && (
                        <motion.div
                          key="step1"
                          variants={slideVariants}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          transition={{ duration: 0.25, ease: "easeOut" }}
                          className="flex flex-col gap-4"
                        >
                          <h3 className="text-base font-bold text-white font-sora">
                            Step 1: What is your industry sector?
                          </h3>
                          <div className="flex flex-col gap-2">
                            {industries.map((ind) => {
                              const isSelected = form.industry === ind.value;
                              return (
                                <button
                                  key={ind.value}
                                  type="button"
                                  onClick={() => handleSelectField("industry", ind.value)}
                                  className={`w-full text-left p-3.5 rounded-lg border text-sm font-medium transition-all duration-200 cursor-pointer ${
                                    isSelected 
                                      ? "bg-signature/10 border-signature text-white shadow-[0_0_15px_-3px_rgba(43,160,220,0.15)]" 
                                      : "bg-surface-base/50 border-border-custom/50 text-text-secondary hover:border-signature/50 hover:bg-surface-base/80"
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <span>{ind.label}</span>
                                    {isSelected && <span className="text-signature text-xs font-mono">SELECTED</span>}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}

                      {step === 2 && (
                        <motion.div
                          key="step2"
                          variants={slideVariants}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          transition={{ duration: 0.25, ease: "easeOut" }}
                          className="flex flex-col gap-4"
                        >
                          <h3 className="text-base font-bold text-white font-sora">
                            Step 2: What is your primary automation goal?
                          </h3>
                          <div className="flex flex-col gap-2">
                            {goals.map((g) => {
                              const isSelected = form.goal === g.value;
                              return (
                                <button
                                  key={g.value}
                                  type="button"
                                  onClick={() => handleSelectField("goal", g.value)}
                                  className={`w-full text-left p-3.5 rounded-lg border text-sm font-medium transition-all duration-200 cursor-pointer ${
                                    isSelected 
                                      ? "bg-signature/10 border-signature text-white shadow-[0_0_15px_-3px_rgba(43,160,220,0.15)]" 
                                      : "bg-surface-base/50 border-border-custom/50 text-text-secondary hover:border-signature/50 hover:bg-surface-base/80"
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <span>{g.label}</span>
                                    {isSelected && <span className="text-signature text-xs font-mono">SELECTED</span>}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                          
                          <div className="mt-2 flex justify-start">
                            <button
                              type="button"
                              onClick={handlePrevStep}
                              className="inline-flex items-center gap-1 text-xs text-text-tertiary hover:text-white transition-colors py-2.5 px-3 -ml-3 rounded-lg"
                            >
                              <ChevronLeft size={14} /> Back to step 1
                            </button>
                          </div>
                        </motion.div>
                      )}

                      {step === 3 && (
                        <motion.div
                          key="step3"
                          variants={slideVariants}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          transition={{ duration: 0.25, ease: "easeOut" }}
                          className="flex flex-col gap-4"
                        >
                          <h3 className="text-base font-bold text-white font-sora">
                            Step 3: Enter your contact details
                          </h3>
                          
                          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
                            {/* Input: Name */}
                            <div className="flex flex-col gap-1.5">
                              <label htmlFor={nameId} className="text-xs font-mono font-medium text-text-secondary">
                                Your Name <span className="text-signature">*</span>
                              </label>
                              <input
                                type="text"
                                id={nameId}
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                disabled={status === "loading"}
                                className={`w-full px-4 py-3 rounded-lg border bg-surface-base text-white text-sm focus:outline-none transition-colors ${
                                  errors.name ? "border-red-500/80 focus:border-red-500" : "border-border-custom/50 focus:border-signature"
                                }`}
                              />
                              {errors.name && (
                                <span id={`${nameId}-error`} className="text-[11px] text-red-400 font-medium" role="alert">{errors.name}</span>
                              )}
                            </div>

                            {/* Input: WhatsApp */}
                            <div className="flex flex-col gap-1.5">
                              <label htmlFor={whatsappId} className="text-xs font-mono font-medium text-text-secondary">
                                WhatsApp Number <span className="text-signature">*</span>
                              </label>
                              <input
                                type="tel"
                                id={whatsappId}
                                name="whatsapp"
                                placeholder="e.g. +91 9876543210"
                                value={form.whatsapp}
                                onChange={handleChange}
                                disabled={status === "loading"}
                                className={`w-full px-4 py-3 rounded-lg border bg-surface-base text-white text-sm focus:outline-none transition-colors ${
                                  errors.whatsapp ? "border-red-500/80 focus:border-red-500" : "border-border-custom/50 focus:border-signature"
                                }`}
                              />
                              {errors.whatsapp && (
                                <span id={`${whatsappId}-error`} className="text-[11px] text-red-400 font-medium" role="alert">{errors.whatsapp}</span>
                              )}
                            </div>

                            {/* Input: Email */}
                            <div className="flex flex-col gap-1.5">
                              <label htmlFor={emailId} className="text-xs font-mono font-medium text-text-secondary">
                                Email Address <span className="text-signature">*</span>
                              </label>
                              <input
                                type="email"
                                id={emailId}
                                name="email"
                                placeholder="e.g. john@company.com"
                                value={form.email}
                                onChange={handleChange}
                                disabled={status === "loading"}
                                className={`w-full px-4 py-3 rounded-lg border bg-surface-base text-white text-sm focus:outline-none transition-colors ${
                                  errors.email ? "border-red-500/80 focus:border-red-500" : "border-border-custom/50 focus:border-signature"
                                }`}
                              />
                              {errors.email && (
                                <span id={`${emailId}-error`} className="text-[11px] text-red-400 font-medium" role="alert">{errors.email}</span>
                              )}
                            </div>

                            {/* Submit Button */}
                            <div className="mt-2 flex flex-col gap-3">
                              <button
                                type="submit"
                                disabled={status === "loading"}
                                className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-whatsapp hover:bg-whatsapp/90 disabled:bg-whatsapp/50 text-black font-extrabold uppercase tracking-wider text-xs md:text-sm transition-all duration-300 hover:shadow-[0_0_20px_rgba(37,211,102,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-whatsapp cursor-pointer"
                              >
                                {status === "loading" ? "Analyzing Workflows..." : "Qualify & Book Call"}
                                <ArrowRight size={14} className="ml-1" />
                              </button>

                              {/* Back Navigation */}
                              <button
                                type="button"
                                onClick={handlePrevStep}
                                className="self-start inline-flex items-center gap-1 text-xs text-text-tertiary hover:text-white transition-colors py-2.5 px-3 -ml-3 rounded-lg mt-1"
                              >
                                <ChevronLeft size={14} /> Back to step 2
                              </button>

                              {/* Privacy reassurance line */}
                              <div className="mt-2 pt-2 border-t border-border-custom/10 flex items-center justify-center gap-1.5 text-[11px] text-text-tertiary/65 font-mono">
                                <Lock size={12} className="text-signature shrink-0" />
                                <span>{(BRAND_CONFIG as any).trustSignals?.privacyLine}</span>
                              </div>
                            </div>
                          </form>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                </div>
              )}
            </CornerBorders>
          </div>

        </div>
      </div>
    </section>
  );
}
