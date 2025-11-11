'use client';

import { motion } from 'framer-motion';
import { Leaf, ShieldCheck, Truck, Recycle, Sparkles } from 'lucide-react';

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
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary-50 via-white to-primary-100" />
      <div
        className="absolute inset-0 -z-10 opacity-[0.08]"
        style={{ backgroundImage: "url('/hero-leaves.svg')", backgroundSize: 'cover', backgroundPosition: 'center' }}
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="inline-flex items-center rounded-full border border-primary-200 bg-primary-50/50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-black">
            Why Choose Us
          </span>
          <h2 className="mt-6 text-4xl md:text-5xl font-serif font-bold tracking-tight text-black">
            Trusted by Plant Lovers
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base md:text-lg text-black">
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
              className="rounded-2xl border border-primary-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-black">
                <p.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-black">{p.title}</h3>
              <p className="mt-2 text-sm text-black">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
