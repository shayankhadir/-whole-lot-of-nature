import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gardening Guides | Whole Lot of Nature',
  description: 'Practical gardening guides and quick answers to help you choose the right plants and supplies.',
  alternates: {
    canonical: 'https://wholelotofnature.com/seo-pages',
  },
  openGraph: {
    title: 'Gardening Guides | Whole Lot of Nature',
    description: 'Practical gardening guides and quick answers to help you choose the right plants and supplies.',
    url: 'https://wholelotofnature.com/seo-pages',
    images: ['https://wholelotofnature.com/images/og-image.jpg'],
  },
};

export default function SeoPagesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0D1B0F] text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-start justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold antialiased">Gardening Guides</h1>
            <p className="text-white/75 mt-2 max-w-2xl antialiased">
              Quick, practical guides designed to help you make better choices—then head back to the shop to buy the right plants and supplies.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center rounded-xl px-4 py-2.5 bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-semibold transition"
            >
              Shop
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-xl px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white font-semibold transition border border-white/10"
            >
              Get Help
            </Link>
          </div>
        </div>

        {children}

        <div className="mt-12 rounded-2xl border border-[#2E7D32]/30 bg-white/5 p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold antialiased">Ready to buy the right products?</h2>
              <p className="text-white/75 mt-1 antialiased">
                Use these guides as a checklist, then browse our curated selection.
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center rounded-xl px-5 py-3 bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-semibold transition"
              >
                Browse Shop
              </Link>
              <Link
                href="/combos"
                className="inline-flex items-center justify-center rounded-xl px-5 py-3 bg-white/10 hover:bg-white/15 text-white font-semibold transition border border-white/10"
              >
                View Combos
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
