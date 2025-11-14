'use client';

import BotanicalCategoryBento from '@/components/BotanicalCategoryBento';

const categories = [
  {
    name: 'Indoor Plants',
    icon: '🌱',
    description: 'Thriving green companions for your home',
    backgroundColor: 'rgba(13, 27, 15, 0.7)',
    href: '/shop?category=indoor-plants'
  },
  {
    name: 'Rare Plants',
    icon: '✨',
    description: 'Exotic species for collectors',
    backgroundColor: 'rgba(13, 27, 15, 0.7)',
    href: '/shop?category=rare-plants'
  },
  {
    name: 'Plant Care',
    icon: '🪴',
    description: 'Tools and supplies for growth',
    backgroundColor: 'rgba(13, 27, 15, 0.7)',
    href: '/shop?category=plant-care'
  },
  {
    name: 'Soil & Amendments',
    icon: '🌍',
    description: 'Premium growing mediums',
    backgroundColor: 'rgba(13, 27, 15, 0.7)',
    href: '/shop?category=soil'
  },
  {
    name: 'Gardening Tools',
    icon: '🔧',
    description: 'Essential gardening equipment',
    backgroundColor: 'rgba(13, 27, 15, 0.7)',
    href: '/shop?category=tools'
  },
  {
    name: 'Combos & Kits',
    icon: '📦',
    description: 'Complete growing solutions',
    backgroundColor: 'rgba(13, 27, 15, 0.7)',
    href: '/shop?category=combos'
  }
];

export default function CategoriesSection() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">
          Explore Our Collection
        </h2>
        <p className="text-white/70 text-sm sm:text-base">
          Discover the perfect plants and supplies for your botanical journey
        </p>
      </div>

      <BotanicalCategoryBento
        categories={categories}
        textAutoHide={true}
        enableStars={true}
        enableSpotlight={true}
        enableBorderGlow={true}
        enableTilt={true}
        enableMagnetism={true}
        clickEffect={true}
        spotlightRadius={250}
        particleCount={8}
        glowColor="102, 187, 106"
        columns={3}
      />
    </div>
  );
}
