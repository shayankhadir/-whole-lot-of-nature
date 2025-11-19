'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

interface FAQSectionProps {
  faqs?: FAQItem[];
  title?: string;
  subtitle?: string;
  className?: string;
}

const defaultFAQs: FAQItem[] = [
  {
    question: 'What is your shipping policy?',
    answer: 'We offer FREE shipping on orders above ₹150. Orders are typically delivered within 3-5 business days in Bangalore and 5-7 business days for other cities.',
    category: 'Shipping'
  },
  {
    question: 'Do you offer Cash on Delivery (COD)?',
    answer: 'Yes, we offer Cash on Delivery for all orders. You can pay when you receive your plants at your doorstep.',
    category: 'Payment'
  },
  {
    question: 'What if my plant arrives damaged?',
    answer: 'We take utmost care in packaging. However, if your plant arrives damaged, please contact us within 24 hours with photos, and we will arrange a replacement or refund.',
    category: 'Returns'
  },
  {
    question: 'Do you provide plant care instructions?',
    answer: 'Yes! Each plant comes with detailed care instructions. You can also visit our Learn Gardening section for comprehensive care guides.',
    category: 'Care'
  },
  {
    question: 'Can I return a plant?',
    answer: 'Plants can be returned within 7 days of delivery if they arrive in poor condition. We do not accept returns for plants that deteriorate due to improper care.',
    category: 'Returns'
  },
  {
    question: 'How do I track my order?',
    answer: 'Once your order is shipped, you will receive a tracking number via email and SMS. You can use this to track your order status.',
    category: 'Shipping'
  },
  {
    question: 'Are your plants organic?',
    answer: 'Yes, we use organic growing methods and natural fertilizers. Our plants are grown without harmful chemicals.',
    category: 'Products'
  },
  {
    question: 'Do you offer bulk discounts?',
    answer: 'Yes! We offer special pricing for bulk orders. Contact us at support@wholelotofnature.com for bulk order inquiries.',
    category: 'Pricing'
  },
];

export default function FAQSection({
  faqs = defaultFAQs,
  title = 'Frequently Asked Questions',
  subtitle = 'Find answers to common questions about our plants, shipping, and services',
  className = '',
}: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className={`py-16 ${className}`}>
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">{title}</h2>
          <p className="text-gray-400 text-lg">{subtitle}</p>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg overflow-hidden"
            >
              {/* Question */}
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-white/5 transition-colors"
              >
                <span className="text-lg font-semibold text-white pr-8">
                  {faq.question}
                </span>
                <svg
                  className={`w-6 h-6 text-[#2E7D32] transition-transform flex-shrink-0 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>

              {/* Answer */}
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-4 pt-2 text-gray-300 border-t border-white/10">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-400 mb-4">
            Still have questions? We&apos;re here to help!
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#2E7D32] text-white rounded-lg font-semibold hover:bg-[#1B5E20] transition-colors"
          >
            Contact Us
            <svg
              className="w-5 h-5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
