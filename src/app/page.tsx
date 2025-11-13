'use client';

import { useEffect, useState } from 'react';
import HeroSection from '@/components/home/HeroSection';
import FeaturedPlantsCarousel from '@/components/home/FeaturedPlantsCarousel';
import ForestExperienceBanner from '@/components/home/ForestExperienceBanner';
import ImmersiveBotanicalExplorer from '@/components/home/ImmersiveBotanicalExplorer';
import CustomerTestimonialsSlider from '@/components/sections/CustomerTestimonialsSlider';
import Features from '@/components/sections/Features';
import Newsletter from '@/components/sections/Newsletter';
import BrandStorySection from '@/components/sections/BrandStorySection';
import WhyChooseUs from '@/components/sections/WhyChooseUs';
import FinalCTA from '@/components/sections/FinalCTA';
import SeamlessSection, { LeafDivider } from '@/components/ui/SeamlessSection';
import { Product } from '@/types/product';

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    setIsVisible(true);
    
    // Fetch featured products for botanical explorer
    fetch('/api/products?limit=3')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setFeaturedProducts(data.data);
        }
      })
      .catch(err => console.error('Failed to fetch featured products:', err));
  }, []);

  return (
    <div className="min-h-screen relative z-10 bg-[#0D1B0F]">
      {/* Immersive Forest Hero with Parallax */}
      <HeroSection />

      {/* Featured Plants Carousel with Emerald Glow */}
      <SeamlessSection 
        bgColor="bg-[#0D1B0F]" 
        paddingY="lg"
        rightDecoration="fern"
      >
        <FeaturedPlantsCarousel />
      </SeamlessSection>

      <LeafDivider />

      {/* Immersive Botanical Explorer - Interactive Showcase */}
      <SeamlessSection 
        bgColor="bg-[#0F1E11]" 
        paddingY="md"
      >
        <ImmersiveBotanicalExplorer products={featuredProducts} />
      </SeamlessSection>

      <LeafDivider color="#66BB6A" />

      {/* Immersive Forest Experience Banner - Parallax Section */}
      <ForestExperienceBanner />

      {/* Brand Story + About Preview */}
      <SeamlessSection 
        bgColor="bg-[#0F1E11]" 
        paddingY="xl"
        leftDecoration="monstera"
      >
        <BrandStorySection />
      </SeamlessSection>

      <LeafDivider color="#66BB6A" />

      {/* Why Choose Us */}
      <SeamlessSection 
        bgColor="bg-[#0D1B0F]" 
        paddingY="lg"
        rightDecoration="monstera"
      >
        <WhyChooseUs />
      </SeamlessSection>

      {/* Features Section */}
      <SeamlessSection 
        bgColor="bg-[#0F1E11]" 
        paddingY="md"
        leftDecoration="fern"
      >
        <Features />
      </SeamlessSection>

      <LeafDivider />

      {/* Customer Testimonials Slider */}
      <SeamlessSection 
        bgColor="bg-[#0D1B0F]" 
        paddingY="lg"
        rightDecoration="fern"
      >
        <CustomerTestimonialsSlider />
      </SeamlessSection>

      {/* Newsletter Signup */}
      <SeamlessSection 
        bgColor="bg-[#0F1E11]" 
        paddingY="md"
        leftDecoration="monstera"
      >
        <Newsletter />
      </SeamlessSection>

      <LeafDivider color="#66BB6A" />

      {/* Final CTA */}
      <SeamlessSection 
        bgColor="bg-[#0D1B0F]" 
        paddingY="xl"
      >
        <FinalCTA />
      </SeamlessSection>
    </div>
  );
}