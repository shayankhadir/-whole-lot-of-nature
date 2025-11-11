'use client';

/**
 * Team Page - SEO Optimized
 * Meet the Whole Lot of Nature Team
 * Keywords: organic farming experts, horticulturists, sustainable agriculture leaders
 */

import React from 'react';
import { motion } from 'framer-motion';
import TeamMemberCard, { TeamMember } from '@/components/content/TeamMemberCard';

const teamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Priya Sharma',
    role: 'Founder & CEO',
    bio: 'With 15+ years in organic agriculture and a passion for sustainable living, Priya founded Whole Lot of Nature to make organic gardening accessible to every Indian. Her vision drives our mission.',
    expertise: ['Organic Farming', 'Horticulture', 'Sustainable Agriculture', 'Business Strategy'],
    achievements: [
      'Founded Whole Lot of Nature in 2020',
      '10,000+ happy customers across India',
      'Certified in Organic Farming from Bangalore University',
      'Featured in Agricultural magazines and media',
    ],
    social: {
      linkedin: 'https://linkedin.com',
      instagram: 'https://instagram.com',
    },
  },
  {
    id: '2',
    name: 'Rajesh Kumar',
    role: 'Head of Horticulture',
    bio: 'A seasoned horticulturist with 20 years of experience in seed selection and plant cultivation. Rajesh ensures every product meets our rigorous quality standards.',
    expertise: ['Plant Science', 'Seed Selection', 'Quality Assurance', 'Cultivation Techniques'],
    achievements: [
      'Over 500 organic plant varieties in collection',
      'Expert in heirloom and rare seed preservation',
      'Regular contributor to gardening publications',
      'Trained 100+ farmers in organic practices',
    ],
    social: {
      linkedin: 'https://linkedin.com',
    },
  },
  {
    id: '3',
    name: 'Anjali Desai',
    role: 'Sustainability Officer',
    bio: 'Anjali leads our environmental initiatives and ensures every decision aligns with our sustainability mission. She champions eco-friendly practices throughout our operations.',
    expertise: ['Environmental Science', 'Sustainability', 'Eco-Design', 'Community Outreach'],
    achievements: [
      'Carbon-neutral operations achieved in 2023',
      'Eco-packaging initiative reducing 40% plastic waste',
      'Led partnerships with 50+ sustainable farms',
      'Certified Environmental Specialist',
    ],
    social: {
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
    },
  },
  {
    id: '4',
    name: 'Vikram Singh',
    role: 'Head of Customer Success',
    bio: 'With a customer-first approach, Vikram ensures every gardener gets the support they need. He oversees our growing community of organic gardening enthusiasts.',
    expertise: ['Customer Service', 'Community Building', 'Customer Education', 'Support Systems'],
    achievements: [
      '95% customer satisfaction rating',
      'Built thriving online gardening community (5,000+ members)',
      'Created comprehensive gardening guides',
      'Expert in customer relationship management',
    ],
    social: {
      linkedin: 'https://linkedin.com',
      instagram: 'https://instagram.com',
    },
  },
];

export default function TeamPage() {
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
              Meet Our Team 👥
            </h1>
            <p className="text-xl md:text-2xl text-green-700 font-semibold mb-2">
              Experts Dedicated to Organic Gardening
            </p>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Our passionate team of horticulturists, sustainability experts, and gardening enthusiasts
              work tirelessly to bring you the best organic seeds and gardening solutions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {teamMembers.map((member, idx) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <TeamMemberCard member={member} variant="card" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-green-50 border-y-4 border-green-600 py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-black mb-12 text-center"
          >
            What We Stand For
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: '🌱',
                title: 'Excellence in Quality',
                description:
                  'We maintain the highest standards in every product and every interaction with our customers.',
              },
              {
                icon: '🌍',
                title: 'Environmental Responsibility',
                description:
                  'We are committed to sustainable practices that protect our planet for future generations.',
              },
              {
                icon: '💚',
                title: 'Community Impact',
                description:
                  'We believe in creating positive change at grassroots level by empowering farmers and gardeners.',
              },
              {
                icon: '📚',
                title: 'Continuous Learning',
                description:
                  'Our team stays updated with latest organic farming techniques and shares knowledge freely.',
              },
            ].map((value, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white border-2 border-black rounded-lg p-6"
              >
                <p className="text-4xl mb-3">{value.icon}</p>
                <h3 className="text-xl font-bold text-black mb-2">{value.title}</h3>
                <p className="text-gray-700">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Careers CTA */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 border-t-4 border-green-900 py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Want to Join Our Mission?
            </h2>
            <p className="text-xl text-green-100 mb-8">
              We're always looking for passionate individuals who share our commitment to organic gardening
              and sustainability.
            </p>
            <a
              href="mailto:careers@wholelotofnature.com"
              className="inline-block bg-white text-green-700 px-8 py-4 rounded font-bold text-lg hover:bg-green-50 transition-colors"
            >
              Explore Career Opportunities →
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
