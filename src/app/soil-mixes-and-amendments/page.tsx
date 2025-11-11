import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Soil Mixes & Amendments | Cinder, Leaf Mould, Premium Soil Mix',
  description:
    'Boost plant growth with premium soil mixes and amendments. Shop Cinder, Leaf Mould, and our signature Soil Mix. Fast delivery across India.',
  alternates: { canonical: '/soil-mixes-and-amendments' },
  openGraph: {
    title: 'Premium Soil Mixes & Amendments | Cinder • Leaf Mould • Soil Mix',
    description:
      'Professional-grade substrates for healthy roots and faster growth. Order Cinder, Leaf Mould, and our signature Soil Mix today.',
    url: 'https://wholelotofnature.com/soil-mixes-and-amendments',
  },
};

export default function SoilLandingPage() {
  const bullets = [
    'Aeration for strong roots and drainage that prevents rot',
    'Balanced moisture retention to reduce watering stress',
    'Organic nutrition that feeds your plants for weeks',
    'Cleaner, pest-resistant mix for indoor and balcony gardening',
  ];

  const highlights = [
    {
      title: 'Premium Soil Mix',
      desc:
        'All-purpose mix for houseplants & balcony gardens. Optimized drainage + moisture retention.',
      img: '/hero-leaves.svg',
      href: '/shop?search=soil%20mix',
      badge: 'Best Seller',
    },
    {
      title: 'Leaf Mould',
      desc:
        'Organic amendment that boosts microbial life and long-lasting nutrition.',
      img: '/hero-leaves.svg',
      href: '/shop?search=leaf%20mould',
      badge: 'Organic',
    },
    {
      title: 'Cinder',
      desc:
        'Lightweight porous aggregate for excellent aeration and drainage in potted plants.',
      img: '/hero-leaves.svg',
      href: '/shop?search=cinder',
      badge: 'Pro Tip',
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/hero-leaves.svg" alt="Leaves" fill className="object-cover opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/85 to-white" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
            Soil Mixes & Amendments for Faster Growth
          </h1>
          <p className="mt-4 text-lg text-gray-700 max-w-3xl mx-auto">
            Get professional-grade substrates trusted by growers. Healthier roots, greener leaves, better blooms.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link href="/shop?category=soil-and-growing-media" className="inline-block px-8 py-3 bg-primary-700 text-white border border-primary-700 rounded-none font-semibold hover:bg-white hover:text-primary-700 transition-all">
              Shop Soil & Media
            </Link>
            <a href="#products" className="inline-block px-8 py-3 border-2 border-primary-700 text-primary-700 rounded-none font-semibold hover:bg-primary-700 hover:text-white transition-all">
              See Featured Products
            </a>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Upgrade Your Soil?</h2>
              <p className="text-gray-700 mb-6">
                Soil quality is the single biggest factor in your plant’s health. Our mixes are engineered to keep roots oxygenated, hydrated, and nourished.
              </p>
              <ul className="space-y-3">
                {bullets.map((b) => (
                  <li key={b} className="flex items-start gap-3">
                    <span className="mt-1 w-2 h-2 bg-primary-700" />
                    <span className="text-gray-700">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {highlights.map((h) => (
                <div key={h.title} className="border border-gray-200 p-5">
                  <div className="text-xs uppercase tracking-wide text-primary-700 mb-2">{h.badge}</div>
                  <div className="relative h-28 bg-primary-50 overflow-hidden">
                    <Image src={h.img} alt={h.title} fill className="object-cover opacity-80" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mt-3">{h.title}</h3>
                  <p className="text-gray-600 text-sm mt-2">{h.desc}</p>
                  <div className="mt-4">
                    <Link href={h.href} className="inline-block px-5 py-2 bg-primary-700 text-white border border-primary-700 rounded-none font-semibold hover:bg-white hover:text-primary-700 transition-all">
                      Shop Now
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-14 bg-primary-50/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            {[{ k: '4.8/5', v: 'Average Rating' }, { k: '25,000+', v: 'Orders Delivered' }, { k: '48h', v: 'Avg. Dispatch' }].map((s) => (
              <div key={s.v} className="bg-white border border-primary-100 p-8">
                <div className="text-3xl font-extrabold text-primary-700">{s.k}</div>
                <div className="text-gray-700 mt-2">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Section */}
      <section id="products" className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">Featured Products</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {highlights.map((h) => (
              <div key={h.title} className="border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-gray-900">{h.title}</h3>
                <p className="text-gray-600 mt-2">{h.desc}</p>
                <div className="mt-4 flex gap-3">
                  <Link href={h.href} className="px-5 py-2 bg-primary-700 text-white border border-primary-700 rounded-none font-semibold hover:bg-white hover:text-primary-700 transition-all">Add to Cart</Link>
                  <Link href={h.href} className="px-5 py-2 border-2 border-primary-700 text-primary-700 rounded-none font-semibold hover:bg-primary-700 hover:text-white transition-all">Learn More</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">FAQs</h2>
          <div className="divide-y divide-gray-200">
            {[
              { q: 'Is cinder safe for all plants?', a: 'Yes. It is inert and supports aeration. Use 10–30% of your mix depending on plant type.' },
              { q: 'How often should I repot with fresh soil mix?', a: 'Most houseplants benefit from a refresh every 8–12 months depending on growth and salt build-up.' },
              { q: 'Can I use leaf mould indoors?', a: 'Absolutely. Leaf mould is a gentle organic amendment that improves structure and moisture retention.' },
            ].map((f) => (
              <div key={f.q} className="py-4">
                <div className="font-semibold text-gray-900">{f.q}</div>
                <div className="text-gray-600 mt-1">{f.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-primary-700 to-primary-600">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold">Upgrade Your Soil Today</h2>
          <p className="mt-3 opacity-90">Healthier roots. Faster growth. Happier plants.</p>
          <div className="mt-6">
            <Link href="/shop?category=soil-and-growing-media" className="inline-block px-8 py-3 bg-white text-primary-700 border border-white rounded-none font-semibold hover:bg-primary-50 transition-all">Shop Soil & Media</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
