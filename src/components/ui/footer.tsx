"use client";

import React from "react";
import Logo from "./logo";
import { BRAND_CONFIG } from "@/config/content";
import { Send } from "lucide-react";
import { scrollToElement } from "./smooth-scroll-provider";

export default function Footer() {
  const handleScrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    scrollToElement(href);
  };

  return (
    <footer className="w-full bg-surface-base border-t border-border-custom/30 py-12 md:py-20 px-6 md:px-12 relative overflow-hidden">
      {/* Background Subtle Gradient Glow */}
      <div 
        className="absolute -bottom-48 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-signature/10 blur-[120px] pointer-events-none select-none"
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 relative z-10">
        {/* Brand Section */}
        <div className="flex flex-col gap-4 md:col-span-2">
          <Logo size="md" />
          <p className="text-xs tracking-wider text-text-tertiary uppercase font-mono mt-1">
            {BRAND_CONFIG.categoryLine}
          </p>
          <p className="text-sm text-text-tertiary max-w-sm mt-3 leading-relaxed">
            {BRAND_CONFIG.positioning}
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-4">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Navigation</h4>
          <ul className="flex flex-col gap-2">
            <li>
              <a
                href="#about"
                onClick={(e) => handleScrollToSection(e, "#about")}
                className="text-sm text-text-tertiary hover:text-white transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-signature rounded"
              >
                About
              </a>
            </li>
            <li>
              <a
                href="#services"
                onClick={(e) => handleScrollToSection(e, "#services")}
                className="text-sm text-text-tertiary hover:text-white transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-signature rounded"
              >
                Services
              </a>
            </li>
            <li>
              <a
                href="#process"
                onClick={(e) => handleScrollToSection(e, "#process")}
                className="text-sm text-text-tertiary hover:text-white transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-signature rounded"
              >
                Process
              </a>
            </li>
            <li>
              <a
                href="#portfolio"
                onClick={(e) => handleScrollToSection(e, "#portfolio")}
                className="text-sm text-text-tertiary hover:text-white transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-signature rounded"
              >
                Clients
              </a>
            </li>
          </ul>
        </div>

        {/* Contact and Social Links */}
        <div className="flex flex-col gap-4">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Get in Touch</h4>
          <ul className="flex flex-col gap-3">
            <li>
              <a
                href={BRAND_CONFIG.contact.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-text-tertiary hover:text-whatsapp transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-signature rounded"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.003 5.324 5.328 0 11.859 0c3.166.001 6.141 1.236 8.378 3.479 2.237 2.242 3.469 5.214 3.473 8.38-.005 6.536-5.328 11.86-11.859 11.86-2.007-.001-3.98-.513-5.735-1.488L0 24zm6.59-4.846c1.6.95 3.18 1.448 4.71 1.449 5.33 0 9.67-4.34 9.67-9.671 0-2.585-1.005-5.01-2.83-6.837C16.32 2.271 13.89 1.264 11.3 1.264c-5.331 0-9.67 4.34-9.671 9.672 0 1.636.473 3.23 1.368 4.63l-.993 3.627 3.714-.974-.06-.035z" />
                </svg>
                <span>WhatsApp: {BRAND_CONFIG.contact.whatsapp}</span>
              </a>
            </li>
            <li>
              <a
                href={BRAND_CONFIG.contact.instagramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-text-tertiary hover:text-signature transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-signature rounded"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
                <span>Instagram: {BRAND_CONFIG.contact.instagram}</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright Notice */}
      <div className="max-w-6xl mx-auto mt-16 pt-8 border-t border-border-custom/20 text-center relative z-10">
        <p className="text-xs text-text-tertiary leading-relaxed">
          &copy; {new Date().getFullYear()} {BRAND_CONFIG.name}. All rights reserved. 
          <br className="md:hidden" /> Developed for premium autonomous scale.
        </p>
      </div>
    </footer>
  );
}
