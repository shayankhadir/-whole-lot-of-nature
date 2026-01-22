/**
 * SEO Landing Page: Organic Fertilizers Guide for Indian Gardens
 * Hand-crafted content for organic SEO
 * Target Keywords: organic fertilizers india, natural plant food, homemade fertilizer
 */

import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Organic Fertilizers Guide: Best Natural Plant Food for Indian Gardens | Whole Lot of Nature',
  description: 'Complete guide to organic fertilizers for Indian gardens. Learn about vermicompost, neem cake, bone meal, and homemade fertilizers. Expert tips from Bangalore plant experts.',
  keywords: [
    'organic fertilizers india',
    'natural plant food',
    'homemade fertilizer for plants',
    'best organic fertilizer',
    'vermicompost bangalore',
    'neem cake fertilizer',
    'organic gardening india',
    'natural compost'
  ],
  openGraph: {
    title: 'Organic Fertilizers Guide: Best Natural Plant Food for Indian Gardens',
    description: 'Complete guide to organic fertilizers for Indian gardens. Learn about vermicompost, neem cake, and homemade fertilizers.',
    type: 'article',
  },
};

export default function OrganicFertilizersPage() {
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
            <span className="text-white/70">Organic Fertilizers</span>
          </nav>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 antialiased">
            Organic Fertilizers Guide: Feed Your Plants the Natural Way
          </h1>
          <p className="text-xl text-white/70 leading-relaxed antialiased">
            Discover the best organic fertilizers for Indian gardens. From kitchen waste to commercial options, 
            learn how to nourish your plants naturally and sustainably.
          </p>
          <div className="flex flex-wrap gap-2 mt-6">
            <span className="bg-[#2E7D32]/30 text-[#66BB6A] px-3 py-1 rounded-full text-sm font-semibold border border-[#66BB6A]/30">Organic</span>
            <span className="bg-[#2E7D32]/30 text-[#66BB6A] px-3 py-1 rounded-full text-sm font-semibold border border-[#66BB6A]/30">Fertilizers</span>
            <span className="bg-[#2E7D32]/30 text-[#66BB6A] px-3 py-1 rounded-full text-sm font-semibold border border-[#66BB6A]/30">Composting</span>
            <span className="bg-[#2E7D32]/30 text-[#66BB6A] px-3 py-1 rounded-full text-sm font-semibold border border-[#66BB6A]/30">Sustainable</span>
          </div>
        </header>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Content Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Introduction */}
            <article className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4 antialiased">
                Why Go Organic with Fertilizers?
              </h2>
              <p className="text-white/80 mb-4 leading-relaxed">
                Chemical fertilizers give quick results but damage soil health over time. They kill beneficial 
                microorganisms, make plants dependent on synthetic nutrients, and can burn roots if overused. 
                Organic fertilizers work differently.
              </p>
              <p className="text-white/80 leading-relaxed">
                <strong className="text-white">Organic fertilizers improve soil structure</strong>, encourage earthworms 
                and beneficial bacteria, release nutrients slowly (no burn risk), and are safe for your family and pets. 
                In the long run, organic gardening creates self-sustaining, healthy soil.
              </p>
            </article>

            {/* NPK Explained */}
            <article className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4 antialiased">
                🧪 Understanding NPK (Plant Nutrition Basics)
              </h2>
              <p className="text-white/80 mb-4 leading-relaxed">
                Every fertilizer label shows three numbers (like 4-2-3). These represent the percentage of three 
                essential nutrients:
              </p>
              
              <div className="grid md:grid-cols-3 gap-4 my-6">
                <div className="bg-[#2E7D32]/20 border border-[#66BB6A]/30 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-[#66BB6A] mb-2">N</div>
                  <h4 className="font-bold text-white mb-1">Nitrogen</h4>
                  <p className="text-sm text-white/70">Promotes leafy green growth. Essential for foliage plants.</p>
                </div>
                <div className="bg-[#2E7D32]/20 border border-[#66BB6A]/30 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-[#66BB6A] mb-2">P</div>
                  <h4 className="font-bold text-white mb-1">Phosphorus</h4>
                  <p className="text-sm text-white/70">Supports root development and flowering. Key for blooming plants.</p>
                </div>
                <div className="bg-[#2E7D32]/20 border border-[#66BB6A]/30 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-[#66BB6A] mb-2">K</div>
                  <h4 className="font-bold text-white mb-1">Potassium</h4>
                  <p className="text-sm text-white/70">Strengthens stems, improves disease resistance and fruit quality.</p>
                </div>
              </div>
            </article>

            {/* Best Organic Fertilizers */}
            <article className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4 antialiased">
                🌱 Best Organic Fertilizers Available in India
              </h2>
              
              <div className="space-y-6">
                {/* Vermicompost */}
                <div className="border-b border-white/10 pb-6">
                  <h3 className="text-xl font-bold text-[#66BB6A] mb-2">1. Vermicompost (Earthworm Compost)</h3>
                  <p className="text-white/80 mb-3">
                    <strong className="text-white">The gold standard.</strong> Made by earthworms processing organic waste. 
                    Rich in beneficial microbes, enzymes, and plant growth hormones.
                  </p>
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-sm text-white/70"><strong className="text-white">NPK:</strong> 1.5-2-1 (approximately)</p>
                    <p className="text-sm text-white/70"><strong className="text-white">Best for:</strong> All plants, especially vegetables and flowers</p>
                    <p className="text-sm text-white/70"><strong className="text-white">How to use:</strong> Mix 20% into potting soil, or top-dress monthly</p>
                    <p className="text-sm text-white/70"><strong className="text-white">Price:</strong> ₹50-80 per kg</p>
                  </div>
                </div>

                {/* Neem Cake */}
                <div className="border-b border-white/10 pb-6">
                  <h3 className="text-xl font-bold text-[#66BB6A] mb-2">2. Neem Cake (Neem Khali)</h3>
                  <p className="text-white/80 mb-3">
                    <strong className="text-white">Fertilizer + pest control in one.</strong> Byproduct of neem oil extraction. 
                    Contains azadirachtin which repels pests and nematodes.
                  </p>
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-sm text-white/70"><strong className="text-white">NPK:</strong> 5-1-2</p>
                    <p className="text-sm text-white/70"><strong className="text-white">Best for:</strong> Vegetables, fruit trees, roses</p>
                    <p className="text-sm text-white/70"><strong className="text-white">How to use:</strong> 50g per 12-inch pot, work into soil</p>
                    <p className="text-sm text-white/70"><strong className="text-white">Price:</strong> ₹40-60 per kg</p>
                  </div>
                </div>

                {/* Bone Meal */}
                <div className="border-b border-white/10 pb-6">
                  <h3 className="text-xl font-bold text-[#66BB6A] mb-2">3. Bone Meal (Steamed)</h3>
                  <p className="text-white/80 mb-3">
                    <strong className="text-white">Phosphorus powerhouse.</strong> Excellent for root development and 
                    flowering. Releases nutrients slowly over 3-4 months.
                  </p>
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-sm text-white/70"><strong className="text-white">NPK:</strong> 3-15-0</p>
                    <p className="text-sm text-white/70"><strong className="text-white">Best for:</strong> Flowering plants, bulbs, tomatoes, peppers</p>
                    <p className="text-sm text-white/70"><strong className="text-white">How to use:</strong> 1 tablespoon per plant at planting time</p>
                    <p className="text-sm text-white/70"><strong className="text-white">Price:</strong> ₹80-120 per kg</p>
                  </div>
                </div>

                {/* Mustard Cake */}
                <div className="border-b border-white/10 pb-6">
                  <h3 className="text-xl font-bold text-[#66BB6A] mb-2">4. Mustard Cake (Sarson Khali)</h3>
                  <p className="text-white/80 mb-3">
                    <strong className="text-white">High-nitrogen organic option.</strong> Popular in North India. 
                    Excellent for leafy vegetables and lawn grass.
                  </p>
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-sm text-white/70"><strong className="text-white">NPK:</strong> 5-2-1</p>
                    <p className="text-sm text-white/70"><strong className="text-white">Best for:</strong> Leafy greens, palms, lawns</p>
                    <p className="text-sm text-white/70"><strong className="text-white">How to use:</strong> Make liquid fertilizer - soak 100g in 5L water for 24hrs</p>
                    <p className="text-sm text-white/70"><strong className="text-white">Price:</strong> ₹30-50 per kg</p>
                  </div>
                </div>

                {/* Cow Dung Compost */}
                <div className="pb-2">
                  <h3 className="text-xl font-bold text-[#66BB6A] mb-2">5. Cow Dung Compost (Gobar Khad)</h3>
                  <p className="text-white/80 mb-3">
                    <strong className="text-white">Traditional Indian fertilizer.</strong> Must be fully composted 
                    (aged 3-6 months). Fresh dung burns plants!
                  </p>
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-sm text-white/70"><strong className="text-white">NPK:</strong> 0.5-0.3-0.5</p>
                    <p className="text-sm text-white/70"><strong className="text-white">Best for:</strong> Soil amendment, vegetables, fruit trees</p>
                    <p className="text-sm text-white/70"><strong className="text-white">How to use:</strong> Mix 30% into garden soil</p>
                    <p className="text-sm text-white/70"><strong className="text-white">Price:</strong> ₹20-40 per kg</p>
                  </div>
                </div>
              </div>
            </article>

            {/* Homemade Fertilizers */}
            <article className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4 antialiased">
                🏠 DIY Fertilizers from Kitchen Waste
              </h2>
              <p className="text-white/80 mb-4 leading-relaxed">
                Don&apos;t throw away these kitchen scraps - they&apos;re plant food gold!
              </p>
              
              <div className="space-y-4">
                <div className="bg-[#2E7D32]/10 border-l-4 border-[#66BB6A] p-4 rounded-r-lg">
                  <h4 className="font-bold text-white mb-1">🍌 Banana Peel Fertilizer (High Potassium)</h4>
                  <p className="text-white/70 text-sm">Chop peels, dry in sun for 2 days, grind to powder. Sprinkle around flowering plants.</p>
                </div>
                <div className="bg-[#2E7D32]/10 border-l-4 border-[#66BB6A] p-4 rounded-r-lg">
                  <h4 className="font-bold text-white mb-1">🥚 Eggshell Calcium Boost</h4>
                  <p className="text-white/70 text-sm">Crush dried eggshells into powder. Add 1 tbsp per pot for calcium. Great for tomatoes and peppers.</p>
                </div>
                <div className="bg-[#2E7D32]/10 border-l-4 border-[#66BB6A] p-4 rounded-r-lg">
                  <h4 className="font-bold text-white mb-1">☕ Used Tea Leaves / Coffee Grounds</h4>
                  <p className="text-white/70 text-sm">Dry completely first! Add to compost or mix small amounts into soil. Slightly acidic - good for ferns, roses.</p>
                </div>
                <div className="bg-[#2E7D32]/10 border-l-4 border-[#66BB6A] p-4 rounded-r-lg">
                  <h4 className="font-bold text-white mb-1">🍚 Rice Water</h4>
                  <p className="text-white/70 text-sm">Water used after washing rice. Dilute 1:1 with water and use weekly. Rich in starch and nutrients.</p>
                </div>
                <div className="bg-[#2E7D32]/10 border-l-4 border-[#66BB6A] p-4 rounded-r-lg">
                  <h4 className="font-bold text-white mb-1">🧅 Onion Peel Tea</h4>
                  <p className="text-white/70 text-sm">Soak onion peels in water for 24 hours. Strain and water plants. Good source of potassium and sulfur.</p>
                </div>
              </div>
            </article>

            {/* Fertilizing Schedule */}
            <article className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4 antialiased">
                📅 When to Fertilize (Seasonal Schedule for India)
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4 border-b border-white/10 pb-4">
                  <span className="text-2xl">🌸</span>
                  <div>
                    <h4 className="font-bold text-white">Spring (Feb-Mar)</h4>
                    <p className="text-white/70 text-sm">Start fertilizing as new growth appears. Best time to repot with fresh compost.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 border-b border-white/10 pb-4">
                  <span className="text-2xl">☀️</span>
                  <div>
                    <h4 className="font-bold text-white">Summer (Apr-Jun)</h4>
                    <p className="text-white/70 text-sm">Active growing season. Fertilize every 2-3 weeks with diluted liquid fertilizer.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 border-b border-white/10 pb-4">
                  <span className="text-2xl">🌧️</span>
                  <div>
                    <h4 className="font-bold text-white">Monsoon (Jul-Sep)</h4>
                    <p className="text-white/70 text-sm">Reduce or pause fertilizing. Heavy rains wash away nutrients. Soil stays too wet.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-2xl">❄️</span>
                  <div>
                    <h4 className="font-bold text-white">Winter (Oct-Jan)</h4>
                    <p className="text-white/70 text-sm">Most plants go dormant. Stop fertilizing or reduce to once a month.</p>
                  </div>
                </div>
              </div>
            </article>

            {/* Common Mistakes */}
            <article className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4 antialiased">
                ⚠️ Common Fertilizing Mistakes to Avoid
              </h2>
              
              <ul className="space-y-3 text-white/80">
                <li className="flex items-start gap-3">
                  <span className="text-red-400 mt-1">✗</span>
                  <span><strong className="text-white">Fertilizing dry soil</strong> - Always water first, then fertilize. Dry roots get burned.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 mt-1">✗</span>
                  <span><strong className="text-white">More is better mentality</strong> - Excess fertilizer damages roots. Follow recommended doses.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 mt-1">✗</span>
                  <span><strong className="text-white">Fertilizing sick plants</strong> - Stressed plants can&apos;t absorb nutrients. Fix the underlying issue first.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 mt-1">✗</span>
                  <span><strong className="text-white">Using fresh organic matter</strong> - Uncomposted kitchen waste or fresh manure burns roots and attracts pests.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 mt-1">✗</span>
                  <span><strong className="text-white">Ignoring soil pH</strong> - Some plants need acidic soil (azaleas) while others prefer alkaline (lavender).</span>
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
                    Can I use chemical and organic fertilizers together?
                  </h3>
                  <p className="text-white/70">
                    Yes, but reduce chemical doses. Organic fertilizers work slowly; chemicals act fast. 
                    Many gardeners use organic as base nutrition and chemicals for quick boosts during flowering.
                  </p>
                </div>
                <div className="border-b border-white/10 pb-4">
                  <h3 className="text-lg font-semibold text-white mb-2 antialiased">
                    Why do my plants have yellow leaves despite fertilizing?
                  </h3>
                  <p className="text-white/70">
                    Could be overwatering (most common), wrong pH preventing nutrient absorption, or 
                    specific nutrient deficiency. Yellow between veins = iron or magnesium deficiency. 
                    Entire leaf yellow = nitrogen deficiency.
                  </p>
                </div>
                <div className="border-b border-white/10 pb-4">
                  <h3 className="text-lg font-semibold text-white mb-2 antialiased">
                    How long do organic fertilizers take to work?
                  </h3>
                  <p className="text-white/70">
                    2-4 weeks for visible results. Organic fertilizers need to be broken down by soil microbes first. 
                    This is slower than chemical fertilizers (days) but healthier for long-term soil health.
                  </p>
                </div>
                <div className="pb-4">
                  <h3 className="text-lg font-semibold text-white mb-2 antialiased">
                    What&apos;s the best all-purpose organic fertilizer?
                  </h3>
                  <p className="text-white/70">
                    Vermicompost is the safest all-rounder. For a more balanced option, mix vermicompost + 
                    neem cake + bone meal in 2:1:1 ratio. This covers NPK needs plus pest protection.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* CTA Box */}
            <div className="bg-gradient-to-br from-[#2E7D32] to-[#1B5E20] rounded-2xl p-6 text-white sticky top-4 border border-[#66BB6A]/30">
              <h3 className="text-2xl font-bold mb-4 antialiased">Shop Organic</h3>
              <p className="mb-6 text-white/90">
                Premium vermicompost, neem cake, and soil mixes delivered to your doorstep.
              </p>
              <Link
                href="/shop?category=soil-and-growing-media"
                className="block w-full bg-white text-[#2E7D32] font-bold py-3 px-6 rounded-lg text-center hover:bg-gray-100 transition-colors antialiased"
              >
                Shop Fertilizers
              </Link>
              <div className="mt-6 pt-6 border-t border-[#66BB6A]/30">
                <p className="text-sm mb-4 text-white/90">Need custom soil mix advice?</p>
                <Link
                  href="/contact"
                  className="block w-full bg-[#1B5E20] hover:bg-[#145218] text-white font-semibold py-2 px-4 rounded-lg text-center transition-colors"
                >
                  Ask Our Experts
                </Link>
              </div>
            </div>

            {/* Quick Reference */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mt-6">
              <h3 className="text-lg font-bold text-white mb-4 antialiased">
                🌿 Quick NPK Guide
              </h3>
              <ul className="space-y-3 text-white/80 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-[#66BB6A]">🌿</span>
                  <span>High N: Leafy growth (spinach, palms)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#66BB6A]">🌸</span>
                  <span>High P: Flowers & roots (roses, bulbs)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#66BB6A]">🍅</span>
                  <span>High K: Fruits & strength (tomatoes)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#66BB6A]">⚖️</span>
                  <span>Balanced: General purpose</span>
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
                  <Link href="/seo-pages/indoor-plants-care" className="text-[#66BB6A] hover:text-[#81C784] hover:underline">
                    Indoor Plants Care Guide
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
                Why Buy From Us?
              </h3>
              <div className="space-y-4 text-sm">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">✅</span>
                  <span className="text-white/80">100% Certified Organic</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🚚</span>
                  <span className="text-white/80">Free Delivery ₹999+</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📦</span>
                  <span className="text-white/80">Freshness Guaranteed</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">💬</span>
                  <span className="text-white/80">Expert Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
