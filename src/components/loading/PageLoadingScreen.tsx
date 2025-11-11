'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useLoading } from '@/contexts/LoadingContext';

export default function PageLoadingScreen() {
  const { isLoading, progress } = useLoading();

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="loading-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-[#1a4d2e] to-[#0f3620]"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="flex flex-col items-center justify-center gap-8"
          >
            {/* Logo */}
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-center"
            >
              <Image
                src="/Whole lot of nature logo.png"
                alt="Whole Lot of Nature"
                width={120}
                height={120}
                priority
                className="drop-shadow-lg"
              />
            </motion.div>

            {/* Loading Bar Container */}
            <div className="w-64 flex flex-col items-center gap-3">
              {/* Bar Background */}
              <div className="w-full h-1.5 bg-gray-300 rounded-full overflow-hidden shadow-lg">
                {/* Animated Bar */}
                <motion.div
                  className="h-full bg-white rounded-full origin-left"
                  animate={{ scaleX: progress / 100 }}
                  transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                />
              </div>

              {/* Progress Text */}
              <motion.p
                className="text-white text-sm font-medium tracking-wide"
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {Math.round(progress)}%
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
