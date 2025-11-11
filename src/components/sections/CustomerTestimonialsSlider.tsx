// Modern testimonials slider using keen-slider and premium styling
'use client';

import { useRef } from 'react';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: "Priya Sharma",
    location: "Mumbai",
    rating: 5,
    text: "Amazing quality plants! My indoor garden has never looked better. The organic potting mix worked wonders for my succulents. Highly recommended!",
    image: "👩‍🦱"
  },
  {
    name: "Rajesh Kumar",
    location: "Delhi",
    rating: 5,
    text: "Fast delivery and excellent packaging. The plants arrived healthy and fresh. Great customer service too. Will definitely order again!",
    image: "👨‍💼"
  },
  {
    name: "Anita Patel",
    location: "Bangalore",
    rating: 5,
    text: "Love the organic fertilizers! My vegetable garden is thriving. The gardening tips in their blog section are very helpful.",
    image: "👩‍🌾"
  },
  {
    name: "Mohammed Ali",
    location: "Hyderabad",
    rating: 5,
    text: "Professional service and quality products. The customer support helped me choose the right plants for my balcony garden. Excellent experience!",
    image: "👨‍🏫"
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
    <section className="py-16 bg-primary-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary-900 mb-2">
            What Our Customers Say
          </h2>
          <p className="text-lg text-primary-700 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what plant lovers across India say about us.
          </p>
        </motion.div>

        <div ref={sliderRef} className="keen-slider">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="keen-slider__slide flex flex-col justify-between bg-white rounded-2xl shadow-xl border border-primary-100 p-7 relative mx-2"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Quote className="absolute top-5 right-5 w-7 h-7 text-green-200" />
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-primary-800 mb-6 text-base leading-relaxed font-medium">
                "{testimonial.text}"
              </p>
              <div className="flex items-center mt-auto">
                <div className="text-3xl mr-4">
                  {testimonial.image}
                </div>
                <div>
                  <h4 className="font-semibold text-primary-900 text-base font-serif">
                    {testimonial.name}
                  </h4>
                  <p className="text-primary-600 text-xs">
                    {testimonial.location}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-gray-900 font-semibold mb-4">
            Join thousands of happy customers
          </p>
          <a
            href="/shop"
            className="inline-flex items-center px-7 py-3 bg-primary-600 text-white font-semibold rounded-xl shadow-lg hover:bg-primary-700 transition-colors text-lg"
          >
            Start Your Garden Journey
          </a>
        </motion.div>
      </div>
    </section>
  );
}
