'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { Product } from '@/types/product';

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
    <section className="relative w-full max-w-7xl mx-auto my-20 rounded-xl overflow-hidden bg-[#1A1A1A] shadow-2xl select-none">
      {/* Parallax Background Leaves */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 w-full h-full opacity-20"
          style={{ 
            backgroundImage: 'url(https://admin.wholelotofnature.com/wp-content/uploads/2024/11/bgleaf1.png)',
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
          className="md:col-span-6 bg-[#2E7D32] bg-opacity-20 backdrop-blur-sm p-12 flex flex-col justify-center"
        >
          {/* Category Badge */}
          {selectedPlant.categories && selectedPlant.categories[0] && (
            <span className="inline-block px-4 py-1 mb-4 text-xs font-semibold uppercase tracking-widest text-[#66BB6A] border border-[#66BB6A]/30 rounded-full w-fit">
              {selectedPlant.categories[0].name}
            </span>
          )}

          <h2 className="font-montserrat text-[clamp(2.5rem,5vw,3.5rem)] font-extrabold text-white leading-tight mb-6">
            {selectedPlant.name}
          </h2>
          
          <div 
            className="font-inter text-lg text-gray-100 mb-6 max-w-xl line-clamp-3 antialiased"
            dangerouslySetInnerHTML={{ 
              __html: selectedPlant.short_description || selectedPlant.description 
            }}
          />
          
          <span className="font-montserrat text-[clamp(2rem,4vw,2.625rem)] font-bold text-white mb-8 antialiased">
            ${selectedPlant.price}
          </span>
          
          <div className="flex gap-4">
            <button className="inline-flex items-center gap-3 px-10 py-4 bg-white text-[#2E7D32] rounded-lg font-semibold hover:bg-[#66BB6A] hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl">
              <ShoppingCart className="w-5 h-5" />
              Add to Cart
            </button>
            <a 
              href={`/shop/${selectedPlant.slug}`}
              className="inline-flex items-center gap-3 px-10 py-4 bg-transparent text-white rounded-lg font-semibold border-2 border-white/30 hover:border-[#66BB6A] hover:bg-white/10 transition-all duration-300 backdrop-blur-md"
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
            className="max-w-[400px] max-h-[500px] relative drop-shadow-2xl rounded-xl overflow-hidden"
          >
            {selectedPlant.images && selectedPlant.images[0] ? (
              <Image
                src={selectedPlant.images[0].src}
                alt={selectedPlant.images[0].alt || selectedPlant.name}
                priority
                width={400}
                height={500}
                className="object-contain rounded-xl bg-white/5 backdrop-blur-sm"
              />
            ) : (
              <div className="w-[400px] h-[500px] bg-white/5 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <span className="text-white/50">No image available</span>
              </div>
            )}
          </motion.div>

          {/* Navigation Dots */}
          <div className="absolute bottom-10 flex space-x-4">
            {featuredPlants.map((plant, idx) => (
              <button
                key={plant.id}
                onClick={() => setSelectedId(idx)}
                aria-label={`View details for ${plant.name}`}
                className={`w-5 h-5 rounded-full border-2 border-white transition-all duration-300
                  ${idx === selectedId ? 'bg-white scale-110' : 'bg-transparent hover:bg-white/50'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
