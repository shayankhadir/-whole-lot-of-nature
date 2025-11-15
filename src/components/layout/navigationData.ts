import { Leaf, Droplet, Sparkles, Sprout, Gem } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface ShopCollectionItem {
  name: string;
  href: string;
}

export interface ShopCollection {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  items: ShopCollectionItem[];
}

export const shopCollections: ShopCollection[] = [
  {
    title: 'Soil & Growing Media',
    description: 'Rich blends, substrates, and organic nourishment for thriving roots.',
    href: '/shop?category=soil-and-growing-media',
    icon: Sprout,
    items: [
      { name: 'Soil Mixes', href: '/shop?category=soil-mixes' },
      { name: 'Soil-Less Substrates', href: '/shop?category=soil-less-mixes-and-substrates' },
      { name: 'Amendments & Additives', href: '/shop?category=amendments-and-additives' },
      { name: 'Fertilizers & Organic Manures', href: '/shop?category=fertilizers-and-organic-manures' },
    ],
  },
  {
    title: 'Land Plants',
    description: 'Curated indoor, outdoor, and sculptural greens for every light profile.',
    href: '/shop?category=land-plants',
    icon: Leaf,
    items: [
      { name: 'Indoor Plants', href: '/shop?category=indoor-plants' },
      { name: 'Outdoor / Garden Plants', href: '/shop?category=outdoor-garden-plants' },
      { name: 'Succulents & Cacti', href: '/shop?category=succulents-and-cacti' },
      { name: 'Low Maintenance', href: '/shop?category=low-maintenance-plants' },
    ],
  },
  {
    title: 'Aquatic Life & Ecosystem',
    description: 'Living aquascapes, oxygenating plants, and pond companions.',
    href: '/shop?category=aquatic-life-ecosystem',
    icon: Droplet,
    items: [
      { name: 'Aquatic Plants', href: '/shop?category=aquatic-plants' },
      { name: 'Snails & Pond Life', href: '/shop?category=aquatic-snails-and-pond-life' },
      { name: 'Terrace & Balcony Water Gardens', href: '/shop?tag=terrace-garden' },
    ],
  },
  {
    title: 'Wellness & Herbal',
    description: 'Ayurvedic supplements and botanical rituals for daily restoration.',
    href: '/shop?category=wellness-herbal-products',
    icon: Sparkles,
    items: [
      { name: 'Herbal Supplements', href: '/shop?category=herbal-supplements' },
      { name: 'Hair & Body Care', href: '/shop?category=hair-and-body-products' },
      { name: 'Herbal Powders & Extracts', href: '/shop?category=herbal-powders-and-extracts' },
    ],
  },
  {
    title: 'Plant decor & eBooks',
    description: 'Miniature sets, plant decor and digital guides for every green space.',
    href: '/shop?category=plant-decor-and-ebooks',
    icon: Gem,
    items: [
      { name: 'Miniature Cactus Sets', href: '/shop?category=miniature-cactus-sets' },
      { name: 'Miniature Succulent Sets', href: '/shop?category=miniature-succulent-sets' },
      { name: 'E-books', href: '/shop?category=e-books-and-guides' },
      { name: 'Guides & Kits', href: '/shop?category=decor-and-digital' },
    ],
  },
];

export interface NavigationItem {
  name: string;
  href: string;
  dropdown?: ShopCollection[];
}

export const navigation: NavigationItem[] = [
  { name: 'Shop', href: '/shop', dropdown: shopCollections },
  { name: 'Blog', href: '/blog' },
  { name: 'About', href: '/about' },
];
