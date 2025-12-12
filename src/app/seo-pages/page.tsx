import Link from 'next/link';
import { SEO_PAGES } from '@/lib/seo/seoPages';

export default function SeoPagesIndex() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {SEO_PAGES.map((p) => (
        <Link
          key={p.slug}
          href={`/seo-pages/${p.slug}`}
          className="rounded-2xl border border-white/10 bg-white/5 hover:bg-white/7 transition p-6"
        >
          <h2 className="text-xl font-semibold text-white antialiased">{p.title}</h2>
          <p className="text-white/75 mt-2 text-sm leading-relaxed antialiased">{p.description}</p>
          <div className="mt-4 inline-flex items-center gap-2 text-[#66BB6A] font-semibold text-sm">
            Open guide
            <span aria-hidden className="text-white/50">→</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
