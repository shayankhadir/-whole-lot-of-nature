/**
 * SEO Landing Page: Complete Indoor Plants Care Guide for Indian Homes
 * Hand-crafted content for organic SEO
 * Target Keywords: indoor plants care, indoor plant care tips, houseplant care india
 */

import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Indoor Plants Care Guide: Expert Tips for Indian Homes | Whole Lot of Nature',
  description: 'Complete indoor plants care guide for Indian homes. Learn watering schedules, light requirements, pest control, and monsoon care tips from Bangalore\'s trusted plant experts.',
  keywords: [
    'indoor plants care',
    'indoor plant care tips',
    'houseplant care india',
    'indoor plants bangalore',
    'how to care for indoor plants',
    'plant care guide',
    'indoor gardening tips',
    'low light plants india'
  ],
  openGraph: {
    title: 'Indoor Plants Care Guide: Expert Tips for Indian Homes',
    description: 'Complete indoor plants care guide for Indian homes. Expert tips on watering, light, and pest control.',
    type: 'article',
    images: ['/images/seo/indoor-plants-care.jpg'],
  },
};

export default function IndoorPlantsCarePage() {
  return (
    <div className="min-h-screen">
      {/* Breadcrumbs */}
      <div className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-[#66BB6A] hover:text-[#81C784]">
              Home
            </Link>
            <span className="text-white/40">/</span>
            <Link href="/seo-pages" className="text-[#66BB6A] hover:text-[#81C784]">
              Guides
            </Link>
            <span className="text-white/40">/</span>
            <span className="text-white/70">Indoor Plants Care</span>
          </nav>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 antialiased">
            Complete Indoor Plants Care Guide for Indian Homes
          </h1>
          <p className="text-xl text-white/70 leading-relaxed antialiased">
            Master the art of indoor gardening with our expert tips tailored for Indian climate conditions. 
            From monsoon care to summer survival, we&apos;ve got you covered.
          </p>
          <div className="flex flex-wrap gap-2 mt-6">
            <span className="bg-[#2E7D32]/30 text-[#66BB6A] px-3 py-1 rounded-full text-sm font-semibold border border-[#66BB6A]/30">Indoor Plants</span>
            <span className="bg-[#2E7D32]/30 text-[#66BB6A] px-3 py-1 rounded-full text-sm font-semibold border border-[#66BB6A]/30">Plant Care</span>
            <span className="bg-[#2E7D32]/30 text-[#66BB6A] px-3 py-1 rounded-full text-sm font-semibold border border-[#66BB6A]/30">Gardening Tips</span>
            <span className="bg-[#2E7D32]/30 text-[#66BB6A] px-3 py-1 rounded-full text-sm font-semibold border border-[#66BB6A]/30">Indian Climate</span>
          </div>
        </header>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Content Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Introduction */}
            <article className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4 antialiased">
                Why Indoor Plants Thrive Differently in India
              </h2>
              <p className="text-white/80 mb-4 leading-relaxed">
                India&apos;s diverse climate—from humid coastal regions to dry northern plains—means your indoor plants need 
                special attention. Unlike temperate countries, we deal with extreme summers (40°C+), heavy monsoons, 
                and AC environments that can stress plants.
              </p>
              <p className="text-white/80 leading-relaxed">
                The good news? Many popular houseplants are actually native to tropical regions similar to India. 
                With the right care, your Money Plant, Monstera, or Peace Lily can flourish year-round.
              </p>
            </article>

            {/* Watering Guide */}
            <article className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4 antialiased">
                💧 The Golden Rule of Watering
              </h2>
              <p className="text-white/80 mb-4 leading-relaxed">
                <strong className="text-white">Overwatering kills more indoor plants than underwatering.</strong> Indian 
                homes often have poor drainage pots (those decorative ceramic ones without holes!), leading to root rot.
              </p>
              
              <div className="bg-[#2E7D32]/20 border border-[#66BB6A]/30 rounded-xl p-6 my-6">
                <h3 className="text-lg font-bold text-[#66BB6A] mb-3">Seasonal Watering Schedule</h3>
                <ul className="space-y-2 text-white/80">
                  <li className="flex items-start gap-2">
                    <span className="text-[#66BB6A]">☀️</span>
                    <span><strong className="text-white">Summer (Mar-Jun):</strong> Water every 2-3 days, early morning</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#66BB6A]">🌧️</span>
                    <span><strong className="text-white">Monsoon (Jul-Sep):</strong> Reduce to once a week, check soil moisture</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#66BB6A]">❄️</span>
                    <span><strong className="text-white">Winter (Oct-Feb):</strong> Every 5-7 days, avoid cold water</span>
                  </li>
                </ul>
              </div>

              <p className="text-white/80 leading-relaxed">
                <strong className="text-white">Pro tip:</strong> Stick your finger 2 inches into the soil. If it&apos;s dry, water. 
                If moist, wait another day. This simple test works better than any fixed schedule.
              </p>
            </article>

            {/* Light Requirements */}
            <article className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4 antialiased">
                ☀️ Understanding Light for Indian Apartments
              </h2>
              <p className="text-white/80 mb-4 leading-relaxed">
                Most Indian flats get harsh afternoon sun from the west, while north-facing windows receive gentle 
                indirect light. Here&apos;s how to place your plants:
              </p>
              
              <div className="grid md:grid-cols-2 gap-4 my-6">
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <h4 className="font-bold text-[#66BB6A] mb-2">Bright Indirect Light</h4>
                  <p className="text-sm text-white/70 mb-2">East-facing windows, 3-4 feet from south windows</p>
                  <p className="text-white/80 text-sm">Best for: Monstera, Fiddle Leaf Fig, Rubber Plant, Calathea</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <h4 className="font-bold text-[#66BB6A] mb-2">Low Light Tolerant</h4>
                  <p className="text-sm text-white/70 mb-2">North windows, bathrooms, interior rooms</p>
                  <p className="text-white/80 text-sm">Best for: Snake Plant, ZZ Plant, Pothos, Peace Lily</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <h4 className="font-bold text-[#66BB6A] mb-2">Direct Morning Sun</h4>
                  <p className="text-sm text-white/70 mb-2">East balcony, morning sun spots</p>
                  <p className="text-white/80 text-sm">Best for: Succulents, Jade Plant, Croton, Hibiscus</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <h4 className="font-bold text-[#66BB6A] mb-2">Avoid Harsh Afternoon Sun</h4>
                  <p className="text-sm text-white/70 mb-2">West windows without curtains</p>
                  <p className="text-white/80 text-sm">Can burn: Most tropical foliage plants, ferns, calatheas</p>
                </div>
              </div>
            </article>

            {/* Monsoon Care */}
            <article className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4 antialiased">
                🌧️ Monsoon Plant Care (Critical for India!)
              </h2>
              <p className="text-white/80 mb-4 leading-relaxed">
                Monsoon is both a blessing and challenge. High humidity promotes growth but also fungal diseases. 
                Here&apos;s your monsoon survival checklist:
              </p>
              
              <ul className="space-y-3 text-white/80">
                <li className="flex items-start gap-3">
                  <span className="text-[#66BB6A] mt-1">✓</span>
                  <span><strong className="text-white">Reduce watering by 50%</strong> - soil stays moist longer</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#66BB6A] mt-1">✓</span>
                  <span><strong className="text-white">Improve air circulation</strong> - use a small fan to prevent fungus</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#66BB6A] mt-1">✓</span>
                  <span><strong className="text-white">Check for pests weekly</strong> - mealybugs and fungus gnats love humidity</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#66BB6A] mt-1">✓</span>
                  <span><strong className="text-white">No fertilizer during heavy rains</strong> - roots can&apos;t absorb properly</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#66BB6A] mt-1">✓</span>
                  <span><strong className="text-white">Move plants from balconies</strong> - heavy rain damages foliage</span>
                </li>
              </ul>
            </article>

            {/* Pest Control */}
            <article className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4 antialiased">
                🐛 Natural Pest Control for Indian Homes
              </h2>
              <p className="text-white/80 mb-4 leading-relaxed">
                Skip the harsh chemicals! These home remedies work wonders:
              </p>
              
              <div className="space-y-4">
                <div className="bg-[#2E7D32]/10 border-l-4 border-[#66BB6A] p-4 rounded-r-lg">
                  <h4 className="font-bold text-white mb-1">Neem Oil Spray (Best All-Rounder)</h4>
                  <p className="text-white/70 text-sm">Mix 2ml neem oil + 1ml liquid soap in 1L water. Spray weekly.</p>
                </div>
                <div className="bg-[#2E7D32]/10 border-l-4 border-[#66BB6A] p-4 rounded-r-lg">
                  <h4 className="font-bold text-white mb-1">Garlic-Chilli Spray (For Aphids)</h4>
                  <p className="text-white/70 text-sm">Blend 5 garlic cloves + 2 chillies in water. Strain and spray.</p>
                </div>
                <div className="bg-[#2E7D32]/10 border-l-4 border-[#66BB6A] p-4 rounded-r-lg">
                  <h4 className="font-bold text-white mb-1">Cinnamon Powder (For Fungus Gnats)</h4>
                  <p className="text-white/70 text-sm">Sprinkle on topsoil to kill larvae and prevent adults from laying eggs.</p>
                </div>
              </div>
            </article>

            {/* AC Room Tips */}
            <article className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4 antialiased">
                ❄️ Caring for Plants in AC Rooms
              </h2>
              <p className="text-white/80 mb-4 leading-relaxed">
                Air conditioning removes humidity, which tropical plants hate. Here&apos;s how to help them cope:
              </p>
              
              <ul className="space-y-3 text-white/80">
                <li className="flex items-start gap-3">
                  <span className="text-[#66BB6A] mt-1">•</span>
                  <span>Place plants away from direct AC airflow</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#66BB6A] mt-1">•</span>
                  <span>Group plants together to create a humidity microclimate</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#66BB6A] mt-1">•</span>
                  <span>Use a pebble tray filled with water under pots</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#66BB6A] mt-1">•</span>
                  <span>Mist leaves in the morning (not evening to prevent fungus)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#66BB6A] mt-1">•</span>
                  <span>Choose hardy plants: Snake Plant, ZZ Plant, and Dracaena handle AC well</span>
                </li>
              </ul>
            </article>

            {/* FAQs */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6 antialiased">
                Frequently Asked Questions
              </h2>
              <div className="space-y-6">
                <div className="border-b border-white/10 pb-4">
                  <h3 className="text-lg font-semibold text-white mb-2 antialiased">
                    Why are my indoor plant leaves turning yellow?
                  </h3>
                  <p className="text-white/70">
                    Usually overwatering or poor drainage. Check if roots are soggy. Other causes include 
                    nutrient deficiency (needs fertilizer), too much direct sun, or natural leaf aging (older leaves yellow first).
                  </p>
                </div>
                <div className="border-b border-white/10 pb-4">
                  <h3 className="text-lg font-semibold text-white mb-2 antialiased">
                    How often should I fertilize indoor plants in India?
                  </h3>
                  <p className="text-white/70">
                    During growing season (March-October): once every 2-3 weeks with diluted liquid fertilizer. 
                    Winter (November-February): skip fertilizing as plants are dormant. Always fertilize after watering, never on dry soil.
                  </p>
                </div>
                <div className="border-b border-white/10 pb-4">
                  <h3 className="text-lg font-semibold text-white mb-2 antialiased">
                    What are the best low-maintenance indoor plants for beginners?
                  </h3>
                  <p className="text-white/70">
                    Money Plant (Pothos), Snake Plant, ZZ Plant, and Spider Plant are nearly indestructible. 
                    They tolerate low light, irregular watering, and Indian summer heat.
                  </p>
                </div>
                <div className="border-b border-white/10 pb-4">
                  <h3 className="text-lg font-semibold text-white mb-2 antialiased">
                    Can I use regular garden soil for indoor plants?
                  </h3>
                  <p className="text-white/70">
                    No! Garden soil compacts in pots and doesn&apos;t drain well. Use a proper potting mix with cocopeat, 
                    perlite, and compost. We sell ready-made{' '}
                    <Link href="/shop?category=soil-and-growing-media" className="text-[#66BB6A] hover:underline">
                      indoor plant soil mixes
                    </Link>{' '}
                    that are perfectly balanced.
                  </p>
                </div>
                <div className="pb-4">
                  <h3 className="text-lg font-semibold text-white mb-2 antialiased">
                    How do I know if my plant needs repotting?
                  </h3>
                  <p className="text-white/70">
                    Signs: roots growing out of drainage holes, water runs straight through, plant becomes top-heavy, 
                    or growth has stalled. Best time to repot: early spring (February-March) before active growth begins.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* CTA Box */}
            <div className="bg-gradient-to-br from-[#2E7D32] to-[#1B5E20] rounded-2xl p-6 text-white sticky top-4 border border-[#66BB6A]/30">
              <h3 className="text-2xl font-bold mb-4 antialiased">Ready to Start?</h3>
              <p className="mb-6 text-white/90">
                Get premium indoor plants delivered to your doorstep with free care guides.
              </p>
              <Link
                href="/shop?category=indoor-plants"
                className="block w-full bg-white text-[#2E7D32] font-bold py-3 px-6 rounded-lg text-center hover:bg-gray-100 transition-colors antialiased"
              >
                Shop Indoor Plants
              </Link>
              <div className="mt-6 pt-6 border-t border-[#66BB6A]/30">
                <p className="text-sm mb-4 text-white/90">Need personalized advice?</p>
                <Link
                  href="/contact"
                  className="block w-full bg-[#1B5E20] hover:bg-[#145218] text-white font-semibold py-2 px-4 rounded-lg text-center transition-colors"
                >
                  Talk to Our Experts
                </Link>
              </div>
            </div>

            {/* Quick Tips Box */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mt-6">
              <h3 className="text-lg font-bold text-white mb-4 antialiased">
                🌿 Quick Care Reminders
              </h3>
              <ul className="space-y-3 text-white/80 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-[#66BB6A]">✓</span>
                  Check soil before watering
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#66BB6A]">✓</span>
                  Rotate plants monthly for even growth
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#66BB6A]">✓</span>
                  Wipe leaves to remove dust
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#66BB6A]">✓</span>
                  Inspect for pests weekly
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#66BB6A]">✓</span>
                  Fertilize during growing season
                </li>
              </ul>
            </div>

            {/* Related Guides */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mt-6">
              <h3 className="text-lg font-bold text-white mb-4 antialiased">
                Related Guides
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/seo-pages/organic-fertilizers" className="text-[#66BB6A] hover:text-[#81C784] hover:underline">
                    Organic Fertilizers Guide
                  </Link>
                </li>
                <li>
                  <Link href="/seo-pages/pest-control-natural" className="text-[#66BB6A] hover:text-[#81C784] hover:underline">
                    Natural Pest Control
                  </Link>
                </li>
                <li>
                  <Link href="/seo-pages/outdoor-gardening-tips" className="text-[#66BB6A] hover:text-[#81C784] hover:underline">
                    Outdoor Gardening Tips
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-[#66BB6A] hover:text-[#81C784] hover:underline">
                    All Blog Posts
                  </Link>
                </li>
              </ul>
            </div>

            {/* Trust Signals */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mt-6">
              <h3 className="text-lg font-bold text-white mb-4 antialiased">
                Why Whole Lot of Nature?
              </h3>
              <div className="space-y-4 text-sm">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🌱</span>
                  <span className="text-white/80">100% Organic & Sustainable</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🚚</span>
                  <span className="text-white/80">Free Delivery Above ₹999</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🔄</span>
                  <span className="text-white/80">7-Day Plant Guarantee</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">💬</span>
                  <span className="text-white/80">Expert Support 9am-9pm</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
