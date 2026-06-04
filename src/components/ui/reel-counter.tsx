"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface ReelCounterProps {
  value: string; // e.g. "15" or "100"
  className?: string;
}

function DigitReel({ digit, inView }: { digit: number; inView: boolean }) {
  const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  return (
    <span className="relative h-[1.2em] overflow-hidden inline-flex w-[0.6em] justify-center items-center">
      <motion.span
        initial={{ y: 0 }}
        animate={inView ? { y: `-${digit * 10}%` } : { y: 0 }}
        transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-0 left-0 w-full flex flex-col justify-start items-center"
        style={{ height: "1000%" }}
      >
        {digits.map((num) => (
          <span
            key={num}
            className="flex items-center justify-center select-none"
            style={{ height: "10%", lineHeight: 1 }}
          >
            {num}
          </span>
        ))}
      </motion.span>
      {/* Invisible placeholder to establish height and width context */}
      <span className="opacity-0 pointer-events-none select-none" style={{ lineHeight: 1 }}>0</span>
    </span>
  );
}

export default function ReelCounter({ value, className = "" }: ReelCounterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, margin: "-50px" });

  const characters = value.split("");

  return (
    <div
      ref={containerRef}
      className={`inline-flex items-center font-mono font-bold leading-none ${className}`}
    >
      {characters.map((char, index) => {
        const isDigit = /\d/.test(char);
        if (isDigit) {
          return (
            <DigitReel
              key={index}
              digit={parseInt(char, 10)}
              inView={inView}
            />
          );
        }
        return (
          <span key={index} className="select-none" style={{ lineHeight: 1 }}>
            {char}
          </span>
        );
      })}
    </div>
  );
}
