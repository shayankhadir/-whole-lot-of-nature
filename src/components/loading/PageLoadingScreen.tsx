'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useLoading } from '@/contexts/LoadingContext';

export default function PageLoadingScreen() {
  const { isLoading } = useLoading();

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="loading-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#030a06]"
        >
          <div className="relative flex flex-col items-center gap-8">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <Image
                src="/Whole lot of nature logo.png"
                alt="Whole Lot of Nature"
                width={100}
                height={100}
                priority
                className="opacity-90"
              />
              {/* Subtle pulse effect behind logo */}
              <motion.div
                className="absolute inset-0 rounded-full bg-emerald-500/20 blur-2xl"
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>

            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500/80 animate-bounce [animation-delay:-0.3s]" />
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500/80 animate-bounce [animation-delay:-0.15s]" />
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500/80 animate-bounce" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
