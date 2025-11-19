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
    <section className="relative py-20 overflow-hidden bg-emerald-950">
      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/backgrounds/seamless-tropical-canopy.svg"
          alt="Seamless tropical canopy"
          fill
          className="object-cover opacity-40"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-emerald-950/95 to-emerald-950/90" />
      </div>

      {/* Animated Background Effects */}
      <BackgroundParticles />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <FrostedGlassCard className="border-emerald-800/50 bg-emerald-900/30">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center text-cream-50 p-8"
          >
            <div className="flex justify-center mb-6">
              <div className="bg-emerald-800/30 backdrop-blur-sm p-4 rounded-full ring-1 ring-gold-500/30">
                <Mail className="w-8 h-8 text-gold-400" />
              </div>
            </div>
            
            <h2 className="text-[clamp(1.625rem,3vw,2.625rem)] font-serif font-bold mb-3">
              Join Our <span className="text-gold-gradient">Garden Community</span>
            </h2>
            <p className="text-base text-cream-200/80 mb-8 max-w-2xl mx-auto font-sans">
              Get weekly gardening tips, exclusive offers, and be the first to know about new arrivals. 
              Plus, get <span className="text-gold-400 font-bold">10% off</span> your next order!
            </p>

            {/* Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                viewport={{ once: true }}
                className="flex items-center justify-center space-x-2 text-cream-100"
              >
                <Leaf className="w-5 h-5 text-gold-400" />
                <span className="font-sans">Weekly Plant Care Tips</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="flex items-center justify-center space-x-2 text-cream-100"
              >
                <Gift className="w-5 h-5 text-gold-400" />
                <span className="font-sans">Exclusive Offers</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
                className="flex items-center justify-center space-x-2 text-cream-100"
              >
                <CheckCircle className="w-5 h-5 text-gold-400" />
                <span className="font-sans">New Arrivals First</span>
              </motion.div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="max-w-md mx-auto relative">
              <div className="relative flex items-center">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-6 py-4 bg-emerald-950/50 border border-emerald-700/50 rounded-full text-cream-50 placeholder:text-emerald-600/70 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500/50 transition-all font-sans"
                  required
                />
                <button
                  type="submit"
                  disabled={isLoading || isSubmitted}
                  className="absolute right-2 top-2 bottom-2 px-6 bg-gold-500 hover:bg-gold-400 text-emerald-950 font-bold rounded-full transition-all disabled:opacity-70 disabled:cursor-not-allowed font-sans"
                >
                  {isLoading ? 'Joining...' : isSubmitted ? 'Joined!' : 'Subscribe'}
                </button>
              </div>
              {isSubmitted && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -bottom-8 left-0 right-0 text-gold-400 text-sm font-medium font-sans"
                >
                  Welcome to the family! Check your inbox for your discount code.
                </motion.p>
              )}
            </form>
          </motion.div>
        </FrostedGlassCard>
      </div>
    </section>
  );
}