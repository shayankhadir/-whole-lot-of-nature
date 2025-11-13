'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Sparkles, ArrowRight, Leaf, ShieldCheck } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-50 via-white to-primary-50/30">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating orbs */}
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-primary-400/20 rounded-full blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl"
          animate={{
            x: [0, -40, 0],
            y: [0, 40, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-300/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-8">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100/80 backdrop-blur-md border border-primary-200/50 shadow-lg">
                <Sparkles className="w-4 h-4 text-primary-600" />
                <span className="text-sm font-semibold text-primary-900">Premium Plant Collection</span>
              </div>
            </motion.div>

            {/* Heading */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-4"
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight antialiased">
                Bring Nature{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-700">
                  Home
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-xl antialiased">
                Discover our curated collection of premium plants, organic soil, and eco-friendly gardening essentials.
              </p>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-wrap gap-6"
            >
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary-100/80 backdrop-blur-sm">
                  <ShieldCheck className="w-5 h-5 text-primary-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">100% Organic</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary-100/80 backdrop-blur-sm">
                  <Leaf className="w-5 h-5 text-primary-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">Expert Care Tips</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary-100/80 backdrop-blur-sm">
                  <Sparkles className="w-5 h-5 text-primary-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">Premium Quality</span>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Link href="/shop">
                <button className="group px-8 py-4 bg-primary-700/90 backdrop-blur-md text-white rounded-xl font-semibold shadow-xl hover:bg-primary-600/90 hover:scale-[1.02] transition-all duration-300 flex items-center gap-2 border border-primary-500/30">
                  Shop Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link href="/blog">
                <button className="px-8 py-4 bg-white/80 backdrop-blur-md text-primary-800 rounded-xl font-semibold shadow-lg hover:bg-white hover:scale-[1.02] transition-all duration-300 border border-primary-200/50">
                  Read Articles
                </button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-3 gap-6 pt-8 border-t border-primary-200/50"
            >
              <div>
                <div className="text-3xl font-bold text-primary-700 antialiased">500+</div>
                <div className="text-sm text-gray-600">Plant Varieties</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary-700 antialiased">10k+</div>
                <div className="text-sm text-gray-600">Happy Customers</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary-700 antialiased">100%</div>
                <div className="text-sm text-gray-600">Satisfaction</div>
              </div>
            </motion.div>
          </div>

          {/* Right content - Image grid */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="grid grid-cols-2 gap-4">
              {/* Main large image */}
              <motion.div
                className="col-span-2 row-span-2 relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-primary-100 to-primary-200"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="aspect-square relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-primary-600/20 backdrop-blur-3xl" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Leaf className="w-32 h-32 text-primary-300/50" />
                  </div>
                  <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-primary-200/30">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 antialiased">Premium Plants</h3>
                    <p className="text-gray-600">Hand-picked for your home</p>
                  </div>
                </div>
              </motion.div>

              {/* Small cards */}
              <motion.div
                className="rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-primary-200 to-primary-100 aspect-square relative"
                whileHover={{ scale: 1.05, rotate: 2 }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary-700 mb-1 antialiased">20%</div>
                    <div className="text-sm text-gray-600">First Order</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-primary-100 to-primary-200 aspect-square relative"
                whileHover={{ scale: 1.05, rotate: -2 }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Sparkles className="w-12 h-12 text-primary-600 mx-auto mb-2" />
                    <div className="text-sm font-semibold text-gray-700">Free Shipping</div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Floating badge */}
            <motion.div
              className="absolute -top-6 -right-6 bg-white/90 backdrop-blur-md rounded-full p-6 shadow-2xl border-4 border-primary-200/50"
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-700 antialiased">🌿</div>
                <div className="text-xs font-semibold text-gray-600 mt-1">Eco-Friendly</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}