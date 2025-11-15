'use client';

import { useEffect, useState } from 'react';
import HeroSection from '@/components/home/HeroSection';
import CategoriesSection from '@/components/sections/CategoriesSection';
import CategoryGridFocus from '@/components/sections/CategoryGridFocus';
import TrustBanner from '@/components/sections/TrustBanner';
import FeaturedPlantsCarousel from '@/components/home/FeaturedPlantsCarousel';
import FeaturedSoilMixes from '@/components/sections/FeaturedSoilMixes';
import ForestExperienceBanner from '@/components/home/ForestExperienceBanner';
import ImmersiveBotanicalExplorer from '@/components/home/ImmersiveBotanicalExplorer';
import CustomerTestimonialsSlider from '@/components/sections/CustomerTestimonialsSlider';
import Features from '@/components/sections/Features';
import BlogPreview from '@/components/sections/BlogPreview';
import FAQAccordion from '@/components/sections/FAQAccordion';
import Newsletter from '@/components/sections/Newsletter';
import BrandStorySection from '@/components/sections/BrandStorySection';
import WhyChooseUsFocus from '@/components/sections/WhyChooseUsFocus';
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
    <div className="min-h-screen relative z-10 bg-[var(--surface-canvas)] text-[var(--ink-900)]">
      {/* 1. Immersive Forest Hero with Parallax */}
      <HeroSection />

      {/* 1.5. Animated Categories with Botanical Bento */}
      <SeamlessSection 
        tone="forest"
        paddingY="lg"
        rightDecoration="fern"
      >
        <CategoriesSection />
      </SeamlessSection>

      <LeafDivider />

      {/* 2. Shop by Category Grid */}
      <div id="categories">
        <SeamlessSection 
          tone="forest"
          paddingY="lg"
          leftDecoration="monstera"
        >
          <CategoryGridFocus />
        </SeamlessSection>
      </div>

      <LeafDivider />

      {/* 3. Trust/Awards Banner - NEW */}
      <SeamlessSection 
        tone="onyx"
        paddingY="sm"
      >
        <TrustBanner />
      </SeamlessSection>

  <LeafDivider />

      {/* 4. Best Sellers - Featured Plants Carousel */}
      <SeamlessSection 
        tone="forest"
        paddingY="lg"
        rightDecoration="fern"
      >
        <FeaturedPlantsCarousel />
      </SeamlessSection>

      <LeafDivider />

      {/* 5. Featured Products: Soil & Mixes - NEW */}
      <SeamlessSection 
        tone="onyx"
        paddingY="lg"
        leftDecoration="fern"
      >
        <FeaturedSoilMixes />
      </SeamlessSection>

  <LeafDivider />

      {/* 6. Immersive Botanical Explorer */}
      <SeamlessSection 
        tone="forest"
        paddingY="md"
      >
        <ImmersiveBotanicalExplorer products={featuredProducts} />
      </SeamlessSection>

      <LeafDivider />

      {/* 7. Forest Experience Banner - Parallax */}
      <ForestExperienceBanner />

      {/* 8. Brand Story + About Preview */}
      <SeamlessSection 
        tone="onyx"
        paddingY="xl"
        leftDecoration="monstera"
      >
        <BrandStorySection />
      </SeamlessSection>

  <LeafDivider />

      {/* 9. Why Choose Us */}
      <SeamlessSection 
        tone="forest"
        paddingY="lg"
        rightDecoration="monstera"
      >
        <WhyChooseUsFocus />
      </SeamlessSection>

      {/* 10. Features Section */}
      <SeamlessSection 
        tone="onyx"
        paddingY="md"
        leftDecoration="fern"
      >
        <Features />
      </SeamlessSection>

      <LeafDivider />

      {/* 11. Customer Testimonials */}
      <SeamlessSection 
        tone="forest"
        paddingY="lg"
        rightDecoration="fern"
      >
        <CustomerTestimonialsSlider />
      </SeamlessSection>

  <LeafDivider />

      {/* 12. Blog Preview - NEW */}
      <SeamlessSection 
        tone="onyx"
        paddingY="lg"
        leftDecoration="palm"
      >
        <BlogPreview />
      </SeamlessSection>

      <LeafDivider />

      {/* 13. FAQ Section - NEW */}
      <SeamlessSection 
        tone="forest"
        paddingY="lg"
        rightDecoration="monstera"
      >
        <FAQAccordion />
      </SeamlessSection>

      {/* 14. Newsletter Signup */}
      <SeamlessSection 
        tone="onyx"
        paddingY="md"
        leftDecoration="monstera"
      >
        <Newsletter />
      </SeamlessSection>

  <LeafDivider />

      {/* 15. Final CTA */}
      <SeamlessSection 
        tone="forest"
        paddingY="xl"
      >
        <FinalCTA />
      </SeamlessSection>
    </div>
  );
}