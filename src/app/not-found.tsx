'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

/**
 * Not Found (404) Page
 * 
 * Displays when a user navigates to a non-existent page.
 * Features:
 * - Large centered 404 number
 * - Descriptive message
 * - CTA button back to homepage
 * - Dark theme with nature imagery
 * - Responsive design
 */
export default function NotFound() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const numberVariants = {
    hidden: { opacity: 0, scale: 0.5, rotateX: 90 },
    visible: {
      opacity: 1,
      scale: 1,
      rotateX: 0,
      transition: { duration: 0.8, type: 'spring', stiffness: 100 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 flex items-center justify-center relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#2E7D32] rounded-full mix-blend-multiply filter blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#2E7D32] rounded-full mix-blend-multiply filter blur-3xl" />
      </div>

      {/* Nature Background Image (Optional) */}
      <div className="absolute inset-0 opacity-5 z-0">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M30 0c16.569 0 30 13.431 30 30 0 16.569-13.431 30-30 30C13.431 60 0 46.569 0 30 0 13.431 13.431 0 30 0z" fill="none" stroke="rgba(34,197,94,0.1)" stroke-width="1"/%3E%3C/svg%3E")',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Content Container */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-2xl"
      >
        {/* Large 404 Number */}
        <motion.div
          variants={numberVariants}
          className="mb-8 sm:mb-12 perspective"
        >
          <h1
            className="text-9xl sm:text-10xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600 select-none drop-shadow-2xl antialiased"
            style={{
              textShadow: '0 10px 40px rgba(34, 197, 94, 0.3)',
              letterSpacing: '-0.02em',
            }}
          >
            404
          </h1>
        </motion.div>

        {/* Heading */}
        <motion.h2
          variants={itemVariants}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight antialiased"
        >
          Page Not Found
        </motion.h2>

        {/* Description */}
        <motion.p
          variants={itemVariants}
          className="text-xl sm:text-2xl text-gray-300 mb-8 leading-relaxed antialiased"
        >
          Something went wrong, or the page you're looking for doesn't exist.
          Let's get you back on track!
        </motion.p>

        {/* Additional Info */}
        <motion.p
          variants={itemVariants}
          className="text-lg text-gray-400 mb-10 italic antialiased"
        >
          It seems our digital garden has a gap. Let's plant you back to the right place! 🌱
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center"
        >
          {/* Back to Home Button */}
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: '#15803d' }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#2E7D32] hover:bg-[#2E7D32] text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 text-lg shadow-lg hover:shadow-xl antialiased"
            >
              Back to Homepage
            </motion.button>
          </Link>

          {/* Shop Button */}
          <Link href="/shop">
            <motion.button
              whileHover={{ scale: 1.05, borderColor: '#66BB6A' }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-gray-400 hover:border-[#2E7D32] text-gray-300 hover:text-[#2E7D32] font-bold py-3 px-8 rounded-lg transition-all duration-300 text-lg antialiased"
            >
              Continue Shopping
            </motion.button>
          </Link>
        </motion.div>

        {/* Help Text */}
        <motion.div
          variants={itemVariants}
          className="mt-12 pt-8 border-t border-gray-700"
        >
          <p className="text-gray-400 text-sm mb-4">
            Need help? Visit our support resources:
          </p>
          <div className="flex justify-center gap-6">
            <Link
              href="/contact"
              className="text-[#2E7D32] hover:text-[#2E7D32] transition-colors duration-300 underline"
            >
              Contact Us
            </Link>
            <Link
              href="/help"
              className="text-[#2E7D32] hover:text-[#2E7D32] transition-colors duration-300 underline"
            >
              Help Center
            </Link>
            <Link
              href="/faq"
              className="text-[#2E7D32] hover:text-[#2E7D32] transition-colors duration-300 underline"
            >
              FAQ
            </Link>
          </div>
        </motion.div>
      </motion.div>

      {/* Floating Elements for Visual Interest */}
      <div className="absolute bottom-10 left-10 w-16 h-16 sm:w-24 sm:h-24 opacity-10 z-0">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="w-full h-full border-2 border-[#2E7D32] rounded-full"
        />
      </div>

      <div className="absolute top-20 right-20 w-12 h-12 sm:w-16 sm:h-16 opacity-10 z-0">
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="w-full h-full border-2 border-[#2E7D32] rounded-lg"
        />
      </div>
    </div>
  );
}
