'use client';

import InteractiveHero from '@/components/home/InteractiveHero';
import TrustBanner from '@/components/sections/TrustBanner';
import PremiumFeaturedShowcase from '@/components/home/PremiumFeaturedShowcase';
import ModernCategories from '@/components/sections/ModernCategories';
import TagFilterSection from '@/components/sections/TagFilterSection';
import AllProductsShowcase from '@/components/sections/AllProductsShowcase';
import CustomerTestimonialsSlider from '@/components/sections/CustomerTestimonialsSlider';
import Features from '@/components/sections/Features';
import BlogPreview from '@/components/sections/BlogPreview';
import FinalCTA from '@/components/sections/FinalCTA';
import FAQSection from '@/components/sections/FAQSection';
import SeamlessSection from '@/components/ui/SeamlessSection';
import NewsletterPopup from '@/components/ui/NewsletterPopup';

export default function Home() {
  return (
    <div className="min-h-screen relative z-10 bg-[#0d3512] text-[#daf2d0]">
      <NewsletterPopup />
      {/* 1. Interactive Hero Section */}
      <InteractiveHero />

      {/* 2. Trust Banner */}
      <SeamlessSection 
        tone="onyx"
        paddingY="sm"
      >
        <TrustBanner />
      </SeamlessSection>

      {/* 3. Featured Products Section */}
      <PremiumFeaturedShowcase />

      {/* 4. Modern Categories Section */}
      <ModernCategories />

      {/* 5. Tag-Based Product Filter */}
      <TagFilterSection />

      {/* 6. All Products Showcase */}
      <AllProductsShowcase />

      {/* 7. Features Section */}
      <SeamlessSection 
        tone="forest"
        paddingY="lg"
      >
        <Features />
      </SeamlessSection>

      {/* 9. Customer Testimonials */}
      <SeamlessSection 
        tone="forest"
        paddingY="lg"
      >
        <CustomerTestimonialsSlider />
      </SeamlessSection>

      {/* 10. Blog Preview */}
      <SeamlessSection 
        tone="onyx"
        paddingY="lg"
      >
        <BlogPreview />
      </SeamlessSection>

      {/* 11. FAQ Section */}
      <SeamlessSection 
        tone="forest"
        paddingY="lg"
      >
        <FAQSection />
      </SeamlessSection>

      {/* 13. Final CTA */}
      <SeamlessSection 
        tone="forest"
        paddingY="xl"
      >
        <FinalCTA />
      </SeamlessSection>
    </div>
  );
}