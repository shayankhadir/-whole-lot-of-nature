'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function NewsletterPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasSeen, setHasSeen] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  useEffect(() => {
    const handleScroll = () => {
      if (hasSeen) return;

      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      const percentage = (scrolled / scrollHeight) * 100;

      if (percentage > 60) {
        setIsVisible(true);
        setHasSeen(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasSeen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => setIsVisible(false), 2000);
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.9 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-4 right-4 z-50 w-full max-w-md p-4 md:bottom-8 md:right-8"
        >
          <div className="relative overflow-hidden rounded-2xl border border-[#2E7D32]/30 bg-[#0A0A0A]/90 p-6 backdrop-blur-xl shadow-2xl">
            {/* Close Button */}
            <button
              onClick={() => setIsVisible(false)}
              className="absolute right-4 top-4 text-white/40 hover:text-white transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>

            {/* Content */}
            <div className="relative z-10">
              <div className="mb-2 inline-flex items-center rounded-full border border-[#2E7D32]/30 bg-[#2E7D32]/10 px-3 py-1 text-xs font-medium text-[#4ADE80]">
                🌱 Join the Community
              </div>
              
              <h3 className="mt-3 text-xl font-bold text-white">
                Get 10% Off Your First Order
              </h3>
              <p className="mt-2 text-sm text-white/70">
                Subscribe to our newsletter for expert gardening tips, new arrivals, and exclusive offers.
              </p>

              {status === 'success' ? (
                <div className="mt-6 flex items-center justify-center rounded-lg bg-[#2E7D32]/20 p-4 text-[#4ADE80]">
                  <span className="font-medium">Welcome to the family! 🌿</span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-6 space-y-3">
                  <div>
                    <label htmlFor="email" className="sr-only">Email address</label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:border-[#2E7D32] focus:outline-none focus:ring-1 focus:ring-[#2E7D32] transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full rounded-lg bg-[#2E7D32] px-4 py-3 font-semibold text-white hover:bg-[#1B5E20] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === 'loading' ? 'Signing up...' : 'Unlock My 10% Off'}
                  </button>
                </form>
              )}
              
              <p className="mt-4 text-center text-xs text-white/30">
                No spam, just green vibes. Unsubscribe anytime.
              </p>
            </div>

            {/* Background Effects */}
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#2E7D32]/20 blur-3xl" />
            <div className="absolute -left-10 -bottom-10 h-32 w-32 rounded-full bg-[#66BB6A]/10 blur-3xl" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
