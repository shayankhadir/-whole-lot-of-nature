'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Phone, 
  MessageCircle, 
  BookOpen, 
  ShoppingCart,
  Users,
  Gift
} from 'lucide-react';

const quickActions = [
  {
    icon: ShoppingCart,
    title: "Start Shopping",
    description: "Browse our complete collection",
    href: "/shop",
    color: "bg-[#2E7D32] hover:bg-[#2E7D32]",
    textColor: "text-white"
  },
  {
    icon: Phone,
    title: "Get Support",
    description: "Talk to our plant experts",
    href: "tel:+911234567890",
    color: "bg-primary-600 hover:bg-primary-700",
    textColor: "text-white"
  },
  {
    icon: Gift,
    title: "Gift Cards",
    description: "Perfect for plant lovers",
    href: "/gift-cards",
    color: "bg-primary-700 hover:bg-primary-800",
    textColor: "text-white"
  }
];

export default function QuickActions() {
  return (
    <section className="py-16 bg-[#0d3512]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#E8F5E9] mb-4 antialiased">
            Ready to Start Your Garden Journey?
          </h2>
          <p className="text-lg text-[#daf2d0] max-w-2xl mx-auto antialiased">
            Whether you&apos;re a beginner or expert gardener, we&apos;re here to help you every step of the way.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link href={action.href}>
                <div className={`${action.color} ${action.textColor} rounded-xl p-6 text-center hover:scale-105 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl`}>
                  <div className="flex justify-center mb-4">
                    <action.icon className="w-12 h-12" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 antialiased">
                    {action.title}
                  </h3>
                  <p className="text-sm opacity-90">
                    {action.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Additional CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 bg-[#12501a] rounded-2xl p-8 text-center border border-[#2E7D32]/30"
        >
          <div className="flex justify-center items-center mb-4">
            <Users className="w-8 h-8 text-[#66BB6A] mr-2" />
            <MessageCircle className="w-8 h-8 text-[#86efbe]" />
          </div>
          <h3 className="text-2xl font-bold text-[#E8F5E9] mb-4 antialiased">
            Join Our Plant Community
          </h3>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            Connect with fellow gardening enthusiasts, share your plant journey, 
            and get personalized advice from our experts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/community">
              <button className="px-6 py-3 bg-[#2E7D32] text-white font-medium rounded-lg hover:bg-[#2E7D32] transition-colors">
                Join Community
              </button>
            </Link>
            <Link href="https://wa.me/911234567890">
              <button className="px-6 py-3 bg-white text-[#2E7D32] border-2 border-[#2E7D32] font-medium rounded-lg hover:bg-[#2E7D32] transition-colors">
                WhatsApp Support
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}