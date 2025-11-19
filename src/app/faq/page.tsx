import type { Metadata } from 'next';
import FAQSection from '@/components/sections/FAQSection';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | Whole Lot of Nature',
  description: 'Find answers to common questions about our plants, shipping, returns, care instructions, and more. Get expert advice from India\'s premier online plant nursery.',
  keywords: 'plant FAQs, plant care questions, shipping policy, return policy, plant delivery, online plant store questions',
  openGraph: {
    title: 'FAQ - Whole Lot of Nature',
    description: 'Find answers to common questions about our plants, shipping, and services.',
    images: ['/images/og-faq.jpg'],
  },
};

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-slate-950">
      <FAQSection className="pt-24" />
    </main>
  );
}
