'use client';

import { motion } from 'framer-motion';
import { Leaf, ShieldCheck, Truck, Recycle, Sparkles } from 'lucide-react';
import SpotlightCard from '@/components/ui/SpotlightCard';
import { BackgroundGrid } from '@/components/ui/BackgroundEffects';

const points = [
  {
    title: 'Organic & Safe',
    desc: 'Premium, chemical-free mixes and fertilizers for healthy growth.',
    icon: Leaf,
  },
  {
    title: 'Strong Packaging',
    desc: 'Plants and products arrive fresh with eco-friendly protection.',
    icon: ShieldCheck,
  },
  {
    title: 'Fast Pan-India Delivery',
    desc: 'Reliable shipping with proactive updates and support.',
    icon: Truck,
  },
  {
    title: 'Sustainable Practices',
    desc: 'Responsible sourcing, recyclable materials, and mindful ops.',
    icon: Recycle,
  },
  {
    title: 'Expert Support',
    desc: 'Guidance from our horticulture team via chat and email.',
    icon: Sparkles,
  },
];

export default function WhyChooseUs() {
  return (
    <section className="relative py-16">
      {/* Background Grid */}
      <BackgroundGrid />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="inline-flex items-center rounded-full border border-[#2E7D32]/30 bg-[#2E7D32]/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[#66BB6A] backdrop-blur-md">
            Why Choose Us
          </span>
          <h2 className="mt-6 text-[clamp(2.5rem,5vw,2.5rem)] font-montserrat font-bold tracking-tight text-white antialiased">
            Trusted by Plant Lovers
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base md:text-lg text-white/70 antialiased">
            We blend science, sustainability, and design to elevate your green journey.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {points.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
              viewport={{ once: true }}
            >
              <SpotlightCard className="h-full">
                <div className="p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#2E7D32]/20 text-[#66BB6A] backdrop-blur-md">
                    <p.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-white antialiased">{p.title}</h3>
                  <p className="mt-2 text-sm text-white/70">{p.desc}</p>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
