'use client';

import { useState, useEffect } from 'react';
import ProductCard from '@/components/shop/ProductCard';
import { Product } from '@/types/product';

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products?limit=50');
      const result = await response.json();
      
      // API returns { success: true, data: [...] }
      if (result.success && result.data) {
        setProducts(result.data);
      } else {
        console.error('Failed to fetch products:', result.error);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'plants', name: 'Plants', subcategories: ['Indoor Plants', 'Outdoor Plants'] },
    { id: 'aquatic-life-ecosystem', name: 'Aquatic Life & Ecosystem', subcategories: ['Aquatic Snails', 'Aquatic Plants'] },
    { id: 'soil-growing-media', name: 'Soil & Growing Media', subcategories: ['Soil Mixes', 'Organic Fertilizers'] },
    { id: 'herbal-products', name: 'Herbal Products' },
    { id: 'miniature-plant-decor', name: 'Miniature Plant Decor' },
  ];

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => 
        p.categories.some(cat => cat.slug === selectedCategory)
      );

  return (
    <div className="min-h-screen bg-[#0F1E11] py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-[clamp(2.5rem,7vw,2.5rem)] font-bold text-[#2E7D32] mb-4 font-header antialiased">
            Our Collection
          </h1>
          <p className="text-[clamp(1rem,2.5vw,1.25rem)] text-[#66BB6A] font-body antialiased">
            Premium plants and sustainable essentials
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#2E7D32] text-white shadow-lg shadow-[#2E7D32]/50'
                  : 'bg-[#2C2C2C] text-white/70 hover:bg-[#2E7D32]/20 border border-[#2E7D32]/30'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#2E7D32] border-t-transparent"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-2xl text-white/70 antialiased">No products found</p>
          </div>
        )}
      </div>
    </div>
  );
}
