'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { Product } from '@/types/product';
import { getDisplayPrice } from '@/lib/utils/pricing';

interface BotanicalExplorerProps {
  products?: Product[];
}

export default function ImmersiveBotanicalExplorer({ products }: BotanicalExplorerProps) {
  const [selectedId, setSelectedId] = useState(0);
  const [featuredPlants, setFeaturedPlants] = useState<Product[]>([]);

  useEffect(() => {
    if (products && products.length > 0) {
      setFeaturedPlants(products.slice(0, 3));
    }
  }, [products]);

  const selectedPlant = featuredPlants[selectedId];

  if (!selectedPlant) {
    return null;
  }

  return (
    <section className="relative w-full max-w-7xl mx-auto my-20 rounded-[32px] overflow-hidden surface-forest border border-white/5 shadow-[0_40px_120px_rgba(2,8,5,0.6)] select-none">
      {/* Parallax Background Leaves */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 w-full h-full opacity-20"
          style={{ 
            backgroundImage: 'url(/images/backgrounds/bgleaf1.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        />
        
        {/* Animated Monstera SVG */}
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          className="absolute top-10 left-4 w-44 h-44"
          viewBox="0 0 200 150"
          fill="none"
          stroke="#2E7D32"
          strokeWidth="2"
          initial={{ rotate: 0, opacity: 0.2 }}
          animate={{ rotate: 360, opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        >
          <path d="M20 130 Q50 60 70 110 Q85 140 110 60 Q130 20 170 40 Q150 80 180 120" />
          <line x1="55" y1="110" x2="80" y2="40" />
          <line x1="95" y1="125" x2="110" y2="75" />
          <line x1="125" y1="130" x2="150" y2="70" />
        </motion.svg>

        {/* Animated Fern SVG */}
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          className="absolute bottom-10 right-8 w-36 h-52"
          viewBox="0 0 140 200"
          fill="none"
          stroke="#66BB6A"
          strokeWidth="1.5"
          initial={{ rotate: 0, opacity: 0.15 }}
          animate={{ rotate: -360, opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
        >
          <path d="M70 190 L70 10" />
          <path d="M70 180 L40 150 M70 180 L100 150" />
          <path d="M70 160 L30 120 M70 160 L110 120" />
          <path d="M70 140 L35 95 M70 140 L105 95" />
          <path d="M70 120 L50 70 M70 120 L90 70" />
        </motion.svg>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 relative z-10">
        {/* Info Panel */}
        <motion.div
          key={selectedPlant.id}
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.6 }}
          className="md:col-span-6 relative bg-[rgba(4,16,10,0.75)] backdrop-blur-xl p-10 sm:p-12 flex flex-col justify-center border-r border-white/5 overflow-hidden"
        >
          <div className="absolute inset-0 pointer-events-none opacity-70 bg-[radial-gradient(circle_at_top_left,rgba(47,182,126,0.25),transparent_60%)]" aria-hidden />
          {/* Category Badge */}
          {selectedPlant.categories && selectedPlant.categories[0] && (
            <span className="inline-block px-4 py-1 mb-4 text-xs font-semibold uppercase tracking-widest text-[#66BB6A] border border-[#66BB6A]/30 rounded-full w-fit">
              {selectedPlant.categories[0].name}
            </span>
          )}

          <h2 className="font-montserrat text-[clamp(2.5rem,5vw,2.5rem)] font-extrabold text-white leading-tight mb-6">
            {selectedPlant.name}
          </h2>
          
          <div
            className="font-inter text-lg text-white/85 mb-6 max-w-xl line-clamp-3 antialiased"
            dangerouslySetInnerHTML={{ 
              __html: selectedPlant.short_description || selectedPlant.description 
            }}
          />
          
          <span className="font-montserrat text-[clamp(2rem,4vw,2.625rem)] font-bold text-white mb-8 antialiased">
            {getDisplayPrice(selectedPlant)}
          </span>
          
          <div className="flex gap-4">
            <button className="inline-flex items-center gap-3 px-10 py-4 rounded-full font-semibold bg-[var(--emerald-500)] text-white shadow-[0_20px_40px_rgba(6,38,24,0.45)] hover:bg-[var(--emerald-700)] transition-all duration-300 hover:shadow-[0_25px_50px_rgba(6,38,24,0.55)]">
              <ShoppingCart className="w-5 h-5" />
              Add to Cart
            </button>
            <a 
              href={`/shop/${selectedPlant.slug}`}
              className="inline-flex items-center gap-3 px-10 py-4 rounded-full font-semibold text-white/90 border border-white/30 hover:border-[var(--emerald-500)] hover:bg-[rgba(47,182,126,0.12)] transition-all duration-300 backdrop-blur-md"
            >
              View Details
            </a>
          </div>
        </motion.div>

        {/* Image Gallery */}
        <div className="md:col-span-6 flex items-center justify-center relative py-12 md:py-0">
          <motion.div
            key={selectedPlant.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.6 }}
            className="relative w-full max-w-[420px] aspect-[4/5] rounded-[28px] border border-white/10 bg-[rgba(3,12,8,0.7)] shadow-[0_30px_80px_rgba(2,8,5,0.7)] overflow-hidden"
          >
            {selectedPlant.images && selectedPlant.images[0] ? (
              <Image
                src={selectedPlant.images[0].src}
                alt={selectedPlant.images[0].alt || selectedPlant.name}
                priority
                fill
                sizes="(min-width: 768px) 420px, 80vw"
                className="object-contain p-8"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-white/85">
                <span>No image available</span>
              </div>
            )}
          </motion.div>

          {/* Navigation Dots */}
          <div className="absolute bottom-8 flex space-x-3">
            {featuredPlants.map((plant, idx) => (
              <button
                key={plant.id}
                onClick={() => setSelectedId(idx)}
                aria-label={`View details for ${plant.name}`}
                className={`w-4 h-4 rounded-full border border-white/40 transition-all duration-300
                  ${idx === selectedId ? 'bg-[var(--emerald-500)] shadow-[0_0_0_4px_rgba(47,182,126,0.25)] scale-110' : 'bg-transparent hover:bg-white/20'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
