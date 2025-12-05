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
import YouTubeShowcase from '@/components/sections/YouTubeShowcase';
import FinalCTA from '@/components/sections/FinalCTA';
import FAQSection from '@/components/sections/FAQSection';
import SeamlessSection from '@/components/ui/SeamlessSection';
import NewsletterPopup from '@/components/ui/NewsletterPopup';

import type { Metadata } from 'next';

/*
export const metadata: Metadata = {
  title: 'Buy Premium Plants Online | Whole Lot of Nature',
  description: 'Shop premium indoor and outdoor plants online in Bangalore. Expert plant care, fast delivery, and sustainable gardening solutions. Soil mixes, pots, and accessories available.',
  openGraph: {
    title: 'Buy Premium Plants Online | Whole Lot of Nature',
    description: 'Shop premium indoor and outdoor plants online in Bangalore. Expert plant care, fast delivery, and sustainable gardening solutions. Soil mixes, pots, and accessories available.',
    images: ['https://wholelotofnature.com/images/og-image.jpg'],
    url: 'https://wholelotofnature.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Buy Premium Plants Online | Whole Lot of Nature',
    description: 'Shop premium indoor and outdoor plants online in Bangalore. Expert plant care, fast delivery, and sustainable gardening solutions. Soil mixes, pots, and accessories available.',
    images: ['https://wholelotofnature.com/images/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://wholelotofnature.com',
  },
};
*/



export default function Home() {
  return (
    <div className="min-h-screen relative z-10 bg-[#0d3512] text-[#daf2d0]">
      <h1 className="sr-only">Premium Plants & Gardening Supplies</h1>
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

      {/* 11. YouTube Showcase */}
      <SeamlessSection 
        tone="forest"
        paddingY="lg"
      >
        <YouTubeShowcase />
      </SeamlessSection>

      {/* 12. FAQ Section */}
      <SeamlessSection 
        tone="onyx"
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