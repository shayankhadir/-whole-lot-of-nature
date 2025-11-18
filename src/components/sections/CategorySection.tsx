'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface CategorySectionProps {
  title: string;
  description: string;
  products: Product[];
  backgroundColor?: string;
  illustration?: string;
}

export default function CategorySection({
  title,
  description,
  products,
  backgroundColor = 'bg-[#2E7D32]',
  illustration,
}: CategorySectionProps) {
  return (
    <section className={`py-16 ${backgroundColor}`}>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Category Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl antialiased">
            {title}
          </h2>
          <p className="mt-4 text-xl text-gray-100 max-w-3xl mx-auto antialiased">
            {description}
          </p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link 
                href={`/shop/${product.id}`}
                className="group block"
              >
                <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900 antialiased">
                  {product.name}
                </h3>
                <p className="mt-1 text-sm font-medium text-gray-900">
                  ${product.price.toFixed(2)}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-12 text-center"
        >
          <Link
            href={`/shop?category=${title.toLowerCase()}`}
            className="inline-block rounded-md border border-transparent bg-[#2E7D32] px-8 py-3 text-center font-medium text-white hover:bg-[#2E7D32] transition-colors duration-300"
          >
            View All {title}
          </Link>
        </motion.div>

        {/* Decorative Illustration */}
        {illustration && (
          <div className="absolute right-0 top-0 -z-10 opacity-10">
            <Image
              src={illustration}
              alt=""
              width={400}
              height={400}
              className="object-contain"
            />
          </div>
        )}
      </div>
    </section>
  );
}