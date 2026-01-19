import type { Metadata } from 'next';
import { Leaf, Waves, GraduationCap, TreePine, Flower2, Bug, Sprout } from 'lucide-react';
import CountdownTimer from '@/components/ui/CountdownTimer';

export const metadata: Metadata = {
  title: 'Services | Whole Lot of Nature',
  description: 'Professional landscaping, aquascaping, and terrarium workshop services in Bangalore. Creating sustainable ecosystems with native plants and species.',
  openGraph: {
    title: 'Services | Whole Lot of Nature',
    description: 'Professional landscaping, aquascaping, and terrarium workshop services in Bangalore. Creating sustainable ecosystems with native plants and species.',
    images: ['https://wholelotofnature.com/images/og-image.jpg'],
    url: 'https://wholelotofnature.com/services',
  },
  alternates: {
    canonical: 'https://wholelotofnature.com/services',
  },
};

const services = [
  {
    icon: Waves,
    title: 'Aquascaping',
    description: 'Transform your aquarium into a living underwater garden with our expert aquascaping services. We design and maintain stunning aquatic ecosystems using native plants and sustainable practices.',
    features: ['Custom tank design', 'Plant selection & placement', 'Hardscape arrangement', 'Maintenance packages'],
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: TreePine,
    title: 'Landscaping',
    description: 'Create beautiful outdoor spaces that work in harmony with nature. Our landscaping services focus on native plants, water conservation, and creating habitats for local wildlife.',
    features: ['Garden design & planning', 'Native plant selection', 'Irrigation systems', 'Seasonal maintenance'],
    color: 'from-emerald-500 to-green-600',
  },
  {
    icon: GraduationCap,
    title: 'Terrarium Workshops',
    description: 'Learn the art of creating miniature ecosystems! Our hands-on workshops teach you everything from plant selection to long-term care of your own terrarium.',
    features: ['Beginner-friendly sessions', 'Materials included', 'Take home your creation', 'Group bookings available'],
    color: 'from-amber-500 to-orange-500',
  },
  {
    icon: Flower2,
    title: 'Garden Consultations',
    description: 'Get personalized advice for your garden from our horticultural experts. We help you create thriving spaces that suit your lifestyle and local conditions.',
    features: ['On-site assessment', 'Plant health diagnosis', 'Care recommendations', 'Seasonal planning'],
    color: 'from-pink-500 to-rose-500',
  },
  {
    icon: Bug,
    title: 'Organic Pest Management',
    description: 'Keep your plants healthy without harmful chemicals. Our integrated pest management approach uses natural methods to protect your garden ecosystem.',
    features: ['Pest identification', 'Natural remedies', 'Preventive measures', 'Eco-friendly solutions'],
    color: 'from-lime-500 to-green-500',
  },
  {
    icon: Sprout,
    title: 'Corporate Green Spaces',
    description: 'Bring nature into your workplace with custom green installations. We design and maintain indoor and outdoor plant spaces for offices, cafes, and commercial buildings.',
    features: ['Office plant design', 'Vertical gardens', 'Maintenance contracts', 'Air-purifying plants'],
    color: 'from-teal-500 to-emerald-500',
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0d3512] via-[#0a2810] to-[#061208]">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/leaf-pattern.svg')] opacity-5" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 text-emerald-300 text-sm font-medium mb-8 border border-emerald-500/30">
              <Leaf className="w-4 h-4" />
              <span>Stay Loyal to the Soil</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-300">Services</span>
            </h1>
            
            <p className="text-xl text-emerald-100/80 mb-8 max-w-2xl mx-auto leading-relaxed">
              Professional landscaping, aquascaping, and educational workshops in and around Bangalore. 
              We create sustainable ecosystems using native plants and species that thrive together.
            </p>

            {/* Coming Soon Banner */}
            <div className="relative mt-12">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/20 to-emerald-500/0 blur-xl" />
              <div className="relative bg-gradient-to-r from-emerald-900/80 to-green-900/80 backdrop-blur-sm border border-emerald-500/30 rounded-2xl p-8 md:p-12">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500 text-amber-950 text-sm font-bold shadow-lg">
                    🌱 Coming Soon
                  </span>
                </div>
                
                <h2 className="text-2xl md:text-3xl font-bold text-white mt-4 mb-4">
                  Service Bookings Opening Soon!
                </h2>

                {/* Countdown Timer */}
                <CountdownTimer targetDate="2026-02-02T00:00:00" />
                
                <p className="text-emerald-100/80 text-lg max-w-2xl mx-auto mb-6">
                  We're preparing to bring our professional services to your doorstep. 
                  Be among the first to experience nature-inspired transformations for your space.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a 
                    href="/contact" 
                    className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-full transition-all shadow-lg hover:shadow-emerald-500/30"
                  >
                    Get Notified
                  </a>
                  <a 
                    href="/shop" 
                    className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-full border border-white/20 transition-all"
                  >
                    Shop Plants
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              What We Offer
            </h2>
            <p className="text-emerald-200/70 max-w-xl mx-auto">
              Creating sustainable ecosystems using native plants, native species, and plants that naturally complement each other
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {services.map((service, index) => (
              <div 
                key={service.title}
                className="group relative bg-white/[0.03] backdrop-blur-sm border border-emerald-900/30 rounded-2xl p-6 hover:bg-white/[0.06] hover:border-emerald-700/50 transition-all duration-300"
              >
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${service.color} mb-5`}>
                  <service.icon className="w-6 h-6 text-white" />
                </div>
                
                <h3 className="text-xl font-semibold text-white mb-3">
                  {service.title}
                </h3>
                
                <p className="text-emerald-200/70 text-sm mb-4 leading-relaxed">
                  {service.description}
                </p>
                
                <ul className="space-y-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-emerald-300/80">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="absolute top-4 right-4">
                  <span className="text-xs text-amber-400 font-medium bg-amber-500/20 px-2 py-1 rounded-full">
                    Coming Soon
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-20 border-t border-emerald-900/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Service Areas
            </h2>
            <p className="text-emerald-200/70 mb-8 text-lg">
              We offer services in and around <span className="text-emerald-400 font-semibold">Bangalore</span>
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              {['Bangalore City', 'Whitefield', 'Electronic City', 'Koramangala', 'Indiranagar', 'HSR Layout', 'Jayanagar', 'Marathahalli'].map((area) => (
                <div key={area} className="px-4 py-3 bg-emerald-900/30 rounded-lg border border-emerald-800/30 text-emerald-200/80 text-sm">
                  {area}
                </div>
              ))}
            </div>

            <div className="mt-12 p-6 bg-emerald-900/20 rounded-2xl border border-emerald-800/30">
              <h3 className="text-xl font-semibold text-white mb-3">Our Philosophy</h3>
              <p className="text-emerald-200/80 leading-relaxed">
                We focus on creating thriving ecosystems by using <strong className="text-emerald-300">native plants</strong>, 
                <strong className="text-emerald-300"> native species</strong>, and carefully selected plants that naturally 
                complement each other. Our goal is to keep the ecosystem clean, active, and sustainable for generations to come.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 border-t border-emerald-900/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Have Questions About Our Services?
          </h2>
          <p className="text-emerald-200/70 mb-6">
            We'd love to hear about your project and how we can help bring nature into your space.
          </p>
          <a 
            href="/contact" 
            className="inline-flex items-center gap-2 px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-full transition-all"
          >
            Contact Us
          </a>
        </div>
      </section>
    </div>
  );
}
