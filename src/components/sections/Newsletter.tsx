'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Mail, CheckCircle, Leaf, Gift } from 'lucide-react';
import { FrostedGlassCard } from '@/components/ui/GlassCard';
import { BackgroundParticles } from '@/components/ui/BackgroundEffects';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitted(true);
      setIsLoading(false);
      setEmail('');
    }, 1000);
  };

  return (
    <section className="relative py-12 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/backgrounds/bgleaf2.png"
          alt="Decorative leaf background"
          fill
          className="object-cover opacity-20"
          quality={75}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#010a05]/98 via-[#020f07]/94 to-[#010a05]/98" />
      </div>

      {/* Animated Background Effects */}
      <BackgroundParticles />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <FrostedGlassCard>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center text-white p-8"
          >
            <div className="flex justify-center mb-6">
              <div className="bg-emerald-500/30 backdrop-blur-sm p-4 rounded-full ring-1 ring-emerald-400/50">
                <Mail className="w-8 h-8 text-emerald-400" />
              </div>
            </div>
            
            <h2 className="text-[clamp(1.625rem,3vw,2.625rem)] font-montserrat font-bold mb-3 antialiased text-cream-50">
              Join Our Garden Community
            </h2>
            <p className="text-base text-cream-100 mb-6 max-w-2xl mx-auto antialiased">
              Get weekly gardening tips, exclusive offers, and be the first to know about new arrivals. 
              Plus, get 10% off your next order!
            </p>

            {/* Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                viewport={{ once: true }}
                className="flex items-center justify-center space-x-2 text-cream-100"
              >
                <Leaf className="w-5 h-5 text-emerald-400" />
                <span>Weekly Plant Care Tips</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="flex items-center justify-center space-x-2 text-cream-100"
              >
                <Gift className="w-5 h-5 text-emerald-400" />
                <span>Exclusive Offers</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
                className="flex items-center justify-center space-x-2 text-cream-100"
              >
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span>New Arrivals First</span>
              </motion.div>
            </div>

            {/* Newsletter form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
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
                  <p className="text-white/85">
                    You've successfully joined our garden community. Check your email for a welcome gift!
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3">
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
                      className="px-6 py-3 bg-[#2E7D32] text-white font-semibold rounded-lg hover:bg-[#66BB6A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                      {isLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Joining...</span>
                        </div>
                      ) : (
                        'Join Now & Save 10%'
                      )}
                    </button>
                  </div>
                  <p className="text-sm text-white/85">
                    We respect your privacy. Unsubscribe at any time.
                  </p>
                </form>
              )}
            </motion.div>
          </motion.div>
        </FrostedGlassCard>
      </div>
    </section>
  );
}