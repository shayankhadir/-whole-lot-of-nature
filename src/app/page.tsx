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
import SeamlessSection, { LeafDivider } from '@/components/ui/SeamlessSection';

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen relative z-10 bg-[#0A0A0A]">
      {/* Immersive Forest Hero with Parallax */}
      <HeroSection />

      {/* Featured Plants Carousel with Emerald Glow */}
      <SeamlessSection 
        bgColor="bg-[#0A0A0A]" 
        paddingY="lg"
        rightDecoration="fern"
      >
        <FeaturedPlantsCarousel />
      </SeamlessSection>

      <LeafDivider />

      {/* Immersive Forest Experience Banner - Parallax Section */}
      <ForestExperienceBanner />

      {/* Brand Story + About Preview */}
      <SeamlessSection 
        bgColor="bg-[#0F0F0F]" 
        paddingY="xl"
        leftDecoration="monstera"
      >
        <BrandStorySection />
      </SeamlessSection>

      <LeafDivider color="#66BB6A" />

      {/* Why Choose Us */}
      <SeamlessSection 
        bgColor="bg-[#0A0A0A]" 
        paddingY="lg"
        rightDecoration="monstera"
      >
        <WhyChooseUs />
      </SeamlessSection>

      {/* Features Section */}
      <SeamlessSection 
        bgColor="bg-[#0F0F0F]" 
        paddingY="md"
        leftDecoration="fern"
      >
        <Features />
      </SeamlessSection>

      <LeafDivider />

      {/* Customer Testimonials Slider */}
      <SeamlessSection 
        bgColor="bg-[#0A0A0A]" 
        paddingY="lg"
        rightDecoration="fern"
      >
        <CustomerTestimonialsSlider />
      </SeamlessSection>

      {/* Newsletter Signup */}
      <SeamlessSection 
        bgColor="bg-[#0F0F0F]" 
        paddingY="md"
        leftDecoration="monstera"
      >
        <Newsletter />
      </SeamlessSection>

      <LeafDivider color="#66BB6A" />

      {/* Final CTA */}
      <SeamlessSection 
        bgColor="bg-[#0A0A0A]" 
        paddingY="xl"
      >
        <FinalCTA />
      </SeamlessSection>
    </div>
  );
}