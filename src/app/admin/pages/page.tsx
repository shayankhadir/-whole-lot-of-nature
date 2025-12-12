import Link from 'next/link';
import { ArrowLeft, Globe, FileText, Layout, ShoppingBag, Users, BookOpen } from 'lucide-react';
import { SEO_PAGES } from '@/lib/seo/seoPages';
import { siteAudit } from '@/data/siteAudit.generated';

/*
export const metadata: Metadata = {
  title: 'Admin | Whole Lot of Nature',
  description: 'Discover premium plants and gardening supplies at Whole Lot of Nature. Expert advice and quality products for your green space in Bangalore.',
  openGraph: {
    title: 'Admin | Whole Lot of Nature',
    description: 'Discover premium plants and gardening supplies at Whole Lot of Nature. Expert advice and quality products for your green space in Bangalore.',
    images: ['https://wholelotofnature.com/images/og-image.jpg'],
    url: 'https://wholelotofnature.com/admin',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Admin | Whole Lot of Nature',
    description: 'Discover premium plants and gardening supplies at Whole Lot of Nature. Expert advice and quality products for your green space in Bangalore.',
    images: ['https://wholelotofnature.com/images/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://wholelotofnature.com/admin',
  },
};
*/



type PageLink = { name: string; path: string; status: 'Live' | 'Protected' };

const siteMap: Array<{ category: string; icon: typeof Globe; links: PageLink[] }> = [
  {
    category: 'Main Pages',
    icon: Globe,
    links: [
      { name: 'Home', path: '/', status: 'Live' },
      { name: 'Shop', path: '/shop', status: 'Live' },
      { name: 'About Us', path: '/about', status: 'Live' },
      { name: 'Contact', path: '/contact', status: 'Live' },
      { name: 'Blog', path: '/blog', status: 'Live' },
    ],
  },
  {
    category: 'Shop Pages',
    icon: ShoppingBag,
    links: [
      { name: 'All Products', path: '/shop', status: 'Live' },
      { name: 'Combos', path: '/combos', status: 'Live' },
      { name: 'Cart', path: '/cart', status: 'Live' },
      { name: 'Checkout', path: '/checkout', status: 'Live' },
      { name: 'Wishlist', path: '/wishlist', status: 'Live' },
      { name: 'Track Order', path: '/track-order', status: 'Live' },
    ],
  },
  {
    category: 'Guides (SEO)',
    icon: BookOpen,
    links: [
      { name: 'Guides Hub', path: '/seo-pages', status: 'Live' },
      ...SEO_PAGES.map((p) => ({
        name: p.title,
        path: `/seo-pages/${p.slug}`,
        status: 'Live' as const,
      })),
    ],
  },
  {
    category: 'User Pages',
    icon: Users,
    links: [
      { name: 'My Account (WooCommerce)', path: '/account', status: 'Live' },
      { name: 'Login', path: '/login', status: 'Live' },
      { name: 'Sign Up', path: '/signup', status: 'Live' },
    ],
  },
  {
    category: 'Legal & Support',
    icon: FileText,
    links: [
      { name: 'Privacy Policy', path: '/privacy-policy', status: 'Live' },
      { name: 'Terms & Conditions', path: '/terms', status: 'Live' },
      { name: 'Refund Policy', path: '/refund-policy', status: 'Live' },
      { name: 'Shipping Policy', path: '/shipping-policy', status: 'Live' },
      { name: 'FAQ', path: '/faq', status: 'Live' },
    ],
  },
  {
    category: 'Admin & Agents',
    icon: Layout,
    links: [
      { name: 'Admin Dashboard', path: '/admin', status: 'Protected' },
      { name: 'Content', path: '/admin/content', status: 'Protected' },
      { name: 'SEO', path: '/admin/seo', status: 'Protected' },
      { name: 'Growth Agent', path: '/admin/growth', status: 'Protected' },
      { name: 'Trend Agent', path: '/admin/trends', status: 'Protected' },
      { name: 'Inventory Agent', path: '/admin/inventory', status: 'Protected' },
      { name: 'Blog Agent', path: '/blog-agent', status: 'Protected' },
      { name: 'Site Map (This Page)', path: '/admin/pages', status: 'Protected' },
    ],
  },
  {
    category: 'Other Pages',
    icon: Globe,
    links: [
      { name: 'Community', path: '/community', status: 'Live' },
      { name: 'Gift Cards', path: '/gift-cards', status: 'Live' },
      { name: 'Partnerships', path: '/partnerships', status: 'Live' },
      { name: 'Learn Gardening', path: '/learn-gardening', status: 'Live' },
      { name: 'Plants', path: '/plants', status: 'Live' },
      { name: 'Order Success', path: '/order-success', status: 'Live' },
      { name: 'Legacy Products Redirect', path: '/products', status: 'Live' },
      { name: 'Legacy Categories Redirect', path: '/categories', status: 'Live' },
      { name: 'Legacy Team Redirect', path: '/team', status: 'Live' },
      { name: 'Legacy Terms Redirect', path: '/terms-and-conditions', status: 'Live' },
    ],
  },
];

export default function AdminPagesView() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link 
            href="/admin"
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold font-display">Website Pages Overview</h1>
            <p className="text-white/90">A complete map of all pages in your application.</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
            <h2 className="text-lg font-semibold mb-2">Sitemap</h2>
            <Link href="/sitemap.xml" target="_blank" className="text-sm text-[#4ADE80] hover:underline">
              /sitemap.xml
            </Link>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
            <h2 className="text-lg font-semibold mb-2">Robots</h2>
            <Link href="/robots.txt" target="_blank" className="text-sm text-[#4ADE80] hover:underline">
              /robots.txt
            </Link>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
            <h2 className="text-lg font-semibold mb-2">Automated Audit</h2>
            <div className="text-sm text-white/80 space-y-1">
              <div>Routes: {siteAudit.counts.totalRoutes}</div>
              <div>Broken links: {siteAudit.counts.brokenLinks}</div>
              <div>Orphan pages: {siteAudit.counts.orphanRoutes}</div>
              <div className="text-xs text-white/40 font-mono">Generated: {new Date(siteAudit.generatedAt).toLocaleString()}</div>
            </div>
          </div>
        </div>

        {(siteAudit.brokenLinks.length > 0 || siteAudit.orphanRoutes.length > 0) && (
          <div className="grid lg:grid-cols-2 gap-6 mb-10">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
              <h2 className="text-xl font-semibold mb-4">Broken Internal Links</h2>
              {siteAudit.brokenLinks.length === 0 ? (
                <p className="text-sm text-white/70">None</p>
              ) : (
                <div className="space-y-2 max-h-72 overflow-auto pr-2">
                  {siteAudit.brokenLinks.slice(0, 200).map((b) => (
                    <div key={`${b.source}:${b.line}:${b.href}`} className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-sm font-mono text-white/90">{b.href}</div>
                      <div className="text-xs text-white/50">{b.source}:{b.line}</div>
                    </div>
                  ))}
                  {siteAudit.brokenLinks.length > 200 && (
                    <p className="text-xs text-white/50">Showing first 200 entries. See SITE_AUDIT_REPORT.md for full list.</p>
                  )}
                </div>
              )}
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
              <h2 className="text-xl font-semibold mb-4">Orphan Page Routes</h2>
              {siteAudit.orphanRoutes.length === 0 ? (
                <p className="text-sm text-white/70">None</p>
              ) : (
                <div className="space-y-2 max-h-72 overflow-auto pr-2">
                  {siteAudit.orphanRoutes.slice(0, 200).map((o) => (
                    <div key={`${o.source}:${o.path}`} className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-sm font-mono text-white/90">{o.path}</div>
                      <div className="text-xs text-white/50">{o.source}</div>
                    </div>
                  ))}
                  {siteAudit.orphanRoutes.length > 200 && (
                    <p className="text-xs text-white/50">Showing first 200 entries. See SITE_AUDIT_REPORT.md for full list.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {siteMap.map((section) => (
            <div
              key={section.category}
              className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-[#2E7D32]/20 text-[#4ADE80]">
                  <section.icon className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-semibold">{section.category}</h2>
              </div>

              <div className="space-y-3">
                {section.links.map((link) => (
                  <Link
                    key={link.path}
                    href={link.path}
                    target="_blank"
                    className="group flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-transparent hover:border-[#2E7D32]/30 transition-all"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium group-hover:text-[#4ADE80] transition-colors">
                        {link.name}
                      </span>
                      <span className="text-xs text-white/40 font-mono">
                        {link.path}
                      </span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full border ${
                      link.status === 'Live' 
                        ? 'bg-[#2E7D32]/20 text-[#4ADE80] border-[#2E7D32]/30' 
                        : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                    }`}>
                      {link.status}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
