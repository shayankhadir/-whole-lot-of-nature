// Modern testimonials slider using keen-slider and premium styling
'use client';

import { useRef } from 'react';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import Image from 'next/image';
import SpotlightCard from '@/components/ui/SpotlightCard';
import { BackgroundGrid } from '@/components/ui/BackgroundEffects';

const testimonials = [
  {
    name: "Priya Sharma",
    location: "Mumbai",
    rating: 5,
    text: "Amazing quality plants! My indoor garden has never looked better. The organic potting mix worked wonders for my succulents. Highly recommended!",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
  },
  {
    name: "Rajesh Kumar",
    location: "Delhi",
    rating: 5,
    text: "Fast delivery and excellent packaging. The plants arrived healthy and fresh. Great customer service too. Will definitely order again!",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
  },
  {
    name: "Anita Patel",
    location: "Bangalore",
    rating: 5,
    text: "Love the organic fertilizers! My vegetable garden is thriving. The gardening tips in their blog section are very helpful.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80"
  },
  {
    name: "Mohammed Ali",
    location: "Hyderabad",
    rating: 5,
    text: "Professional service and quality products. The customer support helped me choose the right plants for my balcony garden. Excellent experience!",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80"
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
      {/* Background Grid Effect */}
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
            What Our Customers Say
          </h2>

          {/* Subtitle */}
          <p className="text-lg max-w-2xl mx-auto antialiased font-light text-emerald-100/80">
            Don't just take our word for it. Here's what plant lovers across India say about us.
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
                <Quote className="absolute top-6 right-6 w-8 h-8 text-emerald-400/20" />
                <div className="flex items-center mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-emerald-400 fill-current" />
                  ))}
                </div>
                <p className="text-emerald-50/90 mb-8 text-base leading-relaxed font-light antialiased italic">
                  "{testimonial.text}"
                </p>
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
          <p className="text-emerald-100/60 font-medium mb-6 text-sm tracking-wide uppercase">
            Join thousands of happy customers
          </p>
          <a
            href="/shop"
            className="inline-flex items-center px-8 py-4 bg-[#2E7D32] text-white font-semibold rounded-full shadow-lg hover:bg-[#66BB6A] transition-all hover:scale-105 text-sm tracking-wider uppercase antialiased"
          >
            Start Your Garden Journey
          </a>
        </motion.div>
      </div>
    </section>
  );
}
