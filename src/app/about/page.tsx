'use client';


import { motion } from 'framer-motion';
import Image from 'next/image';
import SectionHeader from '@/components/content/SectionHeader';
import StatisticsCard from '@/components/content/StatisticsCard';
import TrustSignals from '@/components/content/TrustSignals';
import FeatureCard from '@/components/content/FeatureCard';
import { CTASection } from '@/components/content/CTAButton';

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-green-50 to-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <SectionHeader
              as="h1"
              title="About Whole Lot of Nature"
              subtitle="Growing organic seeds, sustainable futures, and thriving communities"
              align="center"
              variant="hero"
              size="large"
            />
          </motion.div>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            {/* Image */}
            <div className="relative h-96 rounded-lg overflow-hidden border-4 border-black">
              <Image
                src="https://images.unsplash.com/photo-1574260126235-4e46226a3c84?w=600&h=400&fit=crop"
                alt="Whole Lot of Nature - Our Journey"
                fill
                className="object-cover"
              />
            </div>

            {/* Content */}
            <div>
              <SectionHeader as="h2" title="Our Story" subtitle="Founded on passion for organic farming" />
              <div className="mt-6 space-y-4 text-gray-700">
                <p>
                  Whole Lot of Nature was born from a simple belief: every gardener deserves access to high-quality, organic seeds without compromising on sustainability or affordability.
                </p>
                <p>
                  What started as a small initiative to connect local farmers with conscious consumers has grown into a thriving platform serving over 10,000 customers across India. Today, we proudly offer 500+ varieties of seeds from 50+ farmer partners.
                </p>
                <p>
                  Our mission remains unchanged: to make organic gardening accessible, sustainable, and rewarding for everyone.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <SectionHeader as="h2" title="Our Impact" subtitle="By the numbers" align="center" />
          <div className="mt-12">
            <StatisticsCard 
              variant="grid"
              statistics={[
                { icon: '🌱', number: '10,000+', label: 'Happy Customers', description: 'Growing community' },
                { icon: '🎯', number: '500+', label: 'Product Varieties', description: 'Premium selection' },
                { icon: '🤝', number: '50+', label: 'Farmer Partners', description: 'Sustainable network' },
                { icon: '♻️', number: '100%', label: 'Organic', description: 'Chemical-free guarantee' },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Mission & Vision Section */}
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <SectionHeader as="h2" title="Mission & Vision" align="center" />
          <div className="mt-12 grid md:grid-cols-2 gap-8">
            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white border-4 border-black rounded-lg p-8"
            >
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold text-black mb-4">Our Mission</h3>
              <p className="text-gray-700 leading-relaxed">
                To empower every person with access to premium organic seeds, gardening knowledge, and sustainable practices that nurture both nature and community.
              </p>
              <div className="mt-6 space-y-2 text-sm text-gray-700">
                <p>✓ Quality without compromise</p>
                <p>✓ Sustainable farming practices</p>
                <p>✓ Community-driven growth</p>
                <p>✓ Affordable organic solutions</p>
              </div>
            </motion.div>

            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-green-50 border-4 border-green-600 rounded-lg p-8"
            >
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="text-2xl font-bold text-black mb-4">Our Vision</h3>
              <p className="text-gray-700 leading-relaxed">
                To transform India into a thriving ecosystem of organic gardeners, sustainable farmers, and conscious communities where nature and people flourish together.
              </p>
              <div className="mt-6 space-y-2 text-sm text-gray-700">
                <p>✓ 500+ seed varieties available</p>
                <p>✓ 50+ farmer partnerships</p>
                <p>✓ 10,000+ happy customers</p>
                <p>✓ 100% organic commitment</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            as="h2"
            title="Why Choose Whole Lot of Nature"
            subtitle="What makes us different"
            align="center"
          />
          <div className="mt-12">
            <FeatureCard 
              variant="grid" 
              columns={2}
              features={[
                { icon: '🌿', title: 'Certified Organic', description: '100% chemical-free products' },
                { icon: '💰', title: 'Best Prices', description: 'Direct from farmers to you' },
                { icon: '🚚', title: 'Fast Delivery', description: 'Nationwide shipping' },
                { icon: '🎁', title: 'Quality Guarantee', description: 'Satisfaction assured' },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Trust Signals Section */}
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <SectionHeader as="h2" title="Trust & Credibility" align="center" />
          <div className="mt-12">
            <TrustSignals 
              variant="featured"
              signals={[
                { icon: '✅', title: 'Quality Certified', description: 'Organic certification verified' },
                { icon: '🔒', title: 'Secure Payments', description: 'Safe and encrypted' },
                { icon: '📦', title: 'Free Shipping', description: 'On orders above ₹500' },
                { icon: '🌟', title: '4.8/5 Rating', description: 'Trusted by thousands' },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <SectionHeader as="h2" title="Our Core Values" align="center" />
          <div className="mt-12 grid md:grid-cols-4 gap-6">
            {[
              {
                icon: '🌱',
                title: 'Sustainability',
                description: 'We prioritize eco-friendly practices in every aspect of our business.'
              },
              {
                icon: '✓',
                title: 'Quality',
                description: 'Premium organic seeds certified and tested for maximum germination.'
              },
              {
                icon: '🤝',
                title: 'Community',
                description: 'Building connections between farmers, gardeners, and nature lovers.'
              },
              {
                icon: '💡',
                title: 'Innovation',
                description: 'Continuously improving to serve you better with new varieties and methods.'
              }
            ].map((value, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center p-6 bg-gray-50 border-2 border-black rounded-lg hover:shadow-lg transition"
              >
                <div className="text-5xl mb-3">{value.icon}</div>
                <h3 className="font-bold text-black mb-2">{value.title}</h3>
                <p className="text-sm text-gray-700">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Sustainability Commitment */}
      <div className="py-12 px-4 sm:px-6 lg:px-8 bg-green-50">
        <div className="max-w-4xl mx-auto">
          <SectionHeader as="h2" title="Our Sustainability Commitment" align="center" />
          <div className="mt-12 grid md:grid-cols-3 gap-8">
            {[
              {
                number: '100%',
                label: 'Organic Seeds',
                desc: 'All varieties are certified organic'
              },
              {
                number: '50+',
                label: 'Farmer Partners',
                desc: 'Supporting sustainable livelihoods'
              },
              {
                number: '0%',
                label: 'Plastic Packaging',
                desc: 'Eco-friendly alternatives only'
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center p-6 bg-white border-2 border-green-600 rounded-lg"
              >
                <p className="text-4xl font-bold text-green-600 mb-2">{item.number}</p>
                <p className="font-bold text-black mb-1">{item.label}</p>
                <p className="text-sm text-gray-700">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <CTASection
          title="Ready to Start Your Organic Garden?"
          description="Join thousands of gardeners growing organic, sustainable, and thriving"
          primaryButton={{
            text: 'Shop Our Seeds',
            href: '/shop'
          }}
          secondaryButton={{
            text: 'Read Our Blog',
            href: '/blog'
          }}
          variant="centered"
          backgroundVariant="green"
        />
      </div>

      {/* Contact Section */}
      <div className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <SectionHeader as="h2" title="Get In Touch" subtitle="We'd love to hear from you" align="center" />
          <div className="mt-12 grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <p className="text-3xl mb-2">📧</p>
              <p className="font-bold text-black mb-1">Email</p>
              <a href="mailto:hello@wholelotofnature.com" className="text-green-600 hover:text-green-700">
                hello@wholelotofnature.com
              </a>
            </div>
            <div className="text-center">
              <p className="text-3xl mb-2">📱</p>
              <p className="font-bold text-black mb-1">Phone</p>
              <a href="tel:+919876543210" className="text-green-600 hover:text-green-700">
                +91 98765 43210
              </a>
            </div>
            <div className="text-center">
              <p className="text-3xl mb-2">🌐</p>
              <p className="font-bold text-black mb-1">Follow Us</p>
              <div className="flex justify-center gap-3">
                <a href="#" className="text-green-600 hover:text-green-700 font-semibold">
                  Instagram
                </a>
                <a href="#" className="text-green-600 hover:text-green-700 font-semibold">
                  Facebook
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
