'use client';





import { motion } from 'framer-motion';
import Image from 'next/image';

export default function YouTubeEmbed() {
  return (
    <section className="relative py-24 bg-[#0d3512] overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/backgrounds/ai-generated-lush-tropical-green-leaves-background-photo.jpg"
          alt="Leaf backdrop"
          fill
          className="object-cover opacity-20"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#010904]/85 via-[#0d3512]/85 to-[#010904]/90" />
      </div>
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-5xl md:text-6xl font-bold text-[#E8F5E9] mb-6 antialiased">
            Watch Our Latest Video
          </h2>
          <p className="text-xl text-[#daf2d0] max-w-2xl mx-auto antialiased">
            Discover plant care tips and gardening inspiration
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative w-full rounded-2xl overflow-hidden shadow-2xl"
          style={{ paddingBottom: '56.25%' }}
        >
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src="https://www.youtube.com/embed/_KyLAP__E5M"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-10"
        >
          <a
            href="https://www.youtube.com/@wholelotofnature?sub_confirmation=1"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3 bg-primary-700 text-white border border-primary-700 rounded-none font-semibold hover:bg-white hover:text-primary-700 transition-all shadow-sm hover:shadow-md"
          >
            Subscribe to Our Channel
          </a>
        </motion.div>
      </div>
    </section>
  );
}
