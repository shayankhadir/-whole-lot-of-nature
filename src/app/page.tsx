'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useProducts } from '@/lib/hooks/useProducts';
import ProductGrid from '@/components/shop/ProductGrid';
import Button from '@/components/ui/Button';
import AnimatedText from '@/components/ui/AnimatedText';
import BlurText from '@/components/ui/BlurText';
import { CheckCircle } from 'lucide-react';
import CustomerTestimonialsSlider from '@/components/sections/CustomerTestimonialsSlider';
import Features from '@/components/sections/Features';
import Newsletter from '@/components/sections/Newsletter';
import FAQ from '@/components/sections/FAQ';
import FeaturedTiltCategories from '@/components/sections/FeaturedTiltCategories';
// Removed QuickActions per request
import InstagramEmbed from '@/components/sections/InstagramEmbed';
import YouTubeEmbed from '@/components/sections/YouTubeEmbed';
// Removed LeafBackground to avoid layering/visibility issues on some devices
// import LeafBackground from '@/components/ui/LeafBackground';
import Hero from '@/components/sections/Hero';
import LatestArticles from '@/components/sections/LatestArticles';
import BrandStorySection from '@/components/sections/BrandStorySection';
import WhyChooseUs from '@/components/sections/WhyChooseUs';
import ShopByNeed from '@/components/sections/ShopByNeed';
import FinalCTA from '@/components/sections/FinalCTA';

export default function Home() {
  const { data: products, isLoading, error } = useProducts();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen relative z-10 bg-white">
      {/* New interactive soil hero */}
      <Hero />

      {/* Brand Story + About Preview (below hero) */}
      <BrandStorySection />

  {/* Featured Products Section */}
  <div className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <BlurText
              text="Featured Products"
              delay={50}
              animateBy="words"
              direction="top"
              className="text-3xl font-bold tracking-tight text-black sm:text-4xl justify-center"
            />
            <p className="mt-4 text-lg text-black">
              Discover our most popular natural products
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="mt-12"
          >
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                <p className="mt-4 text-black">Loading products...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-primary-700">Error loading products. Please try again later.</p>
              </div>
            ) : products && Array.isArray(products) && products.length > 0 ? (
              <ProductGrid products={products.slice(0, 8)} />
            ) : (
              <div className="text-center py-12">
                <p className="text-black">No products available at the moment.</p>
              </div>
            )}
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <Link href="/shop">
              <Button size="lg" variant="outline">
                View All Products
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

  

  {/* Featured Categories Tilt Grid */}
  <FeaturedTiltCategories />

  {/* Why Choose Us */}
  <WhyChooseUs />

  {/* Shop by Need */}
  <ShopByNeed />

  {/* Best Sellers (removed: placeholder content). Consider replacing with dynamic Featured from WooCommerce. */}

  {/* Features Section (tighter spacing via internal adjustments later) */}
  <Features />

      {/* YouTube Video */}
      <YouTubeEmbed />

  {/* Customer Testimonials Slider */}
  <CustomerTestimonialsSlider />

  {/* Latest Articles */}
  <LatestArticles />

      {/* Newsletter Signup */}
      <Newsletter />

  {/* Quick Actions removed */}

  {/* FAQ Section */}
  <FAQ />

  {/* Final CTA */}
  <FinalCTA />
    </div>
  );
}