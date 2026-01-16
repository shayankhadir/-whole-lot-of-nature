'use client';

import type { Metadata } from "next";
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Leaf, Heart, Users, Sprout, Droplet, Recycle, Sun, Wind, Award } from 'lucide-react';
import YouTubeShowcase from '@/components/sections/YouTubeShowcase';
import InstagramFeed from '@/components/sections/InstagramFeed';
import FAQSection from '@/components/sections/FAQSection';
import FAQSchema from '@/components/seo/FAQSchema';

// Note: This is a client component, so metadata export won't work here.
// For proper SEO, consider converting to server component or using Route Handlers.

const stats = [
  { label: 'Happy Plants Delivered', value: '5,000+' },
  { label: 'Organic Products', value: '100%' },
  { label: 'Green Spaces Created', value: '500+' },
  { label: 'Community Members', value: '10k+' },
];

const values = [
  {
    icon: Leaf,
    title: '100% Organic',
    description: 'We believe in the power of nature. No harsh chemicals, just pure, organic goodness for your plants.'
  },
  {
    icon: Recycle,
    title: 'Sustainable',
    description: 'From our packaging to our sourcing, every step is taken with the planet in mind.'
  },
  {
    icon: Heart,
    title: 'Handcrafted with Love',
    description: 'Our soil mixes and herbal products are small-batch and handmade to ensure premium quality.'
  },
  {
    icon: Users,
    title: 'Community First',
    description: 'We are not just a store; we are a community of plant lovers growing together.'
  }
];

const legacyFaqs = [
  {
    question: 'What makes Whole Lot of Nature different from other plant retailers?',
    answer: 'We stand by our core promise: Stay Loyal to the Soil. Every product—from premium plants to handcrafted soil mixes—is sourced ethically and grown sustainably. We deliver pest-free plants backed by expert care guidance, and our custom soil blends are crafted to mimic forest ecosystems for long-term plant health.',
  },
  {
    question: 'Are your plants suitable for beginners?',
    answer: 'Absolutely! We carefully curate low-maintenance varieties perfect for first-time plant parents. Each plant arrives with detailed care instructions, and our expert team provides ongoing support through guides, videos, and direct consultation.',
  },
  {
    question: 'Do you ship nationwide across India?',
    answer: 'Yes! We deliver fast and carefully across India. Orders arrive in 3-5 business days within major metros (including Bangalore, Delhi, Mumbai, Chennai, and Hyderabad) and 5-7 business days to other cities. Plants are packed with moisture-retention materials to ensure they arrive vibrant.',
  },
  {
    question: 'What makes your soil mixes unique?',
    answer: 'Our handcrafted soil mixes are region-adapted and organic-enriched. We blend natural ingredients—coir, peat, perlite, and compost—to mimic forest floors, promoting deep root systems and microbial life. No synthetic chemicals, ever. Perfect for long-term plant vitality.',
  },
  {
    question: 'How do you ensure pest-free, healthy plants?',
    answer: 'Our climate-controlled greenhouses use natural, proactive pest prevention methods—no harmful sprays. Plants undergo rigorous health checks before packing. If any issue arises, contact us within 24 hours with photos for a hassle-free replacement or refund.',
  },
  {
    question: 'Do you offer Cash on Delivery (COD)?',
    answer: 'Yes! COD is available across India. Simply select COD at checkout and pay when your plants arrive at your doorstep.',
  },
  {
    question: 'What is your return and replacement policy?',
    answer: 'We guarantee plant health at delivery. If your plant arrives damaged or unhealthy, contact us within 24 hours with photos—we will arrange a replacement or full refund. Plants damaged due to improper post-delivery care are not eligible for returns, but we provide care guides to prevent this.',
  },
  {
    question: 'What about bulk orders and wholesale partnerships?',
    answer: 'We love working with designers, landscapers, and retailers! For bulk orders (50+ plants, custom soil mixes, or ongoing supply), contact our bulk team at grow@wholelotofnature.com for custom pricing and delivery arrangements.',
  },
  {
    question: 'Do you offer landscaping or installation services?',
    answer: 'Yes! We are expanding services in Bangalore soon. Landscaping, pond builds, aquascaping consultations, and terrarium workshops are launching soon. Contact us at hello@wholelotofnature.com for early access and custom design quotes.',
  },
  {
    question: 'How do I track my order?',
    answer: 'After placing your order, you will receive an email with a tracking number. You can track your shipment in real-time via the carrier website or our dashboard. For updates, you can also reach out to support@wholelotofnature.com.',
  },
  {
    question: 'What is the Stay Loyal to the Soil philosophy?',
    answer: 'It is our core belief: true growth honors the earth first. We commit to sustainable sourcing, organic practices, and regenerative growth—every product reflects this promise to nurture both plants and planet.',
  },
  {
    question: 'How can I get expert plant care advice?',
    answer: 'Visit our Plant Care Guides section for species-specific tips. You can also chat with our team via the Plantsy AI Assistant on our website, email support@wholelotofnature.com, or reach out through our contact page for personalized recommendations.',
  },
];

export default function AboutPage() {
  return (
    <div className="relative bg-[#0D1B0F] min-h-screen text-white overflow-hidden">
      <FAQSchema faqs={legacyFaqs} />
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/backgrounds/ai-generated-lush-tropical-green-leaves-background-photo.jpg"
          alt="Leaf backdrop"
          fill
          className="object-cover opacity-15"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#010904]/85 via-[#0D1B0F]/85 to-[#010904]/90" />
      </div>
      {/* Hero Section */}
      <div className="relative py-32 lg:py-48">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-[40%] -left-[20%] w-[70%] h-[70%] rounded-full bg-[#2E7D32]/20 blur-[120px]" />
          <div className="absolute top-[20%] -right-[20%] w-[60%] h-[60%] rounded-full bg-[#66BB6A]/10 blur-[100px]" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1.5 mb-6 rounded-full border border-[#2E7D32]/30 bg-[#2E7D32]/10 text-[#4ADE80] text-sm font-medium backdrop-blur-md">
              Est. 2023 • Serving Plant Lovers Across India
            </span>
            <h1 className="font-display text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight antialiased">
              Whole Lot of Nature: <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4ADE80] to-[#2E7D32]">Rooted in Purpose</span>
            </h1>
            <p className="font-inter text-lg md:text-xl text-emerald-100 leading-relaxed max-w-3xl mx-auto antialiased">
              From a simple promise to the soil, we've grown into a movement bringing premium plants, sustainable essentials, and botanical wisdom to plant lovers across India. Every plant. Every mix. Every promise to the earth.
            </p>
            <p className="mt-4 text-sm md:text-base uppercase tracking-[0.18em] text-emerald-200/80">Stay loyal to the soil.</p>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="border-y border-white/5 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-3xl md:text-4xl font-bold text-[#4ADE80] mb-2">{stat.value}</div>
                <div className="text-sm text-emerald-100/60 uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="py-24 relative">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Text column */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative z-10"
            >
              <h2 className="font-display text-4xl font-bold text-white mb-8 antialiased flex items-center gap-3">
                <Sprout className="h-8 w-8 text-[#4ADE80]" />
                Our Journey Begins
              </h2>

              <div className="space-y-6 text-lg text-emerald-100 antialiased leading-relaxed">
                <div>
                  <h3 className="text-xl font-semibold text-[#4ADE80] mb-3">The Hook: A Balcony Transformed</h3>
                  <p>
                    In 2023, a simple balcony sparked a revolution. One person, a love for nature, and a handful of potted plants became a mission: to make premium plants, sustainable essentials, and botanical wisdom accessible to every home across India. What started as a personal love letter to the soil became Whole Lot of Nature.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#4ADE80] mb-3">The Problem: Nature Deserves Better</h3>
                  <p>
                    We found a gap in the market—most plant retailers focused on volume over vitality. Plants arrived weak. Soil mixes were chemically laden. Expert guidance was scarce. The earth's wisdom was being lost to convenience. We knew there had to be a better way.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#4ADE80] mb-3">The Journey: Staying Loyal to the Soil</h3>
                  <p>
                    We built our foundation on a single principle: <strong>Stay Loyal to the Soil.</strong> This meant hand-selecting premium plants from regenerative greenhouses. Crafting organic soil mixes that mimic forest ecosystems. Sourcing sustainable essentials without compromise. Every step—from sourcing to delivery—reflects a deep commitment to nature and to you.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#4ADE80] mb-3">The Solution: What We Deliver</h3>
                  <p>
                    Today, Whole Lot of Nature serves plant lovers across India with:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mt-3">
                    <li><strong>Premium Plants:</strong> Pest-free, health-checked, air-purifying indoors and hardy outdoors</li>
                    <li><strong>Handcrafted Soil Mixes:</strong> Organic blends enriched with forest-floor nutrients and beneficial microbes</li>
                    <li><strong>Sustainable Essentials:</strong> Natural fertilizers, organic pest controls, and eco-friendly gardening tools</li>
                    <li><strong>Expert Guidance:</strong> Care guides, AI-powered plant advice, and personalized support from our growing team</li>
                    <li><strong>Aquatic & Terrarium Ecosystems:</strong> Complete setups for water gardens and miniature worlds</li>
                  </ul>
                </div>

                <div className="border-l-4 border-[#4ADE80] pl-6 italic text-white/90 bg-[#2E7D32]/10 p-4 rounded">
                  <p>
                    &ldquo;Every plant you nurture is a promise to the planet. Every mix we craft honors the earth beneath. This is not just business—it's a movement back to nature's wisdom.&rdquo;
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#4ADE80] mb-3">The Vision: What's Growing Next</h3>
                  <p>
                    We're expanding services nationwide with landscaping consultations, pond builds, aquascaping workshops, and terrarium design experiences. Our goal: help every home, office, and garden become a thriving ecosystem. We're building a movement where plants become family, gardens turn into sanctuaries, and soil stays forever loyal.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Image column placeholder - using a gradient box for now if no image */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-[#1e3a28] to-[#0F1E11] border border-white/10 flex items-center justify-center group"
            >
               <div className="absolute inset-0 bg-[url('/images/backgrounds/leaf-pattern.png')] opacity-20 mix-blend-overlay" />
               <div className="text-center p-8">
                  <Sun className="h-20 w-20 text-[#4ADE80]/20 mx-auto mb-6" />
                  <h3 className="text-2xl font-display font-bold text-white mb-2">Our Mission in Action</h3>
                  <p className="text-emerald-100/60">Sustainable growth, rooted in purpose</p>
               </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Upcoming Services */}
      <div className="py-24 border-y border-white/5 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">What&apos;s arriving in Bangalore</h2>
            <p className="text-emerald-100/70 max-w-2xl mx-auto">
              Landscaping, pond builds, and aquascaping consultations are opening soon—built for Bengaluru&apos;s light, water, and apartment codes.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[{
              title: 'Landscaping',
              desc: 'Courtyard and villa makeovers with climate-smart planting palettes and drip-ready beds.'
            }, {
              title: 'Pond & Water Gardens',
              desc: 'Balcony or backyard ponds with hardy aquatics, biofilters, and low-splash circulation.'
            }, {
              title: 'Aquascaping',
              desc: 'Glass tanks styled with submerged greens, hardscape curation, and CO₂-friendly plant lists.'
            }].map((item) => (
              <div key={item.title} className="p-6 rounded-2xl bg-[#0a160c]/80 border border-white/10 shadow-lg shadow-[#0d3512]/40">
                <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-emerald-100/70 leading-relaxed text-sm">{item.desc}</p>
                <div className="mt-4 inline-flex items-center gap-2 text-[#4ADE80] text-sm font-semibold">
                  <span>Coming Soon</span>
                  <span className="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Values Grid */}
      <div className="py-24 bg-[#0a160c]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">Why Choose Us?</h2>
            <p className="text-emerald-100/60 max-w-2xl mx-auto">We do not just sell plants; we cultivate relationships with nature.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/5 border border-white/5 rounded-2xl p-8 hover:bg-white/10 transition-colors group"
              >
                <div className="h-12 w-12 rounded-xl bg-[#2E7D32]/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <value.icon className="h-6 w-6 text-[#4ADE80]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                <p className="text-emerald-100/60 leading-relaxed text-sm">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ moved here */}
      <div className="bg-[#0D1B0F] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FAQSection
            faqs={legacyFaqs}
            title="Frequently Asked Questions"
            subtitle="Everything you need to know about our products, shipping, care, and services"
            className="pb-8"
          />
          <div className="py-8 border-t border-white/5 text-center">
            <p className="text-emerald-100/70 mb-4">Didn't find your answer?</p>
            <Link href="/contact" className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-[#4ADE80] text-[#4ADE80] font-semibold hover:bg-[#4ADE80]/10 transition-all">
              Contact Our Team
            </Link>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#2E7D32]/20 via-transparent to-[#2E7D32]/20" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">Ready to Join the Movement?</h2>
          <p className="text-xl text-emerald-100/80 mb-10 leading-relaxed">
            Thousands of plant lovers across India have transformed their spaces with Whole Lot of Nature. Your botanical journey starts here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop" className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-[#4ADE80] text-[#0D1B0F] font-bold hover:bg-[#2E7D32] hover:text-white transition-all transform hover:scale-105">
              Explore Plants & Products
            </Link>
            <Link href="/contact" className="inline-flex items-center justify-center px-8 py-4 rounded-full border border-white/20 bg-white/5 text-white font-bold hover:bg-white/10 transition-all">
              Get Expert Guidance
            </Link>
          </div>
          <div className="mt-12 pt-12 border-t border-white/10">
            <p className="text-emerald-100/70 mb-4">Have questions? We're here to help.</p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center text-center sm:text-left">
              <div>
                <p className="text-sm text-emerald-100/60 uppercase tracking-wider mb-1">Email</p>
                <a href="mailto:hello@wholelotofnature.com" className="text-[#4ADE80] hover:text-[#2E7D32] font-semibold underline">
                  hello@wholelotofnature.com
                </a>
              </div>
              <div>
                <p className="text-sm text-emerald-100/60 uppercase tracking-wider mb-1">Support</p>
                <a href="mailto:support@wholelotofnature.com" className="text-[#4ADE80] hover:text-[#2E7D32] font-semibold underline">
                  support@wholelotofnature.com
                </a>
              </div>
              <div>
                <p className="text-sm text-emerald-100/60 uppercase tracking-wider mb-1">Bulk & Wholesale</p>
                <a href="mailto:grow@wholelotofnature.com" className="text-[#4ADE80] hover:text-[#2E7D32] font-semibold underline">
                  grow@wholelotofnature.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social Media & Community */}
      <YouTubeShowcase />
      <InstagramFeed />
    </div>
  );
}
