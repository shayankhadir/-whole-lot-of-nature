import type { Metadata } from 'next';
import FAQSection from '@/components/sections/FAQSection';
import FAQSchema from '@/components/seo/FAQSchema';

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

const faqs = [
  {
    question: 'What is your shipping policy?',
    answer: 'We offer FREE shipping on orders above ₹150. Orders are typically delivered within 3-5 business days in Bangalore and 5-7 business days for other cities.',
  },
  {
    question: 'Do you offer Cash on Delivery (COD)?',
    answer: 'Yes, we offer Cash on Delivery for all orders. You can pay when you receive your plants at your doorstep.',
  },
  {
    question: 'What if my plant arrives damaged?',
    answer: 'We take utmost care in packaging. However, if your plant arrives damaged, please contact us within 24 hours with photos, and we will arrange a replacement or refund.',
  },
  {
    question: 'Do you provide plant care instructions?',
    answer: 'Yes! Each plant comes with detailed care instructions. You can also visit our Learn Gardening section for comprehensive care guides.',
  },
  {
    question: 'Can I return a plant?',
    answer: 'Plants can be returned within 7 days of delivery if they arrive in poor condition. We do not accept returns for plants that deteriorate due to improper care.',
  },
  {
    question: 'How do I track my order?',
    answer: 'Once your order is shipped, you will receive a tracking number via email and SMS. You can use this to track your order status on our Track Order page.',
  },
  {
    question: 'Are your plants organic?',
    answer: 'Yes, we use organic growing methods and natural fertilizers. Our plants are grown without harmful chemicals.',
  },
  {
    question: 'Do you offer bulk discounts?',
    answer: 'Yes! We offer special pricing for bulk orders. Contact us at support@wholelotofnature.com for bulk order inquiries.',
  },
];

export default function FAQPage() {
  return (
    <>
      <FAQSchema faqs={faqs} />
      <main className="min-h-screen bg-slate-950">
        <FAQSection className="pt-24" />
      </main>
    </>
  );
}
