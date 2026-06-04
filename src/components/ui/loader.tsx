"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Logo from "./logo";

interface LoaderProps {
  onComplete: () => void;
}

export default function Loader({ onComplete }: LoaderProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            onComplete();
          }, 500);
          return 100;
        }
        // Increment by a randomized value to feel "real-time" and premium
        const increment = Math.floor(Math.random() * 12) + 6;
        return Math.min(prev + increment, 100);
      });
    }, 60);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0, 
        y: -40,
        transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] as const } 
      }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black"
    >
      <div className="flex flex-col items-center gap-6 max-w-[280px] w-full px-4">
        {/* Animated Brand Wordmark */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Logo size="lg" />
        </motion.div>

        {/* Tagline / Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="text-[10px] tracking-[0.25em] text-text-tertiary uppercase font-mono text-center select-none"
        >
          Agents · Automations · AI Skills
        </motion.p>

        {/* Loading Progress Line */}
        <div className="relative w-full h-[1px] bg-border-custom/30 rounded-full mt-4">
          <motion.div
            className="absolute left-0 top-0 h-full bg-signature shadow-[0_0_8px_#8b7fff]"
            style={{ width: `${progress}%` }}
            transition={{ ease: "easeOut" }}
          />
          <div className="absolute right-0 top-2 text-[10px] text-signature font-mono font-bold select-none">
            {Math.floor(progress)}%
          </div>
        </div>
      </div>
    </motion.div>
  );
}
