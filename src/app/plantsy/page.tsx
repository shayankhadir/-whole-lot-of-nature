import type { Metadata } from 'next';

export const metadata: Metadata = {
  openGraph: {
    title: 'Plantsy | Whole Lot of Nature',
    description: 'Discover premium plants and gardening supplies at Whole Lot of Nature. Expert advice and quality products for your green space in Bangalore.',
    images: ['https://wholelotofnature.com/images/og-image.jpg'],
    url: 'https://wholelotofnature.com/plantsy',
  },
  title: 'Plantsy | Plant Doctor & Chatbot',
  description: 'Chat with Plantsy to get instant plant care advice grounded in Whole Lot of Nature products and guides.',
};

export default function PlantsyPage() {
  return (
    <section className="relative isolate overflow-hidden bg-[#0D1B0F] px-4 py-20">
      {/* Decorative gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-emerald-900/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-800/20 rounded-full blur-3xl" />
      </div>
      
      <div className="relative mx-auto max-w-4xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">Live beta</p>
        <h1 className="mt-4 text-4xl font-bold text-[#daf2d0] sm:text-5xl">
          Plantsy is now available for care questions
        </h1>
        <p className="mt-6 text-lg text-emerald-200/80">
          Get hyperlocal guidance powered by your WooCommerce catalog, blog posts, and verified horticulture tips. Plantsy can recommend
          soil mixes, ideal lighting, and the best combos — all in natural language.
        </p>
      </div>

      <div className="relative mx-auto mt-12 max-w-2xl rounded-3xl border border-emerald-900/50 bg-[#0d3512]/50 backdrop-blur-sm p-8 text-center shadow-[0_25px_80px_-40px_rgba(5,150,105,0.4)]">
        <p className="text-lg text-white/90">
          Plantsy now lives on every page as a floating launcher. Tap the green bubble on the bottom-right corner to open a chat and
          receive personalised routines, soil recommendations, and companion product suggestions.
        </p>
        <p className="mt-4 text-sm text-emerald-400">
          Need the API endpoint? POST to <code className="rounded bg-emerald-900/50 px-2 py-1 text-emerald-300">/api/agents/plantsy</code> with your question and optional context.
        </p>
      </div>
    </section>
  );
}
