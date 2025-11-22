'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Leaf } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative flex flex-col justify-center items-center min-h-screen w-full overflow-hidden">
      {/* Static Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/backgrounds/bgleaf1.png"
          alt="Dense forest leaves background"
          fill
          className="object-cover object-center"
          style={{ filter: 'brightness(0.2)' }}
          priority
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#010a05]/98 via-[#041107]/94 to-[#010a05]/98" />
      </div>

      {/* Content */}
      <div className="relative z-20 container mx-auto px-6 text-center">
        <h1 className="text-[clamp(1.5rem,12vw,2.5rem)] font-header font-bold text-white leading-none mb-8 antialiased">
          BRING THE<br />
          FOREST HOME
        </h1>
        
        <p className="text-[clamp(1rem,2.5vw,1.5rem)] text-[#66BB6A] max-w-3xl mx-auto mb-12 font-body antialiased">
          Discover premium plants, organic soil mixes, and sustainable gardening essentials
        </p>

        {/* CTA Card */}
        <div className="glass forest-card-lg max-w-md mx-auto p-8 border border-[#2E7D32]/30">
          <h3 className="text-[clamp(1.75rem,4.5vw,2.625rem)] font-header font-semibold text-white mb-6">
            Explore Our Collection
          </h3>
          
          <Link
            href="/shop"
            className="group inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white px-8 py-4 rounded-lg hover:from-emerald-400 hover:to-green-500 transition-all duration-300 emerald-glow text-lg font-medium antialiased shadow-lg"
          >
            <span>Shop Now</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Floating Leaf Decoration */}
      <div className="absolute bottom-32 right-16 text-[#2E7D32] opacity-20 pointer-events-none hidden lg:block">
        <Leaf className="w-32 h-32" strokeWidth={1} />
      </div>
    </section>
  );
}
