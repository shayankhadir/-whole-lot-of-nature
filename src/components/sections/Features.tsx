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
    <section className="py-16 bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-3">
            Why Choose Whole Lot of Nature
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
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
              className="text-center group bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all border border-green-100 hover:border-green-200"
            >
              <div className="flex justify-center mb-6">
                <div className="bg-green-50 p-5 rounded-2xl ring-1 ring-green-100 shadow-inner">
                  <feature.icon className="w-10 h-10 text-green-700" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Additional value proposition */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-10 bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 text-center text-white"
        >
          <h3 className="text-xl font-semibold mb-3">
            Trusted by 10,000+ Plant Lovers Across India
          </h3>
          <p className="text-green-100 mb-4 max-w-2xl mx-auto text-sm sm:text-base">
            Join our growing community of gardening enthusiasts. From beginners to experts, 
            we help everyone create their perfect green space.
          </p>
          <div className="flex flex-wrap justify-center items-center space-x-8 text-green-100">
            <div className="text-center">
              <div className="text-2xl font-bold">10K+</div>
              <div className="text-sm">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">500+</div>
              <div className="text-sm">Plant Varieties</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">50+</div>
              <div className="text-sm">Cities Served</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">99%</div>
              <div className="text-sm">Satisfaction Rate</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}