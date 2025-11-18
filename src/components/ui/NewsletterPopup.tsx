'use client';

import { useState, useEffect, Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, CheckCircle, Leaf, Gift, X } from 'lucide-react';
import { Dialog, Transition } from '@headlessui/react';

export default function NewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user has already seen or dismissed the popup
    const popupDismissed = localStorage.getItem('newsletter-popup-dismissed');
    const popupSubmitted = localStorage.getItem('newsletter-popup-submitted');
    
    if (popupDismissed === 'true' || popupSubmitted === 'true') {
      return;
    }

    const handleScroll = () => {
      if (hasShown) return;

      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;

      if (scrollPercent >= 60) {
        setIsOpen(true);
        setHasShown(true);
        window.removeEventListener('scroll', handleScroll);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasShown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitted(true);
      setIsLoading(false);
      setEmail('');
      localStorage.setItem('newsletter-popup-submitted', 'true');
      
      // Auto-close after 3 seconds on successful submission
      setTimeout(() => {
        setIsOpen(false);
      }, 3000);
    }, 1000);
  };

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('newsletter-popup-dismissed', 'true');
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[200]" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="relative w-full max-w-2xl transform overflow-hidden rounded-2xl bg-gradient-to-br from-[#0a1c0f]/98 to-[#030a06]/98 border border-[#2E7D32]/30 backdrop-blur-xl shadow-2xl transition-all">
                {/* Close button */}
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors z-10"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="p-8 md:p-12">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center text-white"
                  >
                    <div className="flex justify-center mb-6">
                      <div className="bg-[#2E7D32]/30 backdrop-blur-sm p-4 rounded-full ring-1 ring-[#2E7D32]/50">
                        <Mail className="w-8 h-8 text-[#66BB6A]" />
                      </div>
                    </div>
                    
                    <h2 className="text-[clamp(1.5rem,3vw,2.25rem)] font-montserrat font-bold mb-3 antialiased text-[#66BB6A]">
                      Join Our Garden Community
                    </h2>
                    <p className="text-base text-white/70 mb-6 max-w-xl mx-auto antialiased">
                      Get weekly gardening tips, exclusive offers, and be the first to know about new arrivals. 
                      Plus, get 10% off your next order!
                    </p>

                    {/* Benefits */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="flex items-center justify-center space-x-2 text-white/80 text-sm"
                      >
                        <Leaf className="w-5 h-5 text-[#66BB6A]" />
                        <span>Weekly Plant Care Tips</span>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex items-center justify-center space-x-2 text-white/80 text-sm"
                      >
                        <Gift className="w-5 h-5 text-[#66BB6A]" />
                        <span>Exclusive Offers</span>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex items-center justify-center space-x-2 text-white/80 text-sm"
                      >
                        <CheckCircle className="w-5 h-5 text-[#66BB6A]" />
                        <span>New Arrivals First</span>
                      </motion.div>
                    </div>

                    {/* Newsletter form */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      className="max-w-md mx-auto"
                    >
                      {isSubmitted ? (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-[#2E7D32]/20 backdrop-blur-sm rounded-lg p-6 ring-1 ring-[#2E7D32]/30"
                        >
                          <CheckCircle className="w-12 h-12 text-[#66BB6A] mx-auto mb-4" />
                          <h3 className="text-xl font-semibold mb-2 antialiased">Thank You!</h3>
                          <p className="text-white/70 text-sm">
                            You've successfully joined our garden community. Check your email for a welcome gift!
                          </p>
                        </motion.div>
                      ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                          <div className="flex flex-col gap-3">
                            <div className="flex-1">
                              <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email address"
                                className="w-full px-4 py-3 rounded-lg text-white bg-white/10 backdrop-blur-sm border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#66BB6A]/50 placeholder-white/50"
                                required
                              />
                            </div>
                            <button
                              type="submit"
                              disabled={isLoading}
                              className="w-full px-6 py-3 bg-[#2E7D32] text-white font-semibold rounded-lg hover:bg-[#66BB6A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isLoading ? (
                                <div className="flex items-center justify-center space-x-2">
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                  <span>Joining...</span>
                                </div>
                              ) : (
                                'Join Now & Save 10%'
                              )}
                            </button>
                          </div>
                          <p className="text-xs text-white/60">
                            We respect your privacy. Unsubscribe at any time.
                          </p>
                        </form>
                      )}
                    </motion.div>
                  </motion.div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
