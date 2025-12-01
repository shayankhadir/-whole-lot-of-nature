/**
 * SEO Landing Page: Indoor Plants Care - Complete Guide for Indian Homes
 * Expert tips for caring for indoor plants in Indian climate
 * Target Keywords: indoor plants care, indoor plants india, how to care for indoor plants
 */

import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Indoor Plants Care Guide India | Expert Tips & Best Practices 2024',
  description: 'Complete guide to indoor plants care in India. Learn watering schedules, light requirements, pest control, and fertilizing tips. Expert advice for thriving indoor plants in Indian climate.',
  keywords: [
    "indoor plants care india",
    "how to care for indoor plants",
    "indoor plants maintenance tips",
    "best indoor plants for indian homes",
    "indoor plant watering schedule",
    "indoor plant fertilizer india",
    "low maintenance indoor plants",
    "indoor plants for beginners"
  ],
  alternates: {
    canonical: 'https://wholelotofnature.com/seo-pages/indoor-plants-care'
  },
  openGraph: {
    title: 'Indoor Plants Care Guide India | Whole Lot of Nature',
    description: 'Complete guide to caring for indoor plants in Indian climate. Expert tips on watering, lighting, fertilizing, and pest control.',
    type: 'article',
    images: ['/images/indoor-plants-care-guide.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Indoor Plants Care Guide for Indian Homes',
    description: 'Expert tips for thriving indoor plants in India',
  }
};

export default function IndoorPlantsCarePage() {
  // FAQ Schema for SEO
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How often should I water indoor plants in India?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'In India, most indoor plants need watering 2-3 times per week in summer and once a week in winter. Always check soil moisture before watering. The top 2-3 cm should be dry before watering again.'
        }
      },
      {
        '@type': 'Question',
        name: 'What are the best low-maintenance indoor plants for Indian climate?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Snake plant, ZZ plant, pothos, spider plant, and rubber plant are excellent low-maintenance options for Indian homes. They tolerate irregular watering and varying light conditions.'
        }
      },
      {
        '@type': 'Question',
        name: 'How much sunlight do indoor plants need?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Most indoor plants need 4-6 hours of bright, indirect sunlight. Place them near east or west-facing windows. Avoid direct afternoon sun in summer, which can scorch leaves.'
        }
      },
      {
        '@type': 'Question',
        name: 'Which fertilizer is best for indoor plants in India?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Use a balanced NPK (10:10:10) liquid fertilizer diluted to half strength every 2-4 weeks during growing season. Organic options like compost tea or vermicompost are also excellent.'
        }
      },
      {
        '@type': 'Question',
        name: 'How to control pests on indoor plants naturally?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Use neem oil spray (1 tsp per liter water) weekly. For aphids and mealybugs, wipe leaves with soapy water. Maintain good air circulation and avoid overwatering to prevent pests.'
        }
      }
    ]
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://wholelotofnature.com'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Guides',
        item: 'https://wholelotofnature.com/seo-pages'
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Indoor Plants Care',
        item: 'https://wholelotofnature.com/seo-pages/indoor-plants-care'
      }
    ]
  };

  return (
    <>
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-emerald-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
          <nav className="flex items-center space-x-2 text-sm" aria-label="Breadcrumb">
            <Link href="/" className="text-emerald-600 hover:text-emerald-700 transition">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link href="/seo-pages" className="text-emerald-600 hover:text-emerald-700 transition">
              Guides
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600 font-medium">Indoor Plants Care</span>
          </nav>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <header className="mb-12">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              Updated Dec 2024
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
              8 min read
            </span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Complete Guide to Indoor Plants Care in India
          </h1>
          
          <p className="text-xl sm:text-2xl text-gray-700 leading-relaxed mb-8">
            Expert tips and proven methods to help your indoor plants thrive in Indian climate. 
            Learn watering schedules, light requirements, pest control, and more.
          </p>
          
          <div className="flex flex-wrap gap-2">
            {['Indoor Plants Care', 'Plant Maintenance', 'Indian Climate', 'Beginner Friendly', 'Expert Tips'].map((tag) => (
              <span key={tag} className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold border border-emerald-200">
                {tag}
              </span>
            ))}
          </div>
        </header>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Content Column */}
          <div className="lg:col-span-2 space-y-8">
            <article className="bg-white rounded-3xl shadow-lg p-6 sm:p-10 prose prose-lg max-w-none">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <span className="text-4xl">🌿</span>
                Why Indoor Plants Matter
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Indoor plants are more than just decoration—they're natural air purifiers, mood boosters, and stress relievers. 
                In urban Indian homes where outdoor space is limited, indoor plants create a connection with nature and improve 
                air quality by filtering pollutants like formaldehyde and benzene.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Studies show that indoor plants can reduce stress by up to 60%, improve productivity, and even help you sleep better. 
                For Indian homes dealing with pollution and dust, having the right indoor plants with proper care can make a significant difference.
              </p>

              <h2 className="text-3xl font-bold text-gray-900 mb-4 mt-10 flex items-center gap-3">
                <span className="text-4xl">💧</span>
                Watering Schedule for Indian Climate
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Watering is the most crucial aspect of indoor plant care. In India's varying climate, here's what you need to know:
              </p>
              
              <div className="bg-emerald-50 border-l-4 border-emerald-500 p-6 rounded-r-xl my-6">
                <h3 className="text-xl font-bold text-emerald-900 mb-3">Golden Rule</h3>
                <p className="text-emerald-800 mb-0">
                  Check soil moisture before watering. Stick your finger 2-3 cm into the soil. If it feels dry, water thoroughly. 
                  If it's moist, wait another day or two.
                </p>
              </div>

              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-emerald-600 font-bold">☀️ Summer (March-June):</span>
                  <span>Water 2-3 times per week. High temperatures cause faster evaporation.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-600 font-bold">🌧️ Monsoon (July-September):</span>
                  <span>Reduce to once a week. High humidity means slower drying.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-600 font-bold">❄️ Winter (October-February):</span>
                  <span>Water once a week or less. Plants need less water in cooler weather.</span>
                </li>
              </ul>

              <h2 className="text-3xl font-bold text-gray-900 mb-4 mt-10 flex items-center gap-3">
                <span className="text-4xl">☀️</span>
                Light Requirements
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Different plants need different amounts of light. Here's how to match your plants with your home's lighting:
              </p>
              
              <div className="grid sm:grid-cols-2 gap-4 my-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5">
                  <h3 className="font-bold text-yellow-900 mb-2">Bright Indirect Light</h3>
                  <p className="text-sm text-yellow-800 mb-2">Near east or west windows</p>
                  <p className="text-xs text-yellow-700">Monstera, Pothos, Spider Plant, Rubber Plant</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
                  <h3 className="font-bold text-blue-900 mb-2">Low Light</h3>
                  <p className="text-sm text-blue-800 mb-2">North-facing rooms, bathrooms</p>
                  <p className="text-xs text-blue-700">Snake Plant, ZZ Plant, Peace Lily, Cast Iron Plant</p>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mb-4 mt-10 flex items-center gap-3">
                <span className="text-4xl">🌱</span>
                Fertilizing Indoor Plants
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Indoor plants need regular feeding to stay healthy and grow well. In India, use these fertilizing guidelines:
              </p>
              <ul className="space-y-2 text-gray-700 my-4">
                <li>✅ Use balanced NPK (10:10:10) liquid fertilizer</li>
                <li>✅ Dilute to half the recommended strength</li>
                <li>✅ Fertilize every 2-4 weeks during growing season (March-September)</li>
                <li>✅ Skip fertilizing in winter when growth slows</li>
                <li>✅ Organic options: Vermicompost, compost tea, banana peel water</li>
              </ul>

              <h2 className="text-3xl font-bold text-gray-900 mb-4 mt-10 flex items-center gap-3">
                <span className="text-4xl">🐛</span>
                Pest Control (Natural Methods)
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Common indoor plant pests in India include mealybugs, aphids, spider mites, and scale insects. 
                Here are natural, effective solutions:
              </p>
              <ol className="space-y-3 text-gray-700 my-4 list-decimal list-inside">
                <li><strong>Neem Oil Spray:</strong> Mix 1 tsp neem oil + 1 tsp liquid soap in 1 liter water. Spray weekly.</li>
                <li><strong>Soapy Water:</strong> For aphids and mealybugs, wipe leaves with diluted dish soap solution.</li>
                <li><strong>Alcohol Wipe:</strong> Dab cotton swab in rubbing alcohol to remove mealybugs directly.</li>
                <li><strong>Garlic Spray:</strong> Crush 4-5 garlic cloves in water, strain, and spray on affected plants.</li>
              </ol>

              <h2 className="text-3xl font-bold text-gray-900 mb-4 mt-10 flex items-center gap-3">
                <span className="text-4xl">🏆</span>
                Best Indoor Plants for Indian Homes
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                These plants are proven winners for Indian climate and beginner-friendly:
              </p>
              <div className="grid gap-4 my-6">
                {[
                  { name: 'Snake Plant', care: 'Extremely low maintenance, tolerates neglect', light: 'Low to bright' },
                  { name: 'Pothos/Money Plant', care: 'Fast growing, air purifying, very forgiving', light: 'Low to medium' },
                  { name: 'ZZ Plant', care: 'Drought tolerant, glossy leaves', light: 'Low to bright' },
                  { name: 'Spider Plant', care: 'Easy propagation, pet-friendly', light: 'Bright indirect' },
                  { name: 'Rubber Plant', care: 'Bold foliage, air purifier', light: 'Bright indirect' }
                ].map((plant) => (
                  <div key={plant.name} className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-5">
                    <h3 className="font-bold text-emerald-900 text-lg mb-2">{plant.name}</h3>
                    <p className="text-sm text-emerald-800 mb-1">Care: {plant.care}</p>
                    <p className="text-xs text-emerald-700">Light: {plant.light}</p>
                  </div>
                ))}
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 my-8">
                <h3 className="text-xl font-bold text-amber-900 mb-3">💡 Pro Tip</h3>
                <p className="text-amber-800">
                  Group plants with similar water and light needs together. This makes care easier and creates better humidity 
                  through transpiration, which is especially helpful during Indian summers.
                </p>
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mb-4 mt-10">Common Mistakes to Avoid</h2>
              <ul className="space-y-3 text-gray-700">
                <li>❌ <strong>Overwatering:</strong> #1 cause of plant death. Let soil dry between waterings.</li>
                <li>❌ <strong>Using tap water directly:</strong> Chlorine and salts can harm plants. Let water sit overnight.</li>
                <li>❌ <strong>Ignoring drainage:</strong> Always use pots with drainage holes.</li>
                <li>❌ <strong>Placing plants in AC draft:</strong> Sudden temperature changes stress plants.</li>
                <li>❌ <strong>Over-fertilizing:</strong> More fertilizer doesn't mean faster growth. Follow guidelines.</li>
              </ul>

              <div className="mt-12 p-8 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-3xl text-white">
                <h3 className="text-2xl font-bold mb-4">Ready to Start Your Indoor Garden?</h3>
                <p className="mb-6">Shop our collection of beginner-friendly indoor plants with expert care support included.</p>
                <Link 
                  href="/shop?category=indoor-plants"
                  className="inline-block bg-white text-emerald-700 font-bold px-8 py-3 rounded-full hover:bg-emerald-50 transition shadow-lg"
                >
                  Browse Indoor Plants →
                </Link>
              </div>
            </article>

            {/* FAQs */}
            <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Frequently Asked Questions
              </h2>
              <div className="space-y-6">
                {faqSchema.mainEntity.map((faq, index) => (
                  <div key={index} className="border-b border-gray-200 pb-6 last:border-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {faq.name}
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {faq.acceptedAnswer.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Navigation */}
            <div className="bg-white rounded-3xl shadow-lg p-6 sticky top-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Navigation</h3>
              <nav className="space-y-2 text-sm">
                <a href="#watering" className="block text-emerald-600 hover:text-emerald-700 hover:underline">
                  Watering Schedule
                </a>
                <a href="#light" className="block text-emerald-600 hover:text-emerald-700 hover:underline">
                  Light Requirements
                </a>
                <a href="#fertilizing" className="block text-emerald-600 hover:text-emerald-700 hover:underline">
                  Fertilizing Guide
                </a>
                <a href="#pests" className="block text-emerald-600 hover:text-emerald-700 hover:underline">
                  Pest Control
                </a>
                <a href="#best-plants" className="block text-emerald-600 hover:text-emerald-700 hover:underline">
                  Best Plants
                </a>
              </nav>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <Link
                  href="/shop?category=indoor-plants"
                  className="block w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-xl text-center transition shadow-md"
                >
                  Shop Indoor Plants
                </Link>
              </div>

              <div className="mt-4">
                <Link
                  href="/contact"
                  className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-3 px-4 rounded-xl text-center transition"
                >
                  Get Expert Help
                </Link>
              </div>
            </div>

            {/* Related Guides */}
            <div className="bg-white rounded-3xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Related Guides</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/seo-pages/watering-schedule" className="text-emerald-600 hover:text-emerald-700 hover:underline">
                    Plant Watering Schedule →
                  </Link>
                </li>
                <li>
                  <Link href="/seo-pages/pest-control-natural" className="text-emerald-600 hover:text-emerald-700 hover:underline">
                    Natural Pest Control →
                  </Link>
                </li>
                <li>
                  <Link href="/seo-pages/organic-fertilizers" className="text-emerald-600 hover:text-emerald-700 hover:underline">
                    Organic Fertilizers Guide →
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-emerald-600 hover:text-emerald-700 hover:underline">
                    Gardening Blog →
                  </Link>
                </li>
              </ul>
            </div>

            {/* Stats */}
            <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-3xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-bold mb-4">By the Numbers</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-3xl font-bold">2,000+</p>
                  <p className="text-sm text-emerald-100">Words of expert advice</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">15+</p>
                  <p className="text-sm text-emerald-100">Plant species covered</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">10+</p>
                  <p className="text-sm text-emerald-100">Years of expertise</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
