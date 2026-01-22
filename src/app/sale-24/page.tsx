import Link from 'next/link';

export const metadata = {
  title: '24-Hour Plant Sale | Whole Lot of Nature',
  description: 'Limited 24-hour offer on best-selling plants and care bundles. Shop now for fast delivery in Bangalore.',
  openGraph: {
    title: '24-Hour Plant Sale | Whole Lot of Nature',
    description: 'Limited 24-hour offer on best-selling plants and care bundles. Shop now for fast delivery in Bangalore.',
    url: 'https://wholelotofnature.com/sale-24',
    images: ['https://wholelotofnature.com/sale-24/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const HIGHLIGHTS = [
  'Top indoor plants for workspaces and living rooms',
  'Ready-to-ship soil and care bundles',
  'Fast delivery in Bangalore with safe packaging',
  'Limited 24-hour pricing to drive immediate sales',
];

export default function Sale24Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#06110b] via-[#0a1f15] to-[#0f2a1c] text-white">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 text-emerald-200 text-xs uppercase tracking-[0.2em]">
          24-hour sale
        </div>

        <h1 className="mt-6 text-4xl md:text-5xl font-bold leading-tight">
          Bring home your next plant in the next 24 hours.
        </h1>
        <p className="mt-4 text-lg text-white/70 max-w-2xl">
          We curated our most-loved indoor plants, soil mixes, and care kits into a single 24-hour drop. Shop now and get them delivered quickly across Bangalore.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white font-semibold shadow-lg shadow-emerald-500/25"
          >
            Shop the 24-hour drop
          </Link>
          <Link
            href="/cart"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-white/20 text-white/80 hover:text-white hover:border-white/40"
          >
            Review your cart
          </Link>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {HIGHLIGHTS.map((item) => (
            <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm text-white/80">{item}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6">
          <h2 className="text-xl font-semibold">Need help choosing?</h2>
          <p className="mt-2 text-white/70">
            Reply to any outreach email or use Plantsy AI chat to get a personalized plant bundle in minutes.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/plantsy"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm"
            >
              Chat with Plantsy AI
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm"
            >
              Contact support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
