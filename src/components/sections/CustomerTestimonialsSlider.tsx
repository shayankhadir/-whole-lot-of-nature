// Modern testimonials slider using keen-slider and premium styling
'use client';

import { useRef } from 'react';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import SpotlightCard from '@/components/ui/SpotlightCard';
import { BackgroundGrid } from '@/components/ui/BackgroundEffects';

const testimonials = [
  {
    name: "Aarav R.",
    location: "Indiranagar, Bangalore",
    rating: 5,
    text: "Their balcony makeover kit plus the organic soil mix brought instant life to my space. Delivery was spotless and the team followed up with care tips.",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=150&q=80"
  },
  {
    name: "Diya S.",
    location: "Whitefield, Bangalore",
    rating: 5,
    text: "I booked a pond consult—excited for their upcoming aquascaping services. Meanwhile the aquatic plants arrived lush and healthy.",
    image: "https://images.unsplash.com/photo-1530023367847-a683933f4177?auto=format&fit=crop&w=150&q=80"
  },
  {
    name: "Karthik P.",
    location: "Koramangala, Bangalore",
    rating: 5,
    text: "Succulents, ceramic planters, and the fern fertilizer—everything felt premium. The blog guides actually saved my fiddle leaf fig.",
    image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=150&q=80"
  },
  {
    name: "Sahana M.",
    location: "HSR Layout, Bangalore",
    rating: 5,
    text: "Loved the gift wrapping and zero mess delivery. The team suggested low-light plants for my studio—every pick was perfect.",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=150&q=80"
  }
];

export default function CustomerTestimonialsSlider() {
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: { perView: 1, spacing: 24 },
    breakpoints: {
      '(min-width: 640px)': { slides: { perView: 2, spacing: 24 } },
      '(min-width: 1024px)': { slides: { perView: 3, spacing: 32 } },
    },
  });

  return (
    <section className="relative py-24 bg-[#0d3512] overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/backgrounds/ai-generated-lush-tropical-green-leaves-background-photo.jpg"
          alt="Leaf backdrop"
          fill
          className="object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#010904]/90 via-[#0d3512]/80 to-[#010904]/90" />
      </div>
      <BackgroundGrid />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16 space-y-4"
        >
          {/* Badge */}
          <div className="flex items-center justify-center">
            <div className="inline-flex items-center rounded-full border border-[#66BB6A]/30 bg-[#66BB6A]/10 px-4 py-1.5 text-xs font-medium text-[#66BB6A] backdrop-blur-sm uppercase tracking-wider">
              Community Voices
            </div>
          </div>

          {/* Main Heading */}
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#daf2d0] antialiased leading-tight">
            Bengaluru loves its greens
          </h2>

          {/* Subtitle */}
          <p className="text-lg max-w-2xl mx-auto antialiased font-light text-emerald-100/80">
            Real notes from customers across Bangalore—from balcony gardens to future aquascaping builds.
          </p>

          {/* Decorative Line */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#66BB6A]/50" />
            <div className="w-2 h-2 rounded-full bg-[#66BB6A]" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#66BB6A]/50" />
          </div>
        </motion.div>

        <div ref={sliderRef} className="keen-slider">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="keen-slider__slide flex flex-col justify-between mx-2"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <SpotlightCard className="h-full p-8 relative bg-white/5 border-white/10">
                <Quote className="absolute top-6 right-6 w-10 h-10 text-emerald-300/25" />
                <div className="flex items-center mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-emerald-400 fill-current" />
                  ))}
                </div>
                <p className="text-emerald-50/90 mb-6 text-base leading-relaxed font-light antialiased italic">
                  &quot;{testimonial.text}&quot;
                </p>
                <div className="flex flex-wrap gap-2 mb-6 text-[11px] uppercase tracking-[0.2em] text-emerald-200/80">
                  <span className="px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10">Fast delivery</span>
                  <span className="px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10">Premium soil</span>
                  <span className="px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10">Care support</span>
                </div>
                <div className="flex items-center mt-auto gap-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-emerald-400/30">
                    <Image 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-sm font-montserrat antialiased tracking-wide">
                      {testimonial.name}
                    </h4>
                    <p className="text-emerald-400/60 text-xs uppercase tracking-wider">
                      {testimonial.location}
                    </p>
                  </div>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-emerald-100/70 font-medium mb-6 text-sm tracking-wide uppercase">
            Join thousands of happy gardeners across Bangalore
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center px-8 py-4 bg-[#2E7D32] text-white font-semibold rounded-full shadow-lg hover:bg-[#66BB6A] transition-all hover:scale-105 text-sm tracking-wider uppercase antialiased"
          >
            Start Your Garden Journey
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
