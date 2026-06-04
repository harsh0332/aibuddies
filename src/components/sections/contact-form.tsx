"use client";

import React, { useState, useId } from "react";
import { motion } from "framer-motion";
import { BRAND_CONFIG } from "@/config/content";
import CornerBorders from "../ui/corner-borders";
import { Send, CheckCircle2, MessageCircle } from "lucide-react";

interface FormFields {
  name: string;
  businessName: string;
  whatsapp: string;
  email: string;
  service: string;
  businessType: string;
  message: string;
}

interface FormErrors {
  name?: string;
  businessName?: string;
  whatsapp?: string;
  email?: string;
  service?: string;
}

export default function ContactForm() {
  const [form, setForm] = useState<FormFields>({
    name: "",
    businessName: "",
    whatsapp: "",
    email: "",
    service: "",
    businessType: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const nameId = useId();
  const businessNameId = useId();
  const whatsappId = useId();
  const emailId = useId();
  const serviceId = useId();
  const businessTypeId = useId();
  const messageId = useId();

  // Validate WhatsApp formats (Indian and International)
  const validateWhatsApp = (num: string) => {
    const clean = num.replace(/[\s\-\(\)]/g, "");
    
    // Indian format: matches 10 digits optionally prefixed by +91, 91, or 0
    const indianRegex = /^(?:\+?91|0)?[6-9]\d{9}$/;
    
    // International format: starts with + followed by country code (1 to 4 digits) and local number (6 to 12 digits)
    const intlRegex = /^\+\d{1,4}\d{6,14}$/;

    return indianRegex.test(clean) || intlRegex.test(clean);
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    
    // Clear error inline as user types
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Perform validation
    const newErrors: FormErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required.";
    if (!form.businessName.trim()) newErrors.businessName = "Business name is required.";
    
    if (!form.whatsapp.trim()) {
      newErrors.whatsapp = "WhatsApp number is required.";
    } else if (!validateWhatsApp(form.whatsapp)) {
      newErrors.whatsapp = "Please enter a valid WhatsApp number (e.g. +91 98765 43210 or +1 234 567 8900).";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!validateEmail(form.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!form.service) newErrors.service = "Please select a service interest.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setStatus("loading");

    // Simulate lead submission endpoint API call
    setTimeout(() => {
      // 1. Log the payload to the console
      console.log("AI BUDDIES - LEAD FORM SUBMISSION PAYLOAD:", form);
      
      // 2. TODO: Implement actual backend endpoint submission here
      // Example: fetch('/api/leads', { method: 'POST', body: JSON.stringify(form) })

      setStatus("success");
    }, 1500);
  };

  return (
    <section 
      id="contact" 
      className="py-20 md:py-28 px-6 md:px-12 lg:px-24 bg-surface-base w-full overflow-hidden"
    >
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
              Fill out the form to schedule your free workflow audit. We will analyze your manual bottlenecks and present a functional automation blueprint.
            </p>

            <div className="flex flex-col gap-4 mt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded bg-whatsapp/10 border border-whatsapp/20 text-whatsapp select-none">
                  <MessageCircle size={18} />
                </div>
                <div>
                  <div className="text-xs text-text-tertiary">WhatsApp Channel</div>
                  <a 
                    href={BRAND_CONFIG.contact.whatsappLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-white hover:text-whatsapp transition-colors"
                  >
                    {BRAND_CONFIG.contact.whatsapp}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Contact Form Panel */}
          <div className="lg:col-span-7">
            <CornerBorders className="p-8 bg-surface-raised/40 backdrop-blur-sm glow-border">
              {status === "success" ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-10 flex flex-col items-center gap-4"
                >
                  <div className="p-4 bg-whatsapp/10 rounded-full text-whatsapp border border-whatsapp/30">
                    <CheckCircle2 className="h-10 w-10" />
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight text-white font-sora">
                    Booking Request Received
                  </h3>
                  <p className="text-sm text-text-tertiary max-w-sm mx-auto leading-relaxed">
                    Thank you, <strong className="text-white">{form.name}</strong>. We have logged your request for <strong className="text-white">{form.businessName}</strong>. Our team will contact you on WhatsApp shortly.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
                  
                  {/* Row 1: Name and Business Name */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor={nameId} className="text-xs font-mono font-medium text-text-secondary">
                        Your Name <span className="text-signature" aria-hidden="true">*</span>
                      </label>
                      <input
                        type="text"
                        id={nameId}
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        disabled={status === "loading"}
                        aria-invalid={errors.name ? "true" : "false"}
                        aria-describedby={errors.name ? `${nameId}-error` : undefined}
                        className={`w-full px-4 py-3 rounded-lg border bg-surface-base text-white text-sm focus:outline-none transition-colors ${
                          errors.name ? "border-red-500/80 focus:border-red-500" : "border-border-custom/50 focus:border-signature"
                        }`}
                      />
                      {errors.name && (
                        <span id={`${nameId}-error`} className="text-[11px] text-red-400 font-medium" role="alert">{errors.name}</span>
                      )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor={businessNameId} className="text-xs font-mono font-medium text-text-secondary">
                        Business Name <span className="text-signature" aria-hidden="true">*</span>
                      </label>
                      <input
                        type="text"
                        id={businessNameId}
                        name="businessName"
                        value={form.businessName}
                        onChange={handleChange}
                        disabled={status === "loading"}
                        aria-invalid={errors.businessName ? "true" : "false"}
                        aria-describedby={errors.businessName ? `${businessNameId}-error` : undefined}
                        className={`w-full px-4 py-3 rounded-lg border bg-surface-base text-white text-sm focus:outline-none transition-colors ${
                          errors.businessName ? "border-red-500/80 focus:border-red-500" : "border-border-custom/50 focus:border-signature"
                        }`}
                      />
                      {errors.businessName && (
                        <span id={`${businessNameId}-error`} className="text-[11px] text-red-400 font-medium" role="alert">{errors.businessName}</span>
                      )}
                    </div>
                  </div>

                  {/* Row 2: WhatsApp Number and Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor={whatsappId} className="text-xs font-mono font-medium text-text-secondary">
                        WhatsApp Number <span className="text-signature" aria-hidden="true">*</span>
                      </label>
                      <input
                        type="tel"
                        id={whatsappId}
                        name="whatsapp"
                        placeholder="e.g. +91 9876543210"
                        value={form.whatsapp}
                        onChange={handleChange}
                        disabled={status === "loading"}
                        aria-invalid={errors.whatsapp ? "true" : "false"}
                        aria-describedby={errors.whatsapp ? `${whatsappId}-error` : undefined}
                        className={`w-full px-4 py-3 rounded-lg border bg-surface-base text-white text-sm focus:outline-none transition-colors ${
                          errors.whatsapp ? "border-red-500/80 focus:border-red-500" : "border-border-custom/50 focus:border-signature"
                        }`}
                      />
                      {errors.whatsapp && (
                        <span id={`${whatsappId}-error`} className="text-[11px] text-red-400 font-medium" role="alert">{errors.whatsapp}</span>
                      )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor={emailId} className="text-xs font-mono font-medium text-text-secondary">
                        Email Address <span className="text-signature" aria-hidden="true">*</span>
                      </label>
                      <input
                        type="email"
                        id={emailId}
                        name="email"
                        placeholder="e.g. john@company.com"
                        value={form.email}
                        onChange={handleChange}
                        disabled={status === "loading"}
                        aria-invalid={errors.email ? "true" : "false"}
                        aria-describedby={errors.email ? `${emailId}-error` : undefined}
                        className={`w-full px-4 py-3 rounded-lg border bg-surface-base text-white text-sm focus:outline-none transition-colors ${
                          errors.email ? "border-red-500/80 focus:border-red-500" : "border-border-custom/50 focus:border-signature"
                        }`}
                      />
                      {errors.email && (
                        <span id={`${emailId}-error`} className="text-[11px] text-red-400 font-medium" role="alert">{errors.email}</span>
                      )}
                    </div>
                  </div>

                  {/* Row 3: Service Interested In and Business Type */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor={serviceId} className="text-xs font-mono font-medium text-text-secondary">
                        Service Interested In <span className="text-signature" aria-hidden="true">*</span>
                      </label>
                      <select
                        id={serviceId}
                        name="service"
                        value={form.service}
                        onChange={handleChange}
                        disabled={status === "loading"}
                        aria-invalid={errors.service ? "true" : "false"}
                        aria-describedby={errors.service ? `${serviceId}-error` : undefined}
                        className={`w-full px-4 py-3 rounded-lg border bg-surface-base text-white text-sm focus:outline-none transition-colors appearance-none ${
                          errors.service ? "border-red-500/80 focus:border-red-500" : "border-border-custom/50 focus:border-signature"
                        }`}
                      >
                        <option value="">-- Select Option --</option>
                        <option value="AI Chatbots">AI Chatbots</option>
                        <option value="WhatsApp Automation">WhatsApp Automation</option>
                        <option value="Voice Agents">Voice Agents</option>
                        <option value="Lead Qualification">Lead Qualification</option>
                        <option value="AI Customer Support">AI Customer Support</option>
                        <option value="Full Stack AI">Full Stack AI (Bundle)</option>
                      </select>
                      {errors.service && (
                        <span id={`${serviceId}-error`} className="text-[11px] text-red-400 font-medium" role="alert">{errors.service}</span>
                      )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor={businessTypeId} className="text-xs font-mono font-medium text-text-secondary">
                        Business Type <span className="text-text-tertiary/40">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        id={businessTypeId}
                        name="businessType"
                        placeholder="e.g. Dental Clinic, Agency, Coach"
                        value={form.businessType}
                        onChange={handleChange}
                        disabled={status === "loading"}
                        className="w-full px-4 py-3 rounded-lg border border-border-custom/50 bg-surface-base text-white text-sm focus:outline-none focus:border-signature transition-colors"
                      />
                    </div>
                  </div>

                  {/* Message Field */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor={messageId} className="text-xs font-mono font-medium text-text-secondary">
                      Message / Integration Requirements <span className="text-text-tertiary/40">(Optional)</span>
                    </label>
                    <textarea
                      id={messageId}
                      name="message"
                      rows={3}
                      placeholder="Explain your manual bottlenecks or project goals..."
                      value={form.message}
                      onChange={handleChange}
                      disabled={status === "loading"}
                      className="w-full px-4 py-3 rounded-lg border border-border-custom/50 bg-surface-base text-white text-sm focus:outline-none focus:border-signature transition-colors resize-none"
                    />
                  </div>

                  {/* WhatsApp Green Submit CTA Button */}
                  <div className="mt-2">
                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-whatsapp hover:bg-whatsapp/90 disabled:bg-whatsapp/50 text-black font-extrabold uppercase tracking-wider text-xs md:text-sm transition-all duration-300 hover:shadow-[0_0_20px_rgba(37,211,102,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-whatsapp cursor-pointer"
                    >
                      <MessageCircle size={16} />
                      <span>
                        {status === "loading" ? "Automating..." : BRAND_CONFIG.closingCTA.primaryBtn}
                      </span>
                    </button>
                  </div>

                </form>
              )}
            </CornerBorders>
          </div>

        </div>
      </div>
    </section>
  );
}
