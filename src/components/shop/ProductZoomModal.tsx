'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ProductZoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  productName: string;
}

export function ProductZoomModal({ isOpen, onClose, imageSrc, productName }: ProductZoomModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute top-6 right-6 text-white/80 hover:text-white transition p-3 rounded-full bg-black/50 hover:bg-black/70 z-10"
            aria-label="Close zoom"
          >
            <X className="w-6 h-6" />
          </button>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full h-full max-w-6xl max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={imageSrc}
              alt={productName}
              fill
              className="object-contain"
              priority
              quality={100}
            />
          </motion.div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 text-sm">
            Press ESC to close • Click outside to exit
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
