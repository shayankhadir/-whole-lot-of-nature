'use client';

import { motion } from 'framer-motion';
import { 
  Truck, 
  Shield, 
  Headphones, 
  Leaf, 
  Award, 
  Clock,
  RefreshCw,
  Heart
} from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import BackgroundBeams, { BackgroundParticles } from '@/components/ui/BackgroundEffects';

const features = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "Free delivery on orders above ₹999 across India"
  },
  {
    icon: Leaf,
    title: "100% Organic",
    description: "Certified organic products with no harmful chemicals"
  },
  {
    icon: Shield,
    title: "7-Day Guarantee",
    description: "Replace damaged plants within 7 days, no questions asked"
  },
  {
    icon: Headphones,
    title: "Expert Support",
    description: "Get gardening advice from our plant experts"
  },
  {
    icon: Award,
    title: "Premium Quality",
    description: "Hand-picked products from trusted suppliers"
  },
  {
    icon: Clock,
    title: "Fast Delivery",
    description: "Quick delivery in 2-5 business days"
  },
  {
    icon: RefreshCw,
    title: "Sustainable",
    description: "Eco-friendly packaging and sustainable practices"
  },
  {
    icon: Heart,
    title: "Made with Love",
    description: "Each product is prepared with care and expertise"
  }
];

export default function Features() {
  return (
    <section className="relative py-16">
      {/* Animated Background Beams */}
      <BackgroundBeams />
      <BackgroundParticles />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-[clamp(2rem,4vw,2.625rem)] font-montserrat font-bold text-white mb-3 antialiased">
            Why Choose Whole Lot of Nature
          </h2>
          <p className="text-base sm:text-lg text-white/70 max-w-3xl mx-auto antialiased">
            Premium products, expert guidance, and exceptional service for your gardening journey
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <GlassCard tint="emerald" className="h-full text-center p-6">
                <div className="flex justify-center mb-6">
                  <div className="bg-[#2E7D32]/20 p-5 rounded-2xl ring-1 ring-[#2E7D32]/30 backdrop-blur-md">
                    <feature.icon className="w-10 h-10 text-[#66BB6A]" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 antialiased">
                  {feature.title}
                </h3>
                <p className="text-white/70 leading-relaxed">
                  {feature.description}
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Additional value proposition with Glass Effect */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-10"
        >
          <GlassCard tint="turquoise" className="p-8 text-center">
            <h3 className="text-xl font-semibold mb-3 text-white antialiased">
              Trusted by 10,000+ Plant Lovers Across India
            </h3>
            <p className="text-white/70 mb-6 max-w-2xl mx-auto text-sm sm:text-base antialiased">
              Join our growing community of gardening enthusiasts. From beginners to experts, 
              we help everyone create their perfect green space.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-white">
              <div className="text-center">
                <div className="text-[clamp(1.5rem,3vw,2rem)] font-bold text-[#66BB6A] antialiased">10K+</div>
                <div className="text-sm text-white/70">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-[clamp(1.5rem,3vw,2rem)] font-bold text-[#66BB6A] antialiased">500+</div>
                <div className="text-sm text-white/70">Plant Varieties</div>
              </div>
              <div className="text-center">
                <div className="text-[clamp(1.5rem,3vw,2rem)] font-bold text-[#66BB6A] antialiased">50+</div>
                <div className="text-sm text-white/70">Cities Served</div>
              </div>
              <div className="text-center">
                <div className="text-[clamp(1.5rem,3vw,2rem)] font-bold text-[#66BB6A] antialiased">99%</div>
                <div className="text-sm text-white/70">Satisfaction Rate</div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}