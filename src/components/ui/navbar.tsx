"use client";

import React, { useState, useEffect } from "react";
import Logo from "./logo";
import { BRAND_CONFIG } from "@/config/content";
import { Menu, X } from "lucide-react";
import { scrollToElement } from "./smooth-scroll-provider";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "About", href: "#about" },
    { name: "Services", href: "#services" },
    { name: "Process", href: "#process" },
    { name: "Clients", href: "#portfolio" },
    { name: "FAQ", href: "#faq" },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    scrollToElement(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full px-4 pt-4 md:px-8 md:pt-6 transition-all duration-300 pointer-events-none">
      <nav 
        className={`mx-auto max-w-5xl flex items-center justify-between px-6 py-3 rounded-full transition-all duration-500 pointer-events-auto glass-panel ${
          isScrolled 
            ? "shadow-[0_12px_40px_rgba(0,0,0,0.8)] border-border-custom/80 bg-surface-raised/90" 
            : "border-border-custom/30 bg-surface-base/40"
        }`}
      >
        {/* Left Side: Logo */}
        <a 
          href="#" 
          aria-label="AI Buddies Home" 
          onClick={(e) => handleLinkClick(e, "#")}
          className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signature rounded-lg"
        >
          <Logo size="sm" />
        </a>

        {/* Center: Desktop Navigation Links */}
        <ul className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <li key={link.name}>
              <a
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="text-sm font-medium text-text-tertiary transition-colors duration-200 hover:text-white relative py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signature rounded-md px-2"
              >
                {link.name}
              </a>
            </li>
          ))}
        </ul>

        {/* Right Side: CTA Button */}
        <div className="hidden md:block">
          <a
            href="#contact"
            onClick={(e) => handleLinkClick(e, "#contact")}
            className="inline-flex items-center justify-center px-5 py-2 text-xs font-semibold uppercase tracking-wider rounded-full bg-signature text-black border border-signature/80 hover:bg-transparent hover:text-white transition-all duration-300 hover:shadow-[0_0_15px_rgba(43,160,220,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signature"
          >
            {BRAND_CONFIG.closingCTA.primaryBtn}
          </a>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          type="button"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-text-tertiary hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signature rounded-full"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile Nav Overlay Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-4 right-4 mt-2 p-6 rounded-3xl border border-border-custom bg-surface-raised/95 backdrop-blur-xl shadow-2xl pointer-events-auto md:hidden animate-in fade-in slide-in-from-top-4 duration-300">
          <ul className="flex flex-col gap-4 text-center">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className="block py-2 text-base font-medium text-text-tertiary transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signature rounded-md"
                >
                  {link.name}
                </a>
              </li>
            ))}
            <li className="mt-4 pt-4 border-t border-border-custom/50">
              <a
                href="#contact"
                onClick={(e) => handleLinkClick(e, "#contact")}
                className="block w-full py-3 text-center text-sm font-semibold uppercase tracking-wider rounded-full bg-signature text-black hover:bg-transparent hover:text-white border border-signature hover:border-white transition-all duration-300"
              >
                {BRAND_CONFIG.closingCTA.primaryBtn}
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
