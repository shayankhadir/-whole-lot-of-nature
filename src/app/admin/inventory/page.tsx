'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

import type { Metadata } from 'next';

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



interface InventoryItem {
  id: number;
  name: string;
  sku?: string;
  stock_quantity: number;
  in_stock: boolean;
  price: string;
  categories: Array<{ id: number; name: string }>;
  image_url?: string;
}

interface InventoryStats {
  total_products: number;
  in_stock: number;
  out_of_stock: number;
  low_stock: number;
  last_synced: string;
}

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [stats, setStats] = useState<InventoryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSync] = useState(false);
  const [filter, setFilter] = useState<'all' | 'in-stock' | 'out-of-stock' | 'low-stock'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/inventory');
      const data = await response.json();

      if (data.success) {
        setInventory(data.products || []);
        setStats(data.stats || null);
      } else {
        console.error('Failed to fetch inventory:', data.error);
      }
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const syncInventory = async () => {
    try {
      setSync(true);
      const response = await fetch('/api/inventory/sync', { method: 'POST' });
      const data = await response.json();

      if (data.success) {
        fetchInventory();
        alert('✅ Inventory synced successfully!');
      } else {
        alert('❌ Sync failed: ' + data.error);
      }
    } catch (error) {
      console.error('Error syncing inventory:', error);
      alert('❌ Sync failed');
    } finally {
      setSync(false);
    }
  };

  const getFilteredInventory = () => {
    let filtered = inventory;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by stock status
    if (filter === 'in-stock') {
      filtered = filtered.filter(item => item.in_stock && item.stock_quantity > 5);
    } else if (filter === 'out-of-stock') {
      filtered = filtered.filter(item => !item.in_stock || item.stock_quantity === 0);
    } else if (filter === 'low-stock') {
      filtered = filtered.filter(item => item.in_stock && item.stock_quantity > 0 && item.stock_quantity <= 5);
    }

    return filtered;
  };

  const filteredInventory = getFilteredInventory();

  return (
    <div className="min-h-screen bg-[#0F1E11] py-8 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-4xl font-bold text-[#2E7D32] antialiased">📦 Inventory Management</h1>
            <Link
              href="/admin/trends"
              className="px-4 py-2 bg-[#2E7D32] text-white rounded-lg hover:bg-[#1B5E20] transition"
            >
              ← Back to Admin
            </Link>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-[#2C2C2C] border border-[#2E7D32]/30 rounded-lg p-6">
                <p className="text-white/85 text-sm mb-2">Total Products</p>
                <p className="text-3xl font-bold text-[#66BB6A] antialiased">{stats.total_products}</p>
              </div>
              <div className="bg-[#2C2C2C] border border-[#2E7D32]/30 rounded-lg p-6">
                <p className="text-white/85 text-sm mb-2">In Stock</p>
                <p className="text-3xl font-bold text-[#2E7D32] antialiased">{stats.in_stock}</p>
              </div>
              <div className="bg-[#2C2C2C] border border-red-500/30 rounded-lg p-6">
                <p className="text-white/85 text-sm mb-2">Out of Stock</p>
                <p className="text-3xl font-bold text-red-400 antialiased">{stats.out_of_stock}</p>
              </div>
              <div className="bg-[#2C2C2C] border border-yellow-500/30 rounded-lg p-6">
                <p className="text-white/85 text-sm mb-2">Low Stock (&lt;5)</p>
                <p className="text-3xl font-bold text-yellow-400 antialiased">{stats.low_stock}</p>
              </div>
            </div>
          )}

          {/* Sync & Last Updated */}
          <div className="bg-[#2C2C2C] border border-[#2E7D32]/30 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/85 text-sm">Last Synced</p>
                <p className="text-white font-medium">
                  {stats?.last_synced ? new Date(stats.last_synced).toLocaleString() : 'Never'}
                </p>
              </div>
              <button
                onClick={syncInventory}
                disabled={syncing}
                className="px-6 py-3 bg-[#2E7D32] text-white rounded-lg hover:bg-[#1B5E20] disabled:opacity-50 transition flex items-center gap-2"
              >
                {syncing ? '🔄 Syncing...' : '🔄 Sync from WordPress'}
              </button>
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-[#2C2C2C] border border-[#2E7D32]/30 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div>
              <label className="block text-white/85 text-sm mb-2">Search Products</label>
              <input
                type="text"
                placeholder="Product name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#2E7D32]/30 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-[#2E7D32]"
              />
            </div>

            {/* Filter */}
            <div>
              <label className="block text-white/85 text-sm mb-2" id="filter-label">Filter by Status</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as 'all' | 'in-stock' | 'out-of-stock' | 'low-stock')}
                className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#2E7D32]/30 rounded-lg text-white focus:outline-none focus:border-[#2E7D32]"
                aria-labelledby="filter-label"
              >
                <option value="all">All Products</option>
                <option value="in-stock">In Stock (&gt;5)</option>
                <option value="low-stock">Low Stock (1-5)</option>
                <option value="out-of-stock">Out of Stock</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#2E7D32] border-t-transparent"></div>
          </div>
        ) : (
          /* Inventory Table */
          <div className="bg-[#2C2C2C] border border-[#2E7D32]/30 rounded-lg overflow-hidden">
            {filteredInventory.length === 0 ? (
              <div className="p-8 text-center text-white/50">
                No products found matching your filters.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#2E7D32]/30 bg-[#1a1a1a]">
                      <th className="px-6 py-4 text-left text-white/85 text-sm font-semibold">Product</th>
                      <th className="px-6 py-4 text-left text-white/85 text-sm font-semibold">SKU</th>
                      <th className="px-6 py-4 text-center text-white/85 text-sm font-semibold">Stock</th>
                      <th className="px-6 py-4 text-left text-white/85 text-sm font-semibold">Status</th>
                      <th className="px-6 py-4 text-left text-white/85 text-sm font-semibold">Price</th>
                      <th className="px-6 py-4 text-left text-white/85 text-sm font-semibold">Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInventory.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b border-[#2E7D32]/10 hover:bg-[#1a1a1a] transition"
                      >
                        <td className="px-6 py-4 text-white font-medium">{item.name}</td>
                        <td className="px-6 py-4 text-white/85 text-sm font-mono">{item.sku || 'N/A'}</td>
                        <td className="px-6 py-4 text-center">
                          <span className="font-semibold text-white">{item.stock_quantity}</span>
                        </td>
                        <td className="px-6 py-4">
                          {item.stock_quantity === 0 ? (
                            <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-semibold">
                              Out of Stock
                            </span>
                          ) : item.stock_quantity <= 5 ? (
                            <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-semibold">
                              Low Stock
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-[#2E7D32]/20 text-[#2E7D32] rounded-full text-xs font-semibold backdrop-blur-md">
                              In Stock
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-white/85">₹{item.price}</td>
                        <td className="px-6 py-4 text-white/85 text-sm">
                          {item.categories.map((cat) => cat.name).join(', ') || 'Uncategorized'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Summary */}
        <div className="mt-8 p-6 bg-[#2C2C2C] border border-[#2E7D32]/30 rounded-lg">
          <p className="text-white/85 text-sm">
            Showing {filteredInventory.length} of {inventory.length} products
          </p>
        </div>
      </div>
    </div>
  );
}
