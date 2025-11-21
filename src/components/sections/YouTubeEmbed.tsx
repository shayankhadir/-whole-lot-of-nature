'use client';





import { motion } from 'framer-motion';

export default function YouTubeEmbed() {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-green-50">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 antialiased">
            Watch Our Latest Video
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto antialiased">
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
