'use client';

import Link from 'next/link';

interface QuickLink {
  title: string;
  links: {
    name: string;
    href: string;
  }[];
}

const quickLinks: QuickLink[] = [
  {
    title: 'Shop',
    links: [
      { name: 'All Products', href: '/shop' },
      { name: 'Indoor Plants', href: '/shop?category=indoor' },
      { name: 'Outdoor Plants', href: '/shop?category=outdoor' },
      { name: 'Soil Mixes', href: '/soil-mixes-and-amendments' },
      { name: 'Combos', href: '/combos' },
    ],
  },
  {
    title: 'Support',
    links: [
      { name: 'FAQ', href: '/faq' },
      { name: 'Track Order', href: '/track-order' },
      { name: 'Shipping Policy', href: '/shipping-policy' },
      { name: 'Return Policy', href: '/refund-policy' },
      { name: 'Contact Us', href: '/contact' },
    ],
  },
  {
    title: 'Company',
    links: [
      { name: 'About Us', href: '/about' },
      { name: 'Our Story', href: '/about' },
      { name: 'Partner With Us', href: '/contact?type=partnership' },
      { name: 'Blog', href: '/blog' },
      { name: 'Learn Gardening', href: '/learn-gardening' },
      { name: 'Gardening Guides', href: '/seo-pages' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { name: 'Privacy Policy', href: '/privacy-policy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Refund Policy', href: '/refund-policy' },
    ],
  },
];

export default function QuickLinks() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
      {quickLinks.map((section) => (
        <div key={section.title}>
          <h3 className="text-white font-semibold text-lg mb-4 antialiased">
            {section.title}
          </h3>
          <ul className="space-y-2">
            {section.links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-gray-400 hover:text-[#2E7D32] transition-colors text-sm"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
