'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import ComboProductsGrid from '@/components/shop/ComboProductsGrid';
import { sampleCombos, type ComboProduct } from '@/data/combos';

import type { Metadata } from 'next';

const metadata: Metadata = {
  title: 'Plant Combos & Bundles | Whole Lot of Nature',
  description: 'Discover curated plant combos and bundles. Save on complete gardening solutions with our expert-selected plant combinations and accessories.',
  openGraph: {
    title: 'Plant Combos & Bundles | Whole Lot of Nature',
    description: 'Discover curated plant combos and bundles. Save on complete gardening solutions with our expert-selected plant combinations and accessories.',
    images: ['https://wholelotofnature.com/images/og-image.jpg'],
    url: 'https://wholelotofnature.com/combos',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Plant Combos & Bundles | Whole Lot of Nature',
    description: 'Discover curated plant combos and bundles. Save on complete gardening solutions with our expert-selected plant combinations and accessories.',
    images: ['https://wholelotofnature.com/images/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://wholelotofnature.com/combos',
  },
};



export default function CombosPage() {
  const [cartItems, setCartItems] = useState<string[]>([]);
  const [wishlistItems, setWishlistItems] = useState<string[]>([]);

  const handleAddToCart = (combo: ComboProduct) => {
    setCartItems(prev => [...prev, combo.id]);
    // Here you would integrate with your cart state management
    console.log(`Added combo "${combo.name}" to cart`);
    
    // Show success notification (you can replace with toast notification)
    alert(`"${combo.name}" has been added to cart!`);
  };

  const handleAddToWishlist = (combo: ComboProduct) => {
    if (wishlistItems.includes(combo.id)) {
      setWishlistItems(prev => prev.filter(id => id !== combo.id));
      console.log(`Removed combo "${combo.name}" from wishlist`);
    } else {
      setWishlistItems(prev => [...prev, combo.id]);
      console.log(`Added combo "${combo.name}" to wishlist`);
      alert(`"${combo.name}" has been added to wishlist!`);
    }
  };

  const handleQuickView = (combo: ComboProduct) => {
    // Here you would open a modal with combo details
    console.log(`Quick view for combo "${combo.name}"`);
    alert(`Quick view for "${combo.name}" - This would open a detailed modal`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0d3512] via-[#0a2810] to-[#061208]">
      {/* Hero Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl font-bold text-white mb-6 antialiased">
              Plant Combo <span className="text-emerald-400">Deals</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto antialiased">
              Discover our curated plant bundles designed to save you money while creating beautiful, 
              thriving plant collections for your home and garden.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-emerald-400 mb-2 antialiased">25-40%</div>
                <div className="text-gray-300">Average Savings</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-emerald-400 mb-2 antialiased">50+</div>
                <div className="text-gray-300">Combo Options</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-emerald-400 mb-2 antialiased">95%</div>
                <div className="text-gray-300">Customer Satisfaction</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-center p-6"
            >
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl antialiased">•</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 antialiased">Save More Money</h3>
              <p className="text-gray-300">
                Get better value with our bundle deals. Save 25-40% compared to buying items individually.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center p-6"
            >
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl antialiased">•</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 antialiased">Expertly Curated</h3>
              <p className="text-gray-300">
                Each combo is carefully selected by our plant experts for compatibility and care requirements.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center p-6"
            >
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl antialiased">•</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 antialiased">Complete Solutions</h3>
              <p className="text-gray-300">
                Everything you need included - plants, pots, soil, fertilizers, and care guides.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Combos Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <ComboProductsGrid
            combos={sampleCombos}
            title="Choose Your Perfect Plant Combo"
            subtitle="Browse our collection of carefully curated plant bundles"
            onAddToCart={handleAddToCart}
            onAddToWishlist={handleAddToWishlist}
            onQuickView={handleQuickView}
          />
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-emerald-900/30">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-white mb-4 antialiased">
              Can&apos;t Find the Perfect Combo?
            </h2>
            <p className="text-xl text-gray-300 mb-8 antialiased">
              Contact our plant experts to create a custom combo tailored to your specific needs and space.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-emerald-500 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:bg-emerald-400 transition-all duration-200 antialiased"
            >
              Get Custom Combo
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}