'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'What types of plants do you offer?',
    answer: 'We offer a wide variety of plants including indoor plants, outdoor plants, succulents, air-purifying plants, flowering plants, aquatic plants, and seasonal varieties. All our plants are carefully selected for quality and sustainability.',
  },
  {
    question: 'How do I place an order?',
    answer: 'Browse our collection, select your desired products, add them to cart, and proceed to checkout. We accept multiple payment methods including credit/debit cards, UPI, and cash on delivery.',
  },
  {
    question: 'What are your shipping and delivery options?',
    answer: 'We ship across India with secure packaging to ensure your plants arrive healthy. Delivery typically takes 3-7 business days depending on your location. We provide tracking information for all orders.',
  },
  {
    question: 'What is your return and refund policy?',
    answer: 'We offer a 7-day return policy for damaged or unhealthy plants. Please contact us with photos within 24 hours of delivery for any issues. Refunds are processed within 5-7 business days.',
  },
  {
    question: 'What type of soil is best for my plants?',
    answer: 'It depends on the plant type! We offer specialized soil mixes for different plants: well-draining cactus mix for succulents, nutrient-rich potting mix for indoor plants, and organic compost for outdoor gardens. Check our soil category for detailed recommendations.',
  },
  {
    question: 'Do you offer organic and eco-friendly products?',
    answer: 'Yes! All our soil mixes, fertilizers, and herbal products are 100% organic and eco-friendly. We believe in sustainable gardening practices that are good for both your plants and the environment.',
  },
  {
    question: 'How do I care for my plants after delivery?',
    answer: 'Each plant comes with detailed care instructions. Generally, allow plants to acclimatize for 2-3 days in indirect sunlight, water when the top soil feels dry, and gradually introduce them to their permanent location.',
  },
  {
    question: 'Do you provide gardening consultation or support?',
    answer: 'Yes! Our team is available 24/7 to answer your gardening questions. You can reach us via phone, email, or WhatsApp. We also have detailed care guides and blog posts on our website.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept credit/debit cards, UPI, net banking, wallets, and cash on delivery (COD) for select locations. All payments are processed securely through encrypted gateways.',
  },
  {
    question: 'Can I track my order?',
    answer: 'Absolutely! Once your order ships, you\'ll receive a tracking number via email and SMS. You can track your shipment in real-time through our website or the courier partner\'s portal.',
  },
];

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="relative py-20 overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-montserrat text-[clamp(2rem,5vw,2.5rem)] font-bold text-[#66BB6A] mb-4 antialiased">
            Frequently Asked Questions
          </h2>
          <p className="text-[clamp(0.9375rem,2vw,1.125rem)] text-white/85 antialiased">
            Got questions? We've got answers!
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="bg-gradient-to-br from-[#1e3a28] to-[#0F1E11] rounded-xl border border-[#2E7D32]/30 overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-5 md:p-6 text-left hover:bg-[#2E7D32]/10 transition-colors duration-200 backdrop-blur-md"
              >
                <span className="font-montserrat text-[clamp(0.9375rem,2vw,1.125rem)] font-semibold text-white pr-4 antialiased">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-[#66BB6A] flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 md:px-6 pb-5 md:pb-6 pt-0">
                      <p className="text-[clamp(0.875rem,1.5vw,1rem)] text-white/85 leading-relaxed antialiased">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12 p-6 bg-[#2E7D32]/10 border border-[#2E7D32]/30 rounded-xl backdrop-blur-md"
        >
          <p className="text-[clamp(0.9375rem,2vw,1.125rem)] text-white/80 mb-4 antialiased">
            Still have questions?
          </p>
          <a
            href="mailto:support@wholelotofnature.com"
            className="inline-flex items-center gap-2 text-[#66BB6A] hover:text-[#2E7D32] font-semibold transition-colors duration-300"
          >
            Contact our support team
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
