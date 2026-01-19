"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function TopBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const messages = [
    "Free Delivery on all orders above ₹999",
    "Use code SAVE6 for 6% OFF on your plant haul",
    "Get 10% OFF on orders above ₹1699 — grow more, save more!",
    "Join the Whole Lot of Nature Family — earn loyalty points with every purchase!",
    "100% Organic, Handcrafted Soil Mixes & Plants",
  ];

  useEffect(() => {
    if (!isVisible) return;
    if (paused) {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      intervalRef.current = null;
      return;
    }
    intervalRef.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % messages.length);
    }, 3500);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [isVisible, paused, messages.length]);

  if (!isVisible) return null;

  return (
    <div
      className="sticky top-0 z-50 bg-gradient-to-r from-[#1e3a28] via-[#2d5a3d] to-[#1e3a28] text-white py-2.5 px-12 text-center relative border-b border-[#2E7D32]/30 backdrop-blur-sm shadow-sm select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="flex items-center justify-center text-sm font-medium min-h-[20px] overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={index}
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -12, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="whitespace-nowrap text-white drop-shadow-sm"
          >
            {messages[index]}
          </motion.div>
        </AnimatePresence>
      </div>

      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 hover:bg-white/10 rounded p-1 transition-colors backdrop-blur-md"
        aria-label="Close banner"
      >
        <X className="w-4 h-4 text-white" />
      </button>
    </div>
  );
}