'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqData = [
  {
    question: "What types of plants do you offer?",
    answer: "We offer a wide variety of plants including indoor plants, outdoor plants, flowering plants, succulents, herbs, vegetables, and fruit plants. All our plants are carefully selected and grown with organic methods."
  },
  {
    question: "Do you provide free shipping?",
    answer: "Yes! We provide free shipping on all orders above ₹999. For orders below ₹999, standard shipping charges apply. We deliver across India with careful packaging to ensure your plants arrive healthy."
  },
  {
    question: "How do you ensure plants arrive healthy?",
    answer: "We use specialized packaging with proper ventilation, moisture control, and protective materials. Our plants are prepared by experts and shipped within 24-48 hours of your order to ensure maximum freshness."
  },
  {
    question: "What if my plant arrives damaged?",
    answer: "We offer a 7-day replacement guarantee. If your plant arrives damaged or unhealthy, simply contact us within 7 days with photos, and we'll send a replacement at no extra cost."
  },
  {
    question: "Do you provide plant care guidance?",
    answer: "Absolutely! Each plant comes with detailed care instructions. You can also explore our Blog for expert tips, care guides, and troubleshooting advice. Our team is always available for support."
  },
  {
    question: "What organic products do you offer?",
    answer: "We offer organic potting mix, compost, organic fertilizers, natural pest control solutions, seeds, and plant care accessories. All our organic products are certified and safe for both plants and the environment."
  },
  {
    question: "Can I return plants if I'm not satisfied?",
    answer: "Due to the living nature of plants, we don't accept returns. However, we offer a 7-day replacement guarantee for damaged or unhealthy plants. We're committed to your satisfaction and will work with you to resolve any issues."
  },
  {
    question: "Do you offer bulk orders for offices or events?",
    answer: "Yes! We offer special pricing for bulk orders, corporate gifting, and event decorations. Contact our team for customized quotes and arrangements. We also provide maintenance services for office plants."
  },
  {
    question: "How often should I water my plants?",
    answer: "Watering frequency depends on the plant type, season, and environment. Generally, check soil moisture by inserting your finger 1-2 inches deep. Water when the topsoil feels dry. Our care guides provide specific watering instructions for each plant."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major payment methods including credit/debit cards, UPI, net banking, and cash on delivery (COD) for eligible locations. All transactions are secure and encrypted."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
  <section className="py-12 bg-primary-50/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-2 antialiased">
            Frequently Asked Questions
          </h2>
          <p className="text-base text-gray-100 max-w-2xl mx-auto antialiased">
            Find answers to common questions about our plants, shipping, care instructions, and more.
          </p>
        </div>

        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-lg border border-primary-100 overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900 pr-4 antialiased">
                    {faq.question}
                  </h3>
                  {openIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-[#2E7D32] flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-[#2E7D32] flex-shrink-0" />
                  )}
                </div>
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <div className="h-px bg-primary-100 mb-4"></div>
                  <p className="text-gray-700 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-primary-900 mb-4 font-semibold text-lg antialiased">
            Can't find what you're looking for?
          </p>
          <a
            href="mailto:support@wholelotofnature.com"
            className="inline-flex items-center px-7 py-3 bg-white text-primary-700 font-bold rounded-xl border border-primary-200 hover:bg-primary-50 transition-colors text-lg antialiased"
          >
            Contact Support
          </a>
        </div>
      </div>
    </section>
  );
}