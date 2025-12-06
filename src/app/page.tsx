'use client';

import dynamic from 'next/dynamic';
import InteractiveHero from '@/components/home/InteractiveHero';
import TrustBanner from '@/components/sections/TrustBanner';
import PremiumFeaturedShowcase from '@/components/home/PremiumFeaturedShowcase';
import ModernCategories from '@/components/sections/ModernCategories';
import TagFilterSection from '@/components/sections/TagFilterSection';
import SeamlessSection from '@/components/ui/SeamlessSection';

import type { Metadata } from 'next';

const AllProductsShowcase = dynamic(() => import('@/components/sections/AllProductsShowcase'));
const CustomerTestimonialsSlider = dynamic(() => import('@/components/sections/CustomerTestimonialsSlider'));
const Features = dynamic(() => import('@/components/sections/Features'));
const BlogPreview = dynamic(() => import('@/components/sections/BlogPreview'));
const YouTubeShowcase = dynamic(() => import('@/components/sections/YouTubeShowcase'));
const FinalCTA = dynamic(() => import('@/components/sections/FinalCTA'));
const FAQSection = dynamic(() => import('@/components/sections/FAQSection'));
const NewsletterPopup = dynamic(() => import('@/components/ui/NewsletterPopup'), { ssr: false });

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