'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Globe, FileText, Layout, ShoppingBag, Users, BookOpen } from 'lucide-react';

const siteMap = [
  {
    category: 'Main Pages',
    icon: Globe,
    links: [
      { name: 'Home', path: '/', status: 'Live' },
      { name: 'Shop', path: '/shop', status: 'Live' },
      { name: 'About Us', path: '/about', status: 'Live' },
      { name: 'Contact', path: '/contact', status: 'Live' },
      { name: 'Blog', path: '/blog', status: 'Live' },
    ]
  },
  {
    category: 'Shop Pages',
    icon: ShoppingBag,
    links: [
      { name: 'All Products', path: '/shop', status: 'Live' },
      { name: 'Combos', path: '/combos', status: 'Live' },
      { name: 'Cart', path: '/cart', status: 'Live' },
      { name: 'Checkout', path: '/checkout', status: 'Live' },
      { name: 'Wishlist', path: '/wishlist', status: 'Live' },
    ]
  },
  {
    category: 'User Pages',
    icon: Users,
    links: [
      { name: 'My Account', path: '/account', status: 'Live' },
      { name: 'Login', path: '/login', status: 'Live' },
      { name: 'Sign Up', path: '/signup', status: 'Live' },
      { name: 'Track Order', path: '/track-order', status: 'Live' },
    ]
  },
  {
    category: 'Legal & Support',
    icon: FileText,
    links: [
      { name: 'Privacy Policy', path: '/privacy-policy', status: 'Live' },
      { name: 'Terms & Conditions', path: '/terms', status: 'Live' },
      { name: 'Refund Policy', path: '/refund-policy', status: 'Live' },
      { name: 'FAQ', path: '/faq', status: 'Live' },
    ]
  },
  {
    category: 'Admin & Agents',
    icon: Layout,
    links: [
      { name: 'Admin Dashboard', path: '/admin', status: 'Protected' },
      { name: 'Growth Agent', path: '/admin/growth', status: 'Protected' },
      { name: 'Blog Agent', path: '/blog-agent', status: 'Protected' },
      { name: 'Site Map (This Page)', path: '/admin/pages', status: 'Protected' },
    ]
  }
];

export default function AdminPagesView() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link 
            href="/admin"
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold font-display">Website Pages Overview</h1>
            <p className="text-white/90">A complete map of all pages in your application.</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {siteMap.map((section, idx) => (
            <motion.div
              key={section.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-[#2E7D32]/20 text-[#4ADE80]">
                  <section.icon className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-semibold">{section.category}</h2>
              </div>

              <div className="space-y-3">
                {section.links.map((link) => (
                  <Link
                    key={link.path}
                    href={link.path}
                    target="_blank"
                    className="group flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-transparent hover:border-[#2E7D32]/30 transition-all"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium group-hover:text-[#4ADE80] transition-colors">
                        {link.name}
                      </span>
                      <span className="text-xs text-white/40 font-mono">
                        {link.path}
                      </span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full border ${
                      link.status === 'Live' 
                        ? 'bg-[#2E7D32]/20 text-[#4ADE80] border-[#2E7D32]/30' 
                        : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                    }`}>
                      {link.status}
                    </span>
                  </Link>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
