import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function AdminContentPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/admin"
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold font-display">Content</h1>
            <p className="text-white/80">Blog and social media content tools.</p>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
          <p className="text-white/80 leading-relaxed">
            Use the Blog Agent to draft posts, plan content, and manage publishing workflows.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link
              href="/blog-agent"
              className="inline-flex items-center justify-center rounded-xl px-5 py-3 bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-semibold transition"
            >
              Open Blog Agent
            </Link>
            <Link
              href="/admin/pages"
              className="inline-flex items-center justify-center rounded-xl px-5 py-3 bg-white/10 hover:bg-white/15 text-white font-semibold transition border border-white/10"
            >
              View Site Map
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
