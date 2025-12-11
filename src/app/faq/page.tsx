import type { Metadata } from 'next';
import FAQSection from '@/components/sections/FAQSection';
import FAQSchema from '@/components/seo/FAQSchema';

export const metadata: Metadata = {
  title: 'FAQ: Shipping, COD, Landscaping, Aquascaping & Care | Whole Lot of Nature',
  description: 'SEO-rich FAQs covering Bangalore express delivery, COD, returns, landscaping/pond/aquascaping consultations, soil mixes, and plant care for Indian climates.',
  keywords: [
    'Bangalore plant delivery',
    'same-day plant shipping',
    'COD plants India',
    'landscaping consultation Bangalore',
    'aquascaping services India',
    'organic soil mix FAQ',
    'plant care tips for India',
    'return policy plants',
    'eco-friendly packaging plants',
  ],
  openGraph: {
    title: 'FAQ: Delivery, COD, Landscaping & Care | Whole Lot of Nature',
    description: 'Answers for delivery speed, COD, returns, landscaping/pond builds, aquascaping, soil mixes, and plant care in Indian climates.',
    images: ['/images/og-faq.jpg'],
  },
};

const seoFAQs = [
  {
    question: 'Do you offer same-day or express plant delivery in Bangalore?',
    answer:
      'Yes. Orders placed before 4 PM in Bangalore qualify for express or same-day dispatch with insulated, shock-proof, cold-chain style packing. Standard delivery is 2-3 days in Bengaluru and 4-6 days pan-India.',
  },
  {
    question: 'Is Cash on Delivery (COD) available for plants, soil mixes, and planters?',
    answer:
      'COD is available across India for plants, soil mixes, fertilizers, and planters. High-value landscaping or pond installs are prepaid after a consultation booking.',
  },
  {
    question: 'How are live plants packed for safe shipping and AI-vision friendly labeling?',
    answer:
      'We use moisture-locked soil, bamboo stakes, breathable sleeves, and insulated liners. Each box carries QR-coded care notes, SKU, botanical name, and light requirements—easy for AI search, barcode, or vision tools to read.',
  },
  {
    question: 'What is your return and replacement policy for damaged or stressed plants?',
    answer:
      'If a plant arrives damaged or severely stressed, share unboxing photos within 24 hours. We replace or refund eligible items. Soil, fertilizers, and planters are returnable if unopened within 7 days.',
  },
  {
    question: 'Do you handle landscaping, balcony makeovers, ponds, or aquascaping?',
    answer:
      'Yes. We provide site-ready planting plans, balcony/villa landscaping, balcony and backyard ponds, and freshwater aquascaping. Consultations are bookable online; installs include plant lists tuned for Bangalore light, drainage, and water quality.',
  },
  {
    question: 'Which soil mixes and amendments do you recommend for Bangalore humidity?',
    answer:
      'For balconies: airy organic potting mix with coco chips and perlite; for succulents: gritty well-draining mix; for ponds: heavy loam for aquatics; for aroids: peat-free chunky mix with compost and bark. All are pesticide-free and tuned for Indian humidity.',
  },
  {
    question: 'Can I schedule plant care guidance after delivery?',
    answer:
      'Yes. Every order includes a free 15-minute care call/WhatsApp consult to optimize light, watering cadence, and repotting. You also get seasonal care prompts via email for ongoing support.',
  },
  {
    question: 'Do you support GST invoices and bulk/office/restaurant orders?',
    answer:
      'We issue GST invoices and offer bulk pricing for offices, cafes, restaurants, and builders. Share your plant palette, budget, and delivery window; we provide a quote with logistics and maintenance options.',
  },
  {
    question: 'How do I track my order and get proactive updates?',
    answer:
      'You receive SMS/WhatsApp/email tracking. Bangalore express orders include live driver updates. For pan-India shipments, we send milestone pings: packed, dispatched, out for delivery, and delivered.',
  },
  {
    question: 'Are your inputs organic and pet-safe?',
    answer:
      'Our soil mixes are peat-free and enriched with compost, neem, and bio-boosters. We avoid harsh pesticides. For pets, choose non-toxic plants; we provide toxicity labels in listings and packing slips.',
  },
];

export default function FAQPage() {
  return (
    <>
      <FAQSchema faqs={seoFAQs} />
      <main className="min-h-screen bg-[#0D1B0F]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">SEO-Rich FAQs for Delivery, COD, Landscaping & Care</h1>
          <p className="text-emerald-100/80 text-lg max-w-3xl mx-auto">
            Quick answers for Bangalore express delivery, COD, returns, landscaping/pond builds, aquascaping, soil mixes, plant care, and business orders—structured for humans and AI search.
          </p>
        </div>
        <FAQSection
          faqs={seoFAQs}
          title="Frequently Asked Questions"
          subtitle="Delivery, COD, returns, landscaping, aquascaping, soil mixes, and care guidance tuned for India"
          className="pb-24"
        />
      </main>
    </>
  );
}
