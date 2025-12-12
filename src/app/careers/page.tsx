import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Careers | Whole Lot of Nature',
  description: 'Careers and opportunities at Whole Lot of Nature.',
  openGraph: {
    title: 'Careers | Whole Lot of Nature',
    description: 'Careers and opportunities at Whole Lot of Nature.',
    images: ['https://wholelotofnature.com/images/og-image.jpg'],
    url: 'https://wholelotofnature.com/careers',
  },
};

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-[#0D1B0F] text-white">
      <section className="py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#66BB6A] antialiased mb-4">
            Careers
          </h1>
          <p className="text-white/80 leading-relaxed max-w-3xl antialiased">
            We are always looking for people who care about plants, customer experience, and building a high-quality gardening brand.
          </p>

          <div className="mt-10 bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white antialiased mb-2">How to apply</h2>
            <p className="text-white/80 leading-relaxed">
              Send your resume and a short note about the role you are interested in.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-xl px-5 py-3 bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-semibold transition"
              >
                Contact Us
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center rounded-xl px-5 py-3 bg-white/10 hover:bg-white/15 text-white font-semibold transition border border-white/10"
              >
                Learn About Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
