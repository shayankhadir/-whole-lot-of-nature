'use client';

import { useProducts } from '@/lib/hooks/useProducts';
import { motion } from 'framer-motion';
import HeroSection from '@/components/sections/HeroSection';
import PromoBanners from '@/components/sections/PromoBanners';
import ProductCarousel from '@/components/sections/ProductCarousel';
import ComboPacks from '@/components/sections/ComboPacks';
import Testimonials from '@/components/sections/Testimonials';
import BlogTeaser from '@/components/sections/BlogTeaser';
import NewsletterSection from '@/components/sections/NewsletterSection';

export default function Home() {
  const { data: products } = useProducts();

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Scattered SVG Icons Background */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        {/* Top Left */}
        <motion.svg
          width="24" height="24" 
          className="absolute left-8 top-20 text-primary-200"
          animate={{ rotate: 360, y: [0, -10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          viewBox="0 0 24 24" fill="none"
        >
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
          <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="2"/>
        </motion.svg>

        {/* Top Right */}
        <motion.svg
          width="20" height="20"
          className="absolute right-16 top-32 text-gray-300"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          viewBox="0 0 24 24" fill="currentColor"
        >
          <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z"/>
        </motion.svg>

        {/* Middle Left */}
        <motion.svg
          width="28" height="28"
          className="absolute left-20 top-1/2 text-primary-100"
          animate={{ y: [0, -15, 0], rotate: [0, -45, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          viewBox="0 0 24 24" fill="none"
        >
          <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 13L13.5 7.5C13.1 6.6 12.2 6 11.2 6H6V8H11.2L12.7 12.5L8 17V22H10V18.5L14 14.5L15.5 19H18L15 13L21 9Z" fill="currentColor"/>
        </motion.svg>

        {/* Center */}
        <motion.svg
          width="32" height="32"
          className="absolute left-1/2 top-1/3 text-gray-200 -translate-x-1/2"
          animate={{ rotate: [0, 360], scale: [1, 0.8, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          viewBox="0 0 24 24" fill="none"
        >
          <path d="M12 3L14 10L21 12L14 14L12 21L10 14L3 12L10 10L12 3Z" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.3"/>
        </motion.svg>

        {/* Right Side */}
        <motion.svg
          width="26" height="26"
          className="absolute right-8 top-2/3 text-primary-200"
          animate={{ x: [0, 10, 0], rotate: [0, 90, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          viewBox="0 0 24 24" fill="none"
        >
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" strokeWidth="2"/>
        </motion.svg>

        {/* Bottom Left */}
        <motion.svg
          width="22" height="22"
          className="absolute left-12 bottom-32 text-gray-300"
          animate={{ y: [0, -8, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          viewBox="0 0 24 24" fill="none"
        >
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke="currentColor" strokeWidth="2"/>
          <polyline points="7.5,10 12,15 16.5,10" stroke="currentColor" strokeWidth="2"/>
        </motion.svg>

        {/* Bottom Right */}
        <motion.svg
          width="30" height="30"
          className="absolute right-20 bottom-20 text-primary-100"
          animate={{ rotate: [0, -360], x: [0, -5, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          viewBox="0 0 24 24" fill="none"
        >
          <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.2"/>
          <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2"/>
          <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2"/>
        </motion.svg>

        {/* Additional scattered icons */}
        <motion.svg
          width="18" height="18"
          className="absolute left-1/4 top-16 text-gray-200"
          animate={{ rotate: [0, 180, 0], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          viewBox="0 0 24 24" fill="currentColor"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z"/>
        </motion.svg>

        <motion.svg
          width="24" height="24"
          className="absolute right-1/4 bottom-1/3 text-primary-200"
          animate={{ y: [0, -12, 0], scale: [0.8, 1, 0.8] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          viewBox="0 0 24 24" fill="none"
        >
          <polygon points="12,2 15.09,8.26 22,9 17,14 18.18,21 12,17.77 5.82,21 7,14 2,9 8.91,8.26" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.1"/>
        </motion.svg>
      </div>
      {/* Main Content */}
      <HeroSection />
      <PromoBanners />
      <ProductCarousel />
      <ComboPacks />
      <Testimonials />
      <BlogTeaser />
      <NewsletterSection />
      {/* Example CSS for floating animation */}
      <style jsx global>{`
        @keyframes float-slow {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-30px); }
          100% { transform: translateY(0px); }
        }
        @keyframes float-fast {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-50px); }
          100% { transform: translateY(0px); }
        }
        @keyframes float-medium {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-40px); }
          100% { transform: translateY(0px); }
        }
        .animate-float-slow { animation: float-slow 8s ease-in-out infinite; }
        .animate-float-fast { animation: float-fast 5s ease-in-out infinite; }
        .animate-float-medium { animation: float-medium 6s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
