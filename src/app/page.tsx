'use client';

import { useEffect, useState } from 'react';
import HeroSection from '@/components/home/HeroSection';
import CategoryGrid from '@/components/sections/CategoryGrid';
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
      {/* 1. Immersive Forest Hero with Parallax */}
      <HeroSection />

      {/* 2. Shop by Category Grid - NEW */}
      <div id="categories">
        <SeamlessSection 
          bgColor="bg-[#0D1B0F]" 
          paddingY="lg"
          leftDecoration="monstera"
        >
          <CategoryGrid />
        </SeamlessSection>
      </div>

      <LeafDivider />

      {/* 3. Trust/Awards Banner - NEW */}
      <SeamlessSection 
        bgColor="bg-[#0F1E11]" 
        paddingY="sm"
      >
        <TrustBanner />
      </SeamlessSection>

      <LeafDivider color="#66BB6A" />

      {/* 4. Best Sellers - Featured Plants Carousel */}
      <SeamlessSection 
        bgColor="bg-[#0D1B0F]" 
        paddingY="lg"
        rightDecoration="fern"
      >
        <FeaturedPlantsCarousel />
      </SeamlessSection>

      <LeafDivider />

      {/* 5. Featured Products: Soil & Mixes - NEW */}
      <SeamlessSection 
        bgColor="bg-[#0F1E11]" 
        paddingY="lg"
        leftDecoration="fern"
      >
        <FeaturedSoilMixes />
      </SeamlessSection>

      <LeafDivider color="#66BB6A" />

      {/* 6. Immersive Botanical Explorer */}
      <SeamlessSection 
        bgColor="bg-[#0D1B0F]" 
        paddingY="md"
      >
        <ImmersiveBotanicalExplorer products={featuredProducts} />
      </SeamlessSection>

      <LeafDivider />

      {/* 7. Forest Experience Banner - Parallax */}
      <ForestExperienceBanner />

      {/* 8. Brand Story + About Preview */}
      <SeamlessSection 
        bgColor="bg-[#0F1E11]" 
        paddingY="xl"
        leftDecoration="monstera"
      >
        <BrandStorySection />
      </SeamlessSection>

      <LeafDivider color="#66BB6A" />

      {/* 9. Why Choose Us */}
      <SeamlessSection 
        bgColor="bg-[#0D1B0F]" 
        paddingY="lg"
        rightDecoration="monstera"
      >
        <WhyChooseUs />
      </SeamlessSection>

      {/* 10. Features Section */}
      <SeamlessSection 
        bgColor="bg-[#0F1E11]" 
        paddingY="md"
        leftDecoration="fern"
      >
        <Features />
      </SeamlessSection>

      <LeafDivider />

      {/* 11. Customer Testimonials */}
      <SeamlessSection 
        bgColor="bg-[#0D1B0F]" 
        paddingY="lg"
        rightDecoration="fern"
      >
        <CustomerTestimonialsSlider />
      </SeamlessSection>

      <LeafDivider color="#66BB6A" />

      {/* 12. Blog Preview - NEW */}
      <SeamlessSection 
        bgColor="bg-[#0F1E11]" 
        paddingY="lg"
        leftDecoration="palm"
      >
        <BlogPreview />
      </SeamlessSection>

      <LeafDivider />

      {/* 13. FAQ Section - NEW */}
      <SeamlessSection 
        bgColor="bg-[#0D1B0F]" 
        paddingY="lg"
        rightDecoration="monstera"
      >
        <FAQAccordion />
      </SeamlessSection>

      {/* 14. Newsletter Signup */}
      <SeamlessSection 
        bgColor="bg-[#0F1E11]" 
        paddingY="md"
        leftDecoration="monstera"
      >
        <Newsletter />
      </SeamlessSection>

      <LeafDivider color="#66BB6A" />

      {/* 15. Final CTA */}
      <SeamlessSection 
        bgColor="bg-[#0D1B0F]" 
        paddingY="xl"
      >
        <FinalCTA />
      </SeamlessSection>
    </div>
  );
}