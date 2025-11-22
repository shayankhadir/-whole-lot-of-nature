import { Product } from '@/types/product';

export type DemoTag = {
  id: number;
  name: string;
  slug: string;
  count: number;
};

export type DemoCategory = {
  id: number;
  name: string;
  slug: string;
  parent: number;
  count: number;
  description: string;
  image?: string | null;
};

export const DEMO_PRODUCTS: Product[] = [
  {
    id: 1001,
    name: 'Monstera Deliciosa XL',
    slug: 'monstera-deliciosa-xl',
    price: '2499',
    regular_price: '2999',
    sale_price: '2499',
    description: '<p>Lush, split-leaf Monstera grown in organic coco-peat mix for low-light apartments.</p>',
    short_description: '<p>Lush statement plant for bright corners.</p>',
    categories: [{ id: 201, name: 'Indoor Plants', slug: 'indoor-plants', count: 48 }],
    images: [
      {
        id: 5001,
        src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=900&q=80',
        alt: 'Mature monstera in living room'
      },
      {
        id: 5002,
        src: 'https://images.unsplash.com/photo-1469531398783-68a4ad8f29ab?auto=format&fit=crop&w=900&q=80',
        alt: 'Close up of monstera leaf'
      }
    ],
    attributes: [],
    variations: [],
    in_stock: true,
    stock_quantity: 7,
    average_rating: 4.8,
    rating_count: 32,
    tags: [
      { id: 301, name: 'Low-light heroes', slug: 'low-light' },
      { id: 303, name: 'Pet safe', slug: 'pet-safe' },
      { id: 309, name: 'Air Purifying', slug: 'air-purifying' },
      { id: 310, name: 'Beginner Friendly', slug: 'beginner-friendly' }
    ],
    featured: true
  },
  {
    id: 1002,
    name: 'Calathea Orbifolia',
    slug: 'calathea-orbifolia',
    price: '1899',
    regular_price: '2199',
    sale_price: '1899',
    description: '<p>Air-purifying calathea with hand-misted foliage and balanced soil moisture.</p>',
    short_description: '<p>Velvety stripes that thrive in indirect light.</p>',
    categories: [{ id: 201, name: 'Indoor Plants', slug: 'indoor-plants', count: 48 }],
    images: [
      {
        id: 5003,
        src: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=900&q=80',
        alt: 'Calathea orbifolia on shelf'
      }
    ],
    attributes: [],
    variations: [],
    in_stock: true,
    stock_quantity: 9,
    average_rating: 4.7,
    rating_count: 18,
    tags: [
      { id: 304, name: 'Statement foliage', slug: 'statement' },
      { id: 309, name: 'Air Purifying', slug: 'air-purifying' },
      { id: 311, name: 'Humidity Lover', slug: 'humidity-lover' }
    ],
    featured: true
  },
  {
    id: 1003,
    name: 'Terrarium Apothecary Kit',
    slug: 'terrarium-apothecary-kit',
    price: '1499',
    regular_price: '1499',
    sale_price: '1499',
    description: '<p>Hand-curated kit with moss, charcoal, and mini-tools for effortless terrarium builds.</p>',
    short_description: '<p>Complete terrarium setup in 10 minutes.</p>',
    categories: [{ id: 204, name: 'DIY Kits', slug: 'diy-kits', count: 20 }],
    images: [
      {
        id: 5004,
        src: 'https://images.unsplash.com/photo-1446841575919-3fdf0b6e3d37?auto=format&fit=crop&w=900&q=80',
        alt: 'Terrarium kit on wooden table'
      }
    ],
    attributes: [],
    variations: [],
    in_stock: true,
    stock_quantity: 12,
    average_rating: 4.6,
    rating_count: 21,
    tags: [
      { id: 302, name: 'Gift ready', slug: 'gifts' },
      { id: 305, name: 'DIY friendly', slug: 'diy' },
      { id: 312, name: 'Creative', slug: 'creative' }
    ],
    featured: true
  },
  {
    id: 1004,
    name: 'Organic Seed Starter Bundle',
    slug: 'organic-seed-starter',
    price: '999',
    regular_price: '1299',
    sale_price: '999',
    description: '<p>Six heirloom seed varieties paired with coir pellets and nutrition boosters.</p>',
    short_description: '<p>Sow kitchen greens indoors year-round.</p>',
    categories: [{ id: 205, name: 'Seeds & Bulbs', slug: 'seeds', count: 28 }],
    images: [
      {
        id: 5005,
        src: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=900&q=80',
        alt: 'Seed starter kit'
      }
    ],
    attributes: [],
    variations: [],
    in_stock: true,
    stock_quantity: 15,
    average_rating: 4.5,
    rating_count: 14,
    tags: [
      { id: 306, name: 'Kitchen garden', slug: 'kitchen-garden' },
      { id: 313, name: 'Sustainable', slug: 'sustainable' },
      { id: 310, name: 'Beginner Friendly', slug: 'beginner-friendly' }
    ],
    featured: false
  },
  {
    id: 1005,
    name: 'Herbal Wellness E-Book',
    slug: 'herbal-wellness-guide',
    price: '599',
    regular_price: '799',
    sale_price: '599',
    description: '<p>50-page illustrated guide covering balcony apothecary recipes and routines.</p>',
    short_description: '<p>Digital care companion for everyday rituals.</p>',
    categories: [{ id: 206, name: 'E-Books', slug: 'ebooks', count: 12 }],
    images: [
      {
        id: 5006,
        src: 'https://images.unsplash.com/photo-1474367658825-e5858839e99d?auto=format&fit=crop&w=900&q=80',
        alt: 'Digital herbal guide on tablet'
      }
    ],
    attributes: [],
    variations: [],
    in_stock: true,
    stock_quantity: 999,
    average_rating: 4.9,
    rating_count: 44,
    tags: [
      { id: 307, name: 'Wellness', slug: 'wellness' },
      { id: 314, name: 'Digital', slug: 'digital' },
      { id: 315, name: 'Instant Access', slug: 'instant-access' }
    ],
    featured: false
  },
  {
    id: 1006,
    name: 'Aquatic Moss Ball Duo',
    slug: 'aquatic-moss-duo',
    price: '799',
    regular_price: '899',
    sale_price: '799',
    description: '<p>Low-maintenance moss balls shipped in remineralised RO water for aquariums.</p>',
    short_description: '<p>Stress-free aquatic greens.</p>',
    categories: [{ id: 207, name: 'Aquatic Life', slug: 'aquatic', count: 16 }],
    images: [
      {
        id: 5007,
        src: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=900&q=80',
        alt: 'Aquatic moss balls in jar'
      }
    ],
    attributes: [],
    variations: [],
    in_stock: true,
    stock_quantity: 20,
    average_rating: 4.4,
    rating_count: 11,
    tags: [
      { id: 308, name: 'Aquascaping', slug: 'aquascape' },
      { id: 316, name: 'Low Maintenance', slug: 'low-maintenance' },
      { id: 317, name: 'Water Purifying', slug: 'water-purifying' }
    ],
    featured: false
  }
];

export const DEMO_TAGS: DemoTag[] = [
  { id: 301, name: 'Low-light heroes', slug: 'low-light', count: 2 },
  { id: 302, name: 'Gift ready', slug: 'gifts', count: 1 },
  { id: 306, name: 'Kitchen garden', slug: 'kitchen-garden', count: 1 },
  { id: 307, name: 'Wellness', slug: 'wellness', count: 1 }
];

export const DEMO_TAG_PRODUCTS: Record<string, Product[]> = {
  'low-light': DEMO_PRODUCTS.filter((product) => product.tags?.some((tag) => tag.slug === 'low-light')),
  gifts: DEMO_PRODUCTS.filter((product) => product.tags?.some((tag) => tag.slug === 'gifts')),
  'kitchen-garden': DEMO_PRODUCTS.filter((product) => product.tags?.some((tag) => tag.slug === 'kitchen-garden')),
  wellness: DEMO_PRODUCTS.filter((product) => product.tags?.some((tag) => tag.slug === 'wellness'))
};

export const DEMO_CATEGORIES: DemoCategory[] = [
  {
    id: 201,
    name: 'Indoor Plants',
    slug: 'indoor-plants',
    parent: 0,
    count: 48,
    description: 'Statement greens, prayer plants, and trailing vines hand-raised for apartments.',
    image: null
  },
  {
    id: 204,
    name: 'DIY Kits',
    slug: 'diy-kits',
    parent: 0,
    count: 20,
    description: 'Everything you need to craft terrariums, kokedamas, and botanical gifts.',
    image: null
  },
  {
    id: 205,
    name: 'Seeds & Bulbs',
    slug: 'seeds',
    parent: 0,
    count: 28,
    description: 'Kitchen-friendly seed mixes and heirloom bulbs that sprout fast.',
    image: null
  },
  {
    id: 207,
    name: 'Aquatic Life',
    slug: 'aquatic',
    parent: 0,
    count: 16,
    description: 'Low-maintenance aquascaping essentials and curated fauna-safe greens.',
    image: null
  },
  {
    id: 206,
    name: 'E-Books',
    slug: 'ebooks',
    parent: 0,
    count: 12,
    description: 'Instant downloads for mindful plant rituals, care routines, and styling.',
    image: null
  },
  {
    id: 208,
    name: 'Wellness & Tea',
    slug: 'wellness',
    parent: 0,
    count: 9,
    description: 'Small-batch herbal blends and apothecary staples to amplify calm.',
    image: null
  }
];

export const DEMO_CHILD_CATEGORIES: Record<number, DemoCategory[]> = {
  201: [
    { id: 3011, name: 'Low-light Friendly', slug: 'low-light-plants', parent: 201, count: 14, description: 'Plants that thrive without harsh sun.', image: null },
    { id: 3012, name: 'Pet Safe Greens', slug: 'pet-safe-plants', parent: 201, count: 9, description: 'Non-toxic picks for furry roommates.', image: null }
  ],
  205: [
    { id: 3051, name: 'Microgreens', slug: 'microgreens', parent: 205, count: 8, description: 'Fresh harvest in 10 days.', image: null },
    { id: 3052, name: 'Balcony Staples', slug: 'balcony-seeds', parent: 205, count: 6, description: 'Zero fuss climbers & herbs.', image: null }
  ],
  206: [
    { id: 3061, name: 'Care Playbooks', slug: 'care-guides', parent: 206, count: 5, description: 'Digital step-by-step rituals.', image: null }
  ],
  207: [
    { id: 3071, name: 'Nano Aquascapes', slug: 'nano-aquascapes', parent: 207, count: 4, description: 'Tiny tanks, big impact.', image: null }
  ]
};
