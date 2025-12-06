'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

// Metadata is inherited from root layout, but we ensure the page has a title
// The root layout already includes lang="en" and proper metadata

/**
 * Error Boundary Component
 * 
 * Catches errors in the app and displays a user-friendly error page.
 * Automatically includes proper HTML metadata through root layout.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console for debugging
    console.error('Application error:', error);
  }, [error]);

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 flex items-center justify-center relative overflow-hidden px-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <motion.div
        className="relative z-10 max-w-2xl w-full text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Error Icon */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-500/20 backdrop-blur-sm border border-red-500/30">
            <svg
              className="w-12 h-12 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </motion.div>

        {/* Error Title */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-7xl font-bold text-white mb-6 antialiased"
        >
          Oops!
        </motion.h1>

        {/* Error Message */}
        <motion.p
          variants={itemVariants}
          className="text-xl md:text-2xl text-gray-300 mb-4 antialiased"
        >
          Something went wrong
        </motion.p>

        <motion.p
          variants={itemVariants}
          className="text-base md:text-lg text-gray-100 mb-8 max-w-md mx-auto antialiased"
        >
          We encountered an unexpected error. Don&apos;t worry, our team has been notified and we&apos;re working on it.
        </motion.p>

        {/* Error Details (for development) */}
        {process.env.NODE_ENV === 'development' && (
          <motion.div
            variants={itemVariants}
            className="mb-8 p-4 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 text-left max-w-xl mx-auto"
          >
            <p className="text-sm text-red-400 font-mono break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-xs text-gray-500 mt-2">
                Error ID: {error.digest}
              </p>
            )}
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button
            onClick={reset}
            className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-primary-500/50 hover:scale-105"
          >
            Try Again
          </button>
          
          <Link
            href="/"
            className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-semibold transition-all duration-300 border border-gray-700 hover:border-gray-600"
          >
            Go Home
          </Link>
        </motion.div>

        {/* Help Text */}
        <motion.p
          variants={itemVariants}
          className="mt-8 text-sm text-gray-500"
        >
          Need help?{' '}
          <Link
            href="/contact"
            className="text-primary-400 hover:text-primary-300 underline"
          >
            Contact Support
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}
