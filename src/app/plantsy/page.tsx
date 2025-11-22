export const metadata = {
  title: 'Plantsy | Plant Doctor & Chatbot',
  description: 'Chat with Plantsy to get instant plant care advice grounded in Whole Lot of Nature products and guides.',
};

export default function PlantsyPage() {
  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-b from-emerald-50 via-white to-emerald-100 px-4 py-20">
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">Live beta</p>
        <h1 className="mt-4 text-4xl font-bold text-emerald-700 sm:text-5xl">
          Plantsy is now available for care questions
        </h1>
        <p className="mt-6 text-lg text-emerald-600">
          Get hyperlocal guidance powered by your WooCommerce catalog, blog posts, and verified horticulture tips. Plantsy can recommend
          soil mixes, ideal lighting, and the best combos — all in natural language.
        </p>
      </div>

      <div className="mx-auto mt-12 max-w-2xl rounded-3xl border border-emerald-100 bg-white/70 p-8 text-center shadow-[0_25px_80px_-40px_rgba(5,150,105,0.9)]">
        <p className="text-lg text-emerald-700">
          Plantsy now lives on every page as a floating launcher. Tap the green bubble on the bottom-right corner to open a chat and
          receive personalised routines, soil recommendations, and companion product suggestions.
        </p>
        <p className="mt-4 text-sm text-emerald-400">
          Need the API endpoint? POST to <code className="rounded bg-emerald-50 px-2 py-1">/api/agents/plantsy</code> with your question and optional context.
        </p>
      </div>
    </section>
  );
}
