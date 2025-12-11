// Modern testimonials slider using keen-slider and premium styling
'use client';

import { useRef } from 'react';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import Image from 'next/image';

const testimonials = [
  {
    name: "Aarav R.",
    location: "Delhi",
    rating: 5,
    text: "The organic soil mix and balcony kit brought instant life to my space. Delivery was spotless and the team followed up with care tips.",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=150&q=80"
  },
  {
    name: "Diya S.",
    location: "Mumbai",
    rating: 5,
    text: "Aquatic plants arrived lush and healthy. The care card made setup easy and the team replied quickly to questions.",
    image: "https://images.unsplash.com/photo-1530023367847-a683933f4177?auto=format&fit=crop&w=150&q=80"
  },
  {
    name: "Karthik P.",
    location: "Hyderabad",
    rating: 5,
    text: "Succulents, ceramic planters, and the fern fertilizer all felt premium. The blog guides actually saved my fiddle leaf fig.",
    image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=150&q=80"
  },
  {
    name: "Sahana M.",
    location: "Chennai",
    rating: 5,
    text: "Loved the gift wrapping and zero-mess delivery. The team suggested low-light plants for my studio and every pick was perfect.",
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
    <section className="relative py-24 overflow-hidden bg-[#0d3512]">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/backgrounds/bgleaf1.webp"
          alt="Leaf backdrop"
          fill
          className="object-cover opacity-20"
          priority={false}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#010904]/88 via-[#0d3512]/88 to-[#010904]/90" />
        <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-[0.05] mix-blend-overlay" />
      </div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 space-y-3"
        >
          <h2 className="text-3xl md:text-4xl font-semibold text-[#e7f5e4] tracking-tight">What customers say</h2>
          <p className="text-base md:text-lg text-emerald-100/80 max-w-2xl mx-auto">
            Orders and plant parents from Delhi to Mumbai to Chennai—quick delivery, careful packing, and easy care help.
          </p>
        </motion.div>

        <div ref={sliderRef} className="keen-slider">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="keen-slider__slide h-full"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
              viewport={{ once: true }}
            >
              <div className="h-full rounded-2xl bg-gradient-to-br from-[#0f1e11] via-[#0c1b12] to-[#0f1e11] border border-emerald-900/35 p-6 md:p-7 shadow-[0_12px_50px_rgba(0,0,0,0.28)] flex flex-col gap-4">
                <div className="flex items-center gap-1 text-emerald-300">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                <p className="text-emerald-50/90 text-sm md:text-base leading-relaxed">
                  “{testimonial.text}”
                </p>

                <div className="flex items-center gap-4 mt-auto">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border border-emerald-500/30">
                    <Image 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-sm md:text-base tracking-tight">
                      {testimonial.name}
                    </h4>
                    <p className="text-emerald-300/80 text-xs uppercase tracking-[0.18em]">
                      {testimonial.location}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
