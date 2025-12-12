import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Track Your Order | Whole Lot of Nature',
  description: 'Track your order status and delivery updates for Whole Lot of Nature purchases.',
  alternates: {
    canonical: 'https://wholelotofnature.com/track-order',
  },
};

export default function TrackOrderPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0d3512] via-[#0a2810] to-[#061208] text-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl sm:text-4xl font-bold antialiased">Track your order</h1>
        <p className="mt-3 text-white/80 antialiased">
          The fastest way to see updates is through your account orders page. If you need help, contact us and we’ll assist.
        </p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/account"
            className="rounded-2xl border border-[#2E7D32]/30 bg-white/5 hover:bg-white/7 transition p-6"
          >
            <h2 className="text-xl font-semibold antialiased">View my orders</h2>
            <p className="mt-2 text-white/75 text-sm antialiased">
              Open your account dashboard to view order status, invoices, and updates.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 text-[#66BB6A] font-semibold text-sm">
              Go to account
              <span aria-hidden className="text-white/50">→</span>
            </div>
          </Link>

          <Link
            href="/contact"
            className="rounded-2xl border border-white/10 bg-white/5 hover:bg-white/7 transition p-6"
          >
            <h2 className="text-xl font-semibold antialiased">Need help?</h2>
            <p className="mt-2 text-white/75 text-sm antialiased">
              Contact support with your name and order details for quick assistance.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 text-[#66BB6A] font-semibold text-sm">
              Contact support
              <span aria-hidden className="text-white/50">→</span>
            </div>
          </Link>
        </div>

        <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h3 className="text-lg font-semibold antialiased">Shopping again?</h3>
          <p className="mt-2 text-white/75 text-sm antialiased">Browse our latest plants and bundles.</p>
          <div className="mt-4 flex gap-3">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center rounded-xl px-5 py-3 bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-semibold transition"
            >
              Shop plants
            </Link>
            <Link
              href="/combos"
              className="inline-flex items-center justify-center rounded-xl px-5 py-3 bg-white/10 hover:bg-white/15 text-white font-semibold transition border border-white/10"
            >
              View combos
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
