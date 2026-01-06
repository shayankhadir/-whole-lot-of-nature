'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  location: string;
  avatar?: string;
  rating: number;
  text: string;
  product?: string;
  date?: string;
  verified?: boolean;
}

interface TestimonialsSectionProps {
  testimonials?: Testimonial[];
  title?: string;
  subtitle?: string;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

const defaultTestimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Priya Sharma',
    location: 'Bangalore',
    rating: 5,
    text: "These plants arrived in perfect condition! My monstera is thriving and looks absolutely stunning in my living room. The packaging was eco-friendly too. Will definitely order again!",
    product: 'Monstera Deliciosa',
    date: '2 weeks ago',
    verified: true
  },
  {
    id: 2,
    name: 'Rahul Menon',
    location: 'Hyderabad',
    rating: 5,
    text: "Best plant delivery service in India! My snake plant came well-packaged with detailed care instructions. The quality is outstanding and worth every rupee. Highly recommended!",
    product: 'Snake Plant',
    date: '1 month ago',
    verified: true
  },
  {
    id: 3,
    name: 'Ananya Reddy',
    location: 'Chennai',
    rating: 5,
    text: "I was skeptical about ordering plants online, but Whole Lot of Nature exceeded all expectations. The pothos I received was even bigger than in the photos. Amazing service!",
    product: 'Golden Pothos',
    date: '3 weeks ago',
    verified: true
  },
  {
    id: 4,
    name: 'Vikram Patel',
    location: 'Mumbai',
    rating: 5,
    text: "The organic soil mix is fantastic! My plants have never looked healthier. Fast delivery to Mumbai and great customer support. This is my go-to plant store now.",
    product: 'Premium Potting Mix',
    date: '1 week ago',
    verified: true
  },
  {
    id: 5,
    name: 'Deepa Krishnan',
    location: 'Kochi',
    rating: 5,
    text: "Love the variety of plants available. I ordered a peace lily for my bedroom and it arrived in pristine condition. The air quality has noticeably improved. Thank you!",
    product: 'Peace Lily',
    date: '2 weeks ago',
    verified: true
  }
];

export default function TestimonialsSection({
  testimonials = defaultTestimonials,
  title = "What Our Customers Say",
  subtitle = "Join thousands of happy plant parents across India",
  autoPlay = true,
  autoPlayInterval = 5000
}: TestimonialsSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      setDirection(1);
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, testimonials.length]);

  const goToPrevious = () => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToNext = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const goToSlide = (index: number) => {
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-[#0a1f0e] to-[#0d3512] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto max-w-5xl relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{title}</h2>
          <p className="text-lg text-emerald-100/60">{subtitle}</p>
          
          {/* Rating Summary */}
          <div className="flex items-center justify-center gap-2 mt-6">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-400" />
              ))}
            </div>
            <span className="text-white font-medium">4.9</span>
            <span className="text-white/60">• 500+ Reviews</span>
          </div>
        </motion.div>

        {/* Testimonial Carousel */}
        <div className="relative">
          {/* Quote Icon */}
          <Quote className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 text-emerald-500/20" />

          {/* Testimonial Card */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 md:p-12 min-h-[320px] relative overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={activeIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="flex flex-col items-center text-center"
              >
                {/* Stars */}
                <div className="flex text-yellow-400 mb-6">
                  {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-lg md:text-xl text-white/90 leading-relaxed mb-8 max-w-2xl">
                  &ldquo;{testimonials[activeIndex].text}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-lg overflow-hidden">
                    {testimonials[activeIndex].avatar ? (
                      <Image
                        src={testimonials[activeIndex].avatar!}
                        alt={testimonials[activeIndex].name}
                        width={56}
                        height={56}
                        className="object-cover"
                      />
                    ) : (
                      getInitials(testimonials[activeIndex].name)
                    )}
                  </div>

                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <p className="text-white font-semibold">
                        {testimonials[activeIndex].name}
                      </p>
                      {testimonials[activeIndex].verified && (
                        <span className="px-2 py-0.5 text-xs bg-emerald-500/20 text-emerald-400 rounded-full">
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="text-white/60 text-sm">
                      {testimonials[activeIndex].location}
                      {testimonials[activeIndex].product && (
                        <> • Bought {testimonials[activeIndex].product}</>
                      )}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === activeIndex 
                    ? 'w-8 bg-emerald-500' 
                    : 'w-2 bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16"
        >
          {[
            { value: '10,000+', label: 'Happy Customers' },
            { value: '50,000+', label: 'Plants Delivered' },
            { value: '4.9/5', label: 'Average Rating' },
            { value: '99%', label: 'Satisfaction Rate' }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <p className="text-2xl md:text-3xl font-bold text-emerald-400">{stat.value}</p>
              <p className="text-sm text-white/60">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
