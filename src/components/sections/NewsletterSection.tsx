'use client';

import { motion } from 'framer-motion';

export default function NewsletterSection() {
  return (
    <section className="bg-gradient-to-br from-green-900 to-green-800 py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center text-white"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 font-serif">
            Stay Connected with Nature
          </h2>
          <p className="text-lg text-green-100 mb-8">
            Join our community of plant lovers! Subscribe to receive gardening tips,
            exclusive offers, and sustainable living inspiration.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="px-8 py-3 bg-green-500 text-white rounded-full font-semibold hover:bg-green-400 transition-colors duration-300"
            >
              Subscribe
            </motion.button>
          </form>
          <p className="mt-4 text-sm text-green-200 opacity-80">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </motion.div>
      </div>
    </section>
  );
}