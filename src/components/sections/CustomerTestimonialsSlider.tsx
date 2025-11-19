// Modern testimonials slider using keen-slider and premium styling
'use client';

import { useRef } from 'react';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import SpotlightCard from '@/components/ui/SpotlightCard';
import { BackgroundGrid } from '@/components/ui/BackgroundEffects';

const testimonials = [
	{
		name: 'Priya Sharma',
		location: 'Mumbai',
		rating: 5,
		text: 'Amazing quality plants! My indoor garden has never looked better. The organic potting mix worked wonders for my succulents. Highly recommended!',
		image: '👩‍🦱',
	},
	{
		name: 'Rajesh Kumar',
		location: 'Delhi',
		rating: 5,
		text: 'Fast delivery and excellent packaging. The plants arrived healthy and fresh. Great customer service too. Will definitely order again!',
		image: '👨‍💼',
	},
	{
		name: 'Anita Patel',
		location: 'Bangalore',
		rating: 5,
		text: 'Love the organic fertilizers! My vegetable garden is thriving. The gardening tips in their blog section are very helpful.',
		image: '👩‍🌾',
	},
	{
		name: 'Mohammed Ali',
		location: 'Hyderabad',
		rating: 5,
		text: 'Professional service and quality products. The customer support helped me choose the right plants for my balcony garden. Excellent experience!',
		image: '👨‍🏫',
	},
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
		<section className="relative py-24 bg-emerald-950">
			{/* Background Grid Effect */}
			<BackgroundGrid />

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					viewport={{ once: true }}
					className="text-center mb-16"
				>
					<span className="section-eyebrow mb-4">Testimonials</span>
					<h2 className="font-serif text-[clamp(2rem,4vw,3rem)] font-bold text-cream-50 mb-4">
						What Our{' '}
						<span className="text-gold-gradient">Customers Say</span>
					</h2>
					<p className="text-lg text-cream-200/80 max-w-2xl mx-auto font-sans">
						Don't just take our word for it. Here's what plant lovers across India
						say about us.
					</p>
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
							<SpotlightCard className="h-full p-8 relative bg-emerald-900/20 border-emerald-800/50 hover:border-gold-500/30">
								<Quote className="absolute top-6 right-6 w-8 h-8 text-gold-500/20" />
								<div className="flex items-center mb-6">
									{[...Array(testimonial.rating)].map((_, i) => (
										<Star
											key={i}
											className="w-5 h-5 text-gold-400 fill-current"
										/>
									))}
								</div>
								<p className="text-cream-100/90 mb-8 text-lg leading-relaxed font-medium font-serif italic">
									"{testimonial.text}"
								</p>
								<div className="flex items-center mt-auto">
									<div className="text-4xl mr-4 grayscale opacity-80">
										{testimonial.image}
									</div>
									<div>
										<h4 className="font-bold text-cream-50 text-base font-serif">
											{testimonial.name}
										</h4>
										<p className="text-sm text-gold-400/80 font-sans uppercase tracking-wider">
											{testimonial.location}
										</p>
									</div>
								</div>
							</SpotlightCard>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
