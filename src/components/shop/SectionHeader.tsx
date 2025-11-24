'use client';

import { motion } from 'framer-motion';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
}

export default function SectionHeader({ 
  title, 
  subtitle, 
  centered = true 
}: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      className={`mb-12 ${centered ? 'text-center' : 'text-left'}`}
    >
      {/* Main Title */}
      <h2 className="font-montserrat text-[clamp(2rem,5vw,2.5rem)] font-bold text-white tracking-wide leading-tight antialiased">
        {title}
      </h2>

      {/* Decorative Emerald Underline */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: '160px' }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
        className={`h-[3px] bg-gradient-to-r from-[#2E7D32] via-[#66BB6A] to-[#2E7D32] mt-4 ${
          centered ? 'mx-auto' : ''
        }`}
      />

      {/* SVG Leaf Decorations */}
      <div className="relative mt-4">
        {/* Left Leaf */}
        <motion.svg
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 0.15, x: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="absolute left-0 top-0 w-16 h-16 text-[#2E7D32] hidden md:block"
          style={{ transform: centered ? 'translateX(-100%)' : 'translateX(-120%)' }}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v18m0 0c-3.866 0-7-3.134-7-7s3.134-7 7-7m0 14c3.866 0 7-3.134 7-7s-3.134-7-7-7"
          />
        </motion.svg>

        {/* Right Leaf */}
        <motion.svg
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 0.15, x: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="absolute right-0 top-0 w-16 h-16 text-[#66BB6A] hidden md:block"
          style={{ transform: centered ? 'translateX(100%) scaleX(-1)' : 'translateX(120%) scaleX(-1)' }}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v18m0 0c-3.866 0-7-3.134-7-7s3.134-7 7-7m0 14c3.866 0 7-3.134 7-7s-3.134-7-7-7"
          />
        </motion.svg>
      </div>

      {/* Subtitle */}
      {subtitle && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.9 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="font-inter text-base md:text-lg text-white/90 mt-6 max-w-2xl leading-relaxed antialiased"
          style={{ margin: centered ? '1.5rem auto 0' : '1.5rem 0 0' }}
        >
          {subtitle}
        </motion.p>
      )
    </motion.div>
  );
}
