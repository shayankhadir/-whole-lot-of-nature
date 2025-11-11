'use client';

import { motion } from 'framer-motion';

const testimonials = [
  { id: 1, name: 'Emma', text: 'Love my new soil mix! My plants are thriving.', image: '/images/testimonials/emma.jpg', rating: 5 },
  { id: 2, name: 'Liam', text: 'Fast shipping and great customer service.', image: '/images/testimonials/liam.jpg', rating: 5 },
  { id: 3, name: 'Ava', text: 'Eco-friendly packaging is a big plus for me.', image: '/images/testimonials/ava.jpg', rating: 4 },
];

export default function Testimonials() {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-semibold mb-6">Loved by Plant Parents</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.blockquote key={t.id} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="p-6 bg-gray-50 rounded-2xl">
              <div className="flex items-center gap-4 mb-4">
                <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <strong className="block">{t.name}</strong>
                  <span className="text-sm text-gray-500">{Array.from({ length: t.rating }).map(() => '⭐').join('')}</span>
                </div>
              </div>
              <p className="text-gray-700">{t.text}</p>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}