'use client';

import { X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PromoBannerProps {
  message?: string;
  backgroundColor?: string;
  textColor?: string;
  dismissible?: boolean;
  link?: string;
}

export default function PromoBanner({
  message = "🎉 SPECIAL OFFER: Get 6% OFF + Free Gift on orders above ₹250! Use code: SAVE06",
  backgroundColor = "#2E7D32",
  textColor = "#FFFFFF",
  dismissible = true,
  link,
}: PromoBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const content = (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full overflow-hidden"
      style={{ backgroundColor }}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 text-center">
            <p className="text-sm md:text-base font-semibold" style={{ color: textColor }}>
              {message}
            </p>
          </div>
          
          {dismissible && (
            <button
              onClick={() => setIsVisible(false)}
              className="flex-shrink-0 p-1 rounded-full hover:bg-white/20 transition-colors"
              aria-label="Dismiss banner"
              style={{ color: textColor }}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );

  if (link) {
    return (
      <AnimatePresence>
        <a href={link} className="block">
          {content}
        </a>
      </AnimatePresence>
    );
  }

  return <AnimatePresence>{content}</AnimatePresence>;
}
