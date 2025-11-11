'use client';

/**
 * Partnership & Collaboration Page - SEO Optimized
 * B2B Partnerships, Corporate Sustainability, Community Collaborations
 * Keywords: B2B partnerships, sustainable business, organic farming collaboration
 */

import React from 'react';
import { motion } from 'framer-motion';

interface Partner {
  name: string;
  category: 'retailer' | 'farm' | 'ngo' | 'corporate';
  description: string;
  impact?: string;
}

const partners: Partner[] = [
  {
    name: 'Local Farmers Network',
    category: 'farm',
    description: 'Partnering with 50+ organic farmers across India to source premium seeds',
    impact: 'Supporting 500+ farming families',
  },
  {
    name: 'Urban Gardening Community',
    category: 'ngo',
    description: 'Collaborating with NGOs to promote urban organic gardening',
    impact: '5,000+ urban gardeners trained',
  },
  {
    name: 'Corporate Sustainability Initiatives',
    category: 'corporate',
    description: 'B2B programs for companies committed to environmental responsibility',
    impact: '25+ corporate partners',
  },
  {
    name: 'Retail Distribution Network',
    category: 'retailer',
    description: 'Strategic partnerships with eco-conscious retailers nationwide',
    impact: 'Available in 100+ locations',
  },
];

export default function PartnershipsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 via-white to-green-50 border-b-4 border-green-600 py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
              🤝 Partnerships & Collaboration
            </h1>
            <p className="text-xl md:text-2xl text-green-700 font-semibold mb-2">
              Growing Together for a Sustainable Future
            </p>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              We believe in the power of collaboration. By partnering with farmers, organizations, and
              businesses aligned with our values, we're creating a stronger movement toward sustainable
              organic gardening across India.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Partnership Types */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-black mb-12 text-center"
          >
            Types of Partnerships
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: '🌾',
                title: 'Farmer Partnerships',
                description:
                  'Direct relationships with organic farmers ensuring fair prices, quality seeds, and sustainable farming practices. We support farmer communities and preserve agricultural heritage.',
                benefits: [
                  'Direct-to-source premium seeds',
                  'Fair farmer compensation',
                  'Knowledge sharing & training',
                  'Sustainable farming support',
                ],
              },
              {
                icon: '🏢',
                title: 'B2B Corporate Partnerships',
                description:
                  'Tailored programs for businesses, offices, and institutions looking to implement sustainability initiatives and corporate wellness programs.',
                benefits: [
                  'Bulk order discounts',
                  'Custom packaging & branding',
                  'Employee wellness programs',
                  'CSR support & guidance',
                ],
              },
              {
                icon: '🌍',
                title: 'NGO & Community Collaborations',
                description:
                  'Working with non-profits and community organizations to promote organic gardening, environmental education, and grassroots sustainability.',
                benefits: [
                  'Educational workshops',
                  'Community gardens',
                  'Environmental programs',
                  'Special pricing for nonprofits',
                ],
              },
              {
                icon: '🏪',
                title: 'Retail & Distribution',
                description:
                  'Partnerships with eco-conscious retailers, garden centers, and online platforms to make our products accessible nationwide.',
                benefits: [
                  'Wholesale pricing',
                  'Marketing support',
                  'Training & education',
                  'Co-branded initiatives',
                ],
              },
            ].map((partnership, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white border-2 border-black rounded-lg p-6"
              >
                <div className="text-4xl mb-4">{partnership.icon}</div>
                <h3 className="text-2xl font-bold text-black mb-3">{partnership.title}</h3>
                <p className="text-gray-700 mb-4">{partnership.description}</p>
                <div>
                  <p className="font-bold text-black mb-2">Key Benefits:</p>
                  <ul className="space-y-1">
                    {partnership.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-gray-700">
                        <span className="text-green-600 mt-1">✓</span>
                        <span className="text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Partners Section */}
      <section className="bg-green-50 border-y-4 border-green-600 py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-black mb-12 text-center"
          >
            Our Partnership Network
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-6">
            {partners.map((partner, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white border-2 border-black rounded-lg p-6"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-bold text-black">{partner.name}</h3>
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-bold ${
                      partner.category === 'farm'
                        ? 'bg-green-100 text-green-700'
                        : partner.category === 'corporate'
                          ? 'bg-blue-100 text-blue-700'
                          : partner.category === 'ngo'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-orange-100 text-orange-700'
                    }`}
                  >
                    {partner.category.charAt(0).toUpperCase() + partner.category.slice(1)}
                  </span>
                </div>
                <p className="text-gray-700 mb-3">{partner.description}</p>
                {partner.impact && (
                  <p className="text-green-700 font-bold">📊 {partner.impact}</p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-black mb-12 text-center"
          >
            Partnership Success Stories
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Farmer Empowerment Program',
                story:
                  'By partnering directly with 50+ organic farmers, we increased their income by 35% while ensuring sustainable farming practices and preserving traditional crop varieties.',
                metric: '500+ farming families supported',
              },
              {
                title: 'Corporate Green Initiative',
                story:
                  'Our corporate partnerships enabled 25 companies to implement sustainability programs, creating rooftop gardens and promoting employee wellness through organic gardening.',
                metric: '1,000+ employees engaged',
              },
              {
                title: 'Community Garden Project',
                story:
                  'Collaborated with NGOs to establish 15 community gardens in urban areas, bringing organic gardening to 5,000+ city residents.',
                metric: '15 community gardens active',
              },
            ].map((story, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white border-2 border-green-600 rounded-lg p-6"
              >
                <h3 className="text-xl font-bold text-black mb-3">{story.title}</h3>
                <p className="text-gray-700 mb-4">{story.story}</p>
                <p className="text-green-700 font-bold">✓ {story.metric}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Benefits */}
      <section className="bg-gradient-to-r from-green-50 to-green-100 border-y-4 border-green-600 py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-black mb-12 text-center"
          >
            Why Partner With Whole Lot of Nature?
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '🌟',
                title: 'Trusted Brand',
                description: '10,000+ happy customers and 95% satisfaction rating',
              },
              {
                icon: '📈',
                title: 'Growing Market',
                description: 'Part of the rapidly growing organic and sustainable market',
              },
              {
                icon: '💚',
                title: 'Shared Values',
                description: 'Partners aligned with sustainability and community impact',
              },
              {
                icon: '🎓',
                title: 'Education & Support',
                description: 'Comprehensive training and marketing support provided',
              },
              {
                icon: '🌐',
                title: 'Network Access',
                description: 'Connect with 1,000+ eco-conscious organizations',
              },
              {
                icon: '📊',
                title: 'Business Growth',
                description: 'Proven models and strategies for sustainable business success',
              },
            ].map((benefit, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white border-2 border-black rounded-lg p-6 text-center"
              >
                <p className="text-4xl mb-3">{benefit.icon}</p>
                <h3 className="text-lg font-bold text-black mb-2">{benefit.title}</h3>
                <p className="text-gray-700 text-sm">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 border-t-4 border-green-900 py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Collaborate?
            </h2>
            <p className="text-xl text-green-100 mb-8">
              Let's partner together to grow organic gardening and sustainability across India.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:partnerships@wholelotofnature.com"
                className="inline-block bg-white text-green-700 px-8 py-4 rounded font-bold text-lg hover:bg-green-50 transition-colors"
              >
                Become a Partner →
              </a>
              <a
                href="/about"
                className="inline-block bg-green-700 text-white px-8 py-4 rounded font-bold text-lg border-2 border-white hover:bg-green-800 transition-colors"
              >
                Learn More About Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
