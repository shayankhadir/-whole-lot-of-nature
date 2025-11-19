'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import DarkVeil from '@/components/ui/DarkVeil';
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient';

export default function ForestExperienceBanner() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['20%', '-20%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.6, 1, 0.6]);

  const statHighlights = [
    { label: 'Live species', value: '120+' },
    { label: 'Soil recipes', value: '45' },
    { label: 'Care guides', value: '300+' },
    { label: 'Live sessions', value: 'Weekly' },
  ];

  return (
    <section
      ref={ref}
      className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[var(--ink-900)] my-24 shadow-[0_40px_120px_rgba(2,8,5,0.6)]"
    >
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/backgrounds/bgleaf2.png"
          alt="Forest canopy pattern"
          fill
          priority
          className="object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--ink-900)]/90 via-[#06150d]/65 to-[#091f13]/80" />
        <DarkVeil
          hueShift={110}
          noiseIntensity={0.1}
          scanlineIntensity={0}
          speed={0.4}
          scanlineFrequency={0}
          warpAmount={0.15}
          resolutionScale={0.9}
        />
      </div>

      <motion.div
        style={{ opacity, y }}
        className="relative z-10 flex flex-col gap-10 px-6 py-12 text-center md:flex-row md:items-center md:justify-between md:text-left lg:px-16"
      >
        <div className="space-y-6 max-w-2xl mx-auto md:mx-0">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.3em] text-[var(--mint-100)] backdrop-blur-md"
          >
            <Sparkles className="h-4 w-4 text-[var(--emerald-500)]" />
            Immersive mode
          </motion.div>

          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="font-montserrat text-[clamp(2.2rem,4vw,3rem)] font-bold text-white leading-tight antialiased"
            >
              Explore the <span className="text-[var(--emerald-500)]">Virtual Forest</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-4 font-inter text-base sm:text-lg text-[var(--mint-100)] antialiased"
            >
              Dive into interactive plant stories, AR-ready specimens, and regenerative gardening lessons broadcast straight from our greenhouse lab.
            </motion.p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 md:justify-start">
            <Link href="/shop" className="inline-flex items-center">
              <HoverBorderGradient
                containerClassName="rounded-full"
                className="px-7 py-3 text-white font-montserrat font-semibold text-sm uppercase tracking-widest"
                glowColor="var(--emerald-500)"
              >
                Start exploring
              </HoverBorderGradient>
            </Link>
            <Link
              href="/about#experience"
              className="inline-flex items-center gap-3 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white/85 backdrop-blur"
            >
              Watch demo
              <span aria-hidden className="text-[#66BB6A]">→</span>
            </Link>
          </div>
        </div>

        <div className="grid w-full max-w-md grid-cols-2 gap-4 mx-auto md:mx-0">
          {statHighlights.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/15 bg-white/5 px-4 py-5 text-left backdrop-blur"
            >
              <p className="text-xs uppercase tracking-[0.4em] text-white/85">{stat.label}</p>
              <p className="mt-3 text-[clamp(1.5rem,3vw,2.25rem)] font-semibold text-white">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <motion.span
            key={i}
            className="absolute h-1 w-1 rounded-full bg-[#66BB6A]/50 backdrop-blur-md"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -80, 0],
              opacity: [0, 0.8, 0],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{
              duration: 6 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </section>
  );
}
