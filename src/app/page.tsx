'use client';

import dynamic from 'next/dynamic';
import InteractiveHero from '@/components/home/InteractiveHero';
import TrustBanner from '@/components/sections/TrustBanner';
// import PlantsShowcase from '@/components/home/PlantsShowcase';
import SoilShowcase from '@/components/home/SoilShowcase';
import ModernCategories from '@/components/sections/ModernCategories';
import TagFilterSection from '@/components/sections/TagFilterSection';
import SeamlessSection from '@/components/ui/SeamlessSection';
import FAQSchema from '@/components/seo/FAQSchema';

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

const homeSeoFaqs = [
  {
    question: 'Does Whole Lot of Nature offer same-day or express plant delivery in Bangalore?',
    answer:
      'Yes. Metro Bangalore orders placed before 4 PM qualify for express or same-day dispatch with insulated, shock-proof packing and live tracking. Standard shipping pan-India runs 2-4 days with moisture-lock sleeves and QR-coded care notes.',
  },
  {
    question: 'Which low-light or AC-friendly indoor plants do you recommend for apartments and offices?',
    answer:
      'Snake plant, ZZ plant, aglaonema, pothos, peace lily, and philodendrons thrive in low light and air-conditioned rooms. Whole Lot of Nature curates acclimatized stock with light labels so you can match plants to corners, desks, and reception areas.',
  },
  {
    question: 'What are the best balcony plants for Bangalore sun, humidity, and air purification?',
    answer:
      'Areca palm, rubber plant, money plant, ferns, jasmine, and hibiscus handle Bangalore humidity and brighten balconies while filtering air. For harsher afternoon sun, add bougainvillea, adenium, and succulents with a gritty mix to prevent root rot.',
  },
  {
    question: 'How should I water indoor plants in India without overwatering?',
    answer:
      'Use the finger test—water when the top 2 cm of soil is dry. In Bengaluru weather, most indoor plants prefer 1-2 waterings weekly; cacti and succulents need less. Ensure drainage holes, empty saucers, and use our airy organic potting mix to avoid soggy roots.',
  },
  {
    question: 'Which soil mix works for succulents, tropicals, and balconies in humid cities?',
    answer:
      'For succulents and cacti, choose a fast-draining mix with grit, sand, and perlite. For tropical foliage, use an airy, peat-free organic potting mix with coco chips and compost. Whole Lot of Nature hand-blends mixes tuned for Bangalore humidity and balcony planters.',
  },
  {
    question: 'Do you have pet-safe, kid-safe, or non-toxic plants?',
    answer:
      'Yes. Areca palm, calathea, peperomia, spider plant, and parlor palm are popular pet-safe options. We label toxicity and include QR care cards so you can filter for safe picks for homes with cats, dogs, or kids.',
  },
  {
    question: 'How often should I repot and what pot size should I pick?',
    answer:
      'Repot every 12-18 months or when roots circle the pot or water runs off quickly. Size up by 1-2 inches only to prevent waterlogging. Use breathable pots with drainage and match with the right mix—succulent grit mix or tropical chunky mix from Whole Lot of Nature.',
  },
  {
    question: 'Do you offer Cash on Delivery (COD), GST invoices, or bulk/office plant solutions?',
    answer:
      'Yes. COD is available on most retail orders. We issue GST invoices and handle bulk, office, café, and builder orders with custom quotes, plant palettes, maintenance plans, and staggered deliveries for Bangalore and pan-India clients.',
  },
  {
    question: 'How do you pack live plants so leaves and soil stay intact during shipping?',
    answer:
      'We secure soil with coco fiber, use breathable sleeves, bamboo stakes, insulated liners, and double-wall cartons. Each box includes SKU, botanical name, light/water icons, and a QR code for care—friendly to AI search, scanners, and quick unboxing.',
  },
  {
    question: 'Does Whole Lot of Nature provide balcony landscaping, pond building, or aquascaping in Bangalore?',
    answer:
      'Yes. We design balcony makeovers, climate-smart planting plans, drip-ready beds, backyard or balcony ponds, and freshwater aquascapes. Consultations are bookable online, with installs tailored to Bengaluru light, drainage, and water quality.',
  },
  {
    question: 'What is the best organic pest control for houseplants (mealybugs, mites, fungus gnats)?',
    answer:
      'Start with isolation, neem oil sprays, sticky traps for gnats, and well-draining soil to avoid fungus. We stock neem-based solutions and guide you on weekly IPM routines—wipe leaves, refresh topsoil, and improve airflow to keep pests down.',
  },
  {
    question: 'Can beginners use self-watering planters or grow lights for low-light rooms?',
    answer:
      'Yes. Self-watering planters reduce watering mistakes; keep wicks clean and top up reservoirs weekly. For dark corners, use 4000-6500K LED grow lights on a 10-12 hour timer. Pair with hardy plants like pothos, ZZ, or snake plants for quick wins.',
  },
  {
    question: 'How do I care for plants during monsoon or dry AC winters in India?',
    answer:
      'Monsoon: reduce watering, increase airflow, and use a gritty mix to prevent rot. Dry AC winters: add humidity trays, mist lightly, and avoid cold drafts. Whole Lot of Nature sends seasonal care prompts so you can adjust watering and feeding per season.',
  },
  {
    question: 'What if my plant arrives damaged or stressed in transit?',
    answer:
      'Unbox within 24 hours, share photos, and we replace or refund eligible items. Acclimate plants in bright, indirect light, remove yellow leaves, and follow the included care card. Our packaging plus concierge support keeps DOA rates extremely low.',
  },
];



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
        noShell
        className="-mt-10 pt-6 pb-12"
      >
        <TrustBanner />
      </SeamlessSection>

      {/* 3. All Products Showcase */}
      <AllProductsShowcase />

      {/* 4. Plants Showcase - REMOVED as per request */}
      {/* <PlantsShowcase /> */}

      {/* 5. Modern Categories Section */}
      <ModernCategories />

      {/* 6. Tag-Based Product Filter */}
      <TagFilterSection />

      {/* 7. Soil Showcase */}
      <SoilShowcase />

      {/* 8. Features Section */}
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
        <FAQSchema faqs={homeSeoFaqs} />
        <FAQSection
          faqs={homeSeoFaqs}
          title="Whole Lot of Nature: Bangalore Plant FAQs"
          subtitle="Shipping, COD, balcony gardening, soil mixes, indoor light, pet-safe plants, and organic care tuned for India"
        />
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