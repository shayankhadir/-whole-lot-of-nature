'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function NewsletterPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasSeen, setHasSeen] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const popupRef = useRef<HTMLDivElement>(null);

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

    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [hasSeen, isVisible]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => setIsVisible(false), 2000);
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9998] bg-black/30 backdrop-blur-sm pointer-events-none"
          />
          
          {/* Newsletter Popup */}
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-4 right-4 z-[99999] w-full max-w-lg p-4 md:bottom-8 md:right-8 pointer-events-auto"
          >
            <div ref={popupRef} className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0d3512] to-[#12501a] border border-[#2E7D32]/50 shadow-2xl">
              {/* Close Button */}
              <button
                onClick={() => setIsVisible(false)}
                aria-label="Close newsletter popup"
                className="absolute right-4 top-4 text-[#daf2d0]/60 hover:text-[#daf2d0] transition-colors z-20"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>

              {/* Main Content */}
              <div className="relative p-8 md:p-10">
                {/* Background Effects */}
                <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#2E7D32]/20 blur-3xl pointer-events-none" />
                <div className="absolute -left-20 -bottom-20 h-48 w-48 rounded-full bg-[#66BB6A]/10 blur-3xl pointer-events-none" />

                {/* Content */}
                <div className="relative z-10">
                  {/* Badge */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-4 inline-flex items-center rounded-full border border-[#66BB6A]/50 bg-[#66BB6A]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-[#66BB6A]"
                  >
                    🌱 Exclusive Offer
                  </motion.div>

                  {/* Heading */}
                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="mt-4 text-3xl font-serif font-bold text-[#daf2d0] leading-tight"
                  >
                    Join the Green Community
                  </motion.h3>

                  {/* Description */}
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-3 text-base text-[#E8F5E9]/80"
                  >
                    Get expert gardening tips, early access to new arrivals, and an exclusive 10% off your first order.
                  </motion.p>

                  {/* Benefits */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="mt-6 space-y-2.5"
                  >
                    {[
                      'Expert gardening tips & guides',
                      'Early access to new plants',
                      '10% off your first order'
                    ].map((benefit, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircleIcon className="h-5 w-5 text-[#66BB6A] flex-shrink-0" />
                        <span className="text-sm text-[#daf2d0]">{benefit}</span>
                      </div>
                    ))}
                  </motion.div>

                  {/* Form */}
                  {status === 'success' ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="mt-7 flex items-center justify-center rounded-xl bg-[#66BB6A]/15 border border-[#66BB6A]/30 p-6"
                    >
                      <div className="text-center">
                        <div className="mb-2 flex justify-center">
                          <CheckCircleIcon className="h-8 w-8 text-[#66BB6A]" />
                        </div>
                        <p className="font-semibold text-[#66BB6A]">Welcome to the family! 🌿</p>
                        <p className="mt-1 text-sm text-[#daf2d0]/70">Check your email for your 10% discount code.</p>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.form
                      onSubmit={handleSubmit}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="mt-7 space-y-3.5"
                    >
                      <div>
                        <label htmlFor="newsletter-email" className="sr-only">Email address</label>
                        <input
                          type="email"
                          id="newsletter-email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your@email.com"
                          className="w-full rounded-xl border border-[#2E7D32]/50 bg-white/5 px-4 py-3.5 text-white placeholder-white/40 font-inter focus:border-[#66BB6A] focus:outline-none focus:ring-2 focus:ring-[#66BB6A]/20 transition-all"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="w-full rounded-xl bg-gradient-to-r from-[#66BB6A] to-[#2E7D32] px-6 py-3.5 font-semibold text-white hover:from-[#76cc7a] hover:to-[#3e8d42] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:shadow-[#66BB6A]/20"
                      >
                        {status === 'loading' ? 'Subscribing...' : 'Get My 10% Off'}
                      </button>
                    </motion.form>
                  )}

                  {/* Footer Text */}
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.35 }}
                    className="mt-5 text-center text-xs text-[#daf2d0]/50"
                  >
                    No spam, just green vibes. Unsubscribe anytime.
                  </motion.p>
                </div>
              </div>

              {/* Decorative Border */}
              <div className="absolute inset-0 rounded-3xl border border-[#66BB6A]/20 pointer-events-none" />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
