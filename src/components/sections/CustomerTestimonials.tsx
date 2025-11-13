'use client';

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

export default function CustomerTestimonials() {
  return (
    <section className="py-12 bg-[#2E7D32]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-2 antialiased">
            What Our Customers Say
          </h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto antialiased">
            Don't just take our word for it. Here's what plant lovers across India say about us.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg shadow-sm p-5 relative border border-gray-100"
            >
              <Quote className="absolute top-4 right-4 w-6 h-6 text-[#2E7D32]" />
              
              {/* Rating */}
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-yellow-400 fill-current"
                  />
                ))}
              </div>

              {/* Testimonial text */}
              <p className="text-gray-700 mb-5 text-sm leading-relaxed">
                "{testimonial.text}"
              </p>

              {/* Customer info */}
              <div className="flex items-center">
                <div className="text-2xl mr-3 antialiased">
                  {testimonial.image}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">
                    {testimonial.name}
                  </h4>
                  <p className="text-gray-500 text-xs">
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
          <p className="text-gray-600 mb-4">
            Join thousands of happy customers
          </p>
          <a
            href="/shop"
            className="inline-flex items-center px-6 py-3 bg-white text-primary-700 font-medium rounded-lg border border-primary-200 hover:bg-primary-50 transition-colors"
          >
            Start Your Garden Journey
          </a>
        </motion.div>
      </div>
    </section>
  );
}