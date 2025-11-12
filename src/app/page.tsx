'use client';

import { useEffect, useState } from 'react';
import HeroSection from '@/components/home/HeroSection';
import FeaturedPlantsCarousel from '@/components/home/FeaturedPlantsCarousel';
import ForestExperienceBanner from '@/components/home/ForestExperienceBanner';
import CustomerTestimonialsSlider from '@/components/sections/CustomerTestimonialsSlider';
import Features from '@/components/sections/Features';
import Newsletter from '@/components/sections/Newsletter';
import BrandStorySection from '@/components/sections/BrandStorySection';
import WhyChooseUs from '@/components/sections/WhyChooseUs';
import FinalCTA from '@/components/sections/FinalCTA';

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen relative z-10 bg-[#1A1A1A]">
      {/* Immersive Forest Hero with Parallax */}
      <HeroSection />

      {/* Featured Plants Carousel with Emerald Glow */}
      <FeaturedPlantsCarousel />

      {/* Immersive Forest Experience Banner - Parallax Section */}
      <ForestExperienceBanner />

      {/* Brand Story + About Preview */}
      <BrandStorySection />

      {/* Why Choose Us */}
      <WhyChooseUs />

      {/* Features Section */}
      <Features />

      {/* Customer Testimonials Slider */}
      <CustomerTestimonialsSlider />

      {/* Newsletter Signup */}
      <Newsletter />

      {/* Final CTA */}
      <FinalCTA />
    </div>
  );
}