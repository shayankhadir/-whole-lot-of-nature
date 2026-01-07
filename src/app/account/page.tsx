'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  User,
  Package,
  MapPin,
  Heart,
  LogOut,
  ChevronRight,
  Star,
  Truck,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  ShoppingBag,
  Gift,
  Settings,
  CreditCard,
  Mail
} from 'lucide-react';

interface Customer {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
  billing: {
    first_name: string;
    last_name: string;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
    phone: string;
  };
  shipping: {
    first_name: string;
    last_name: string;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
}

interface Order {
  id: number;
  number: string;
  status: string;
  date_created: string;
  total: string;
  currency: string;
  line_items: Array<{
    id: number;
    name: string;
    quantity: number;
    total: string;
    image?: { src: string };
  }>;
}

const statusColors: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  pending: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', icon: <Clock className="w-4 h-4" /> },
  processing: { bg: 'bg-blue-500/20', text: 'text-blue-400', icon: <Truck className="w-4 h-4" /> },
  'on-hold': { bg: 'bg-orange-500/20', text: 'text-orange-400', icon: <Clock className="w-4 h-4" /> },
  completed: { bg: 'bg-green-500/20', text: 'text-green-400', icon: <CheckCircle className="w-4 h-4" /> },
  cancelled: { bg: 'bg-red-500/20', text: 'text-red-400', icon: <XCircle className="w-4 h-4" /> },
  refunded: { bg: 'bg-purple-500/20', text: 'text-purple-400', icon: <CreditCard className="w-4 h-4" /> },
  failed: { bg: 'bg-red-500/20', text: 'text-red-400', icon: <XCircle className="w-4 h-4" /> },
};

export default function AccountPage() {
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'addresses' | 'settings'>('dashboard');
  const [email, setEmail] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const fetchAccountData = useCallback(async (userEmail: string) => {
    try {
      setLoading(true);
      // Fetch customer and orders from our API
      const [customerRes, ordersRes] = await Promise.all([
        fetch(`/api/account?email=${encodeURIComponent(userEmail)}&type=customer`),
        fetch(`/api/account?email=${encodeURIComponent(userEmail)}&type=orders`)
      ]);

      if (customerRes.ok) {
        const customerData = await customerRes.json();
        if (customerData.success && customerData.data) {
          setCustomer(customerData.data);
        }
      }

      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        if (ordersData.success && ordersData.data) {
          setOrders(ordersData.data);
        }
      }
    } catch (error) {
      console.error('Failed to fetch account data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Check for saved email in localStorage
    const savedEmail = localStorage.getItem('account_email');
    if (savedEmail) {
      setEmail(savedEmail);
      setIsLoggedIn(true);
      fetchAccountData(savedEmail);
    } else {
      setLoading(false);
    }
  }, [fetchAccountData]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    localStorage.setItem('account_email', email);
    setIsLoggedIn(true);
    await fetchAccountData(email);
  };

  const handleLogout = () => {
    localStorage.removeItem('account_email');
    setIsLoggedIn(false);
    setCustomer(null);
    setOrders([]);
    setEmail('');
  };

  // Not logged in - show login form
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0d3512] via-[#0a2810] to-[#061208]">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/images/backgrounds/ai-generated-lush-tropical-green-leaves-background-photo.jpg"
            alt="Background"
            fill
            className="object-cover opacity-10"
          />
        </div>
        
        <div className="max-w-md mx-auto px-4 py-20">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <User className="w-10 h-10 text-emerald-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">My Account</h1>
            <p className="text-gray-400">Enter your email to view your orders and account details</p>
          </div>

          <form onSubmit={handleLogin} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-colors"
            >
              View My Account
            </button>
            
            <div className="mt-6 text-center">
              <p className="text-gray-400 text-sm">
                Don&apos;t have an account?{' '}
                <Link href="/signup" className="text-emerald-400 hover:text-emerald-300">
                  Create one
                </Link>
              </p>
            </div>
          </form>

          <div className="mt-8 text-center">
            <Link href="/shop" className="text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0d3512] via-[#0a2810] to-[#061208] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading your account...</p>
        </div>
      </div>
    );
  }

  const displayName = customer?.first_name || email.split('@')[0];
  const recentOrders = orders.slice(0, 3);
  const totalOrders = orders.length;
  const completedOrders = orders.filter(o => o.status === 'completed').length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0d3512] via-[#0a2810] to-[#061208]">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/backgrounds/ai-generated-lush-tropical-green-leaves-background-photo.jpg"
          alt="Background"
          fill
          className="object-cover opacity-10"
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Welcome, {displayName}!</h1>
              <p className="text-gray-400">{email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: <User className="w-5 h-5" /> },
            { id: 'orders', label: 'Orders', icon: <Package className="w-5 h-5" /> },
            { id: 'addresses', label: 'Addresses', icon: <MapPin className="w-5 h-5" /> },
            { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Stats Cards */}
            <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Package className="w-5 h-5 text-emerald-400" />
                  <span className="text-gray-400">Total Orders</span>
                </div>
                <p className="text-3xl font-bold text-white">{totalOrders}</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-gray-400">Completed</span>
                </div>
                <p className="text-3xl font-bold text-white">{completedOrders}</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <span className="text-gray-400">Loyalty Points</span>
                </div>
                <Link href="/loyalty" className="text-3xl font-bold text-white hover:text-emerald-400 transition-colors">
                  View →
                </Link>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="lg:col-span-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">Recent Orders</h2>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                >
                  View All <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              
              {recentOrders.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingBag className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 mb-4">No orders yet</p>
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentOrders.map((order) => {
                    const status = statusColors[order.status] || statusColors.pending;
                    return (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${status.bg}`}>
                            {status.icon}
                          </div>
                          <div>
                            <p className="text-white font-medium">Order #{order.number}</p>
                            <p className="text-gray-400 text-sm">
                              {new Date(order.date_created).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-semibold">₹{order.total}</p>
                          <span className={`text-sm capitalize ${status.text}`}>
                            {order.status.replace('-', ' ')}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick Links */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-6">Quick Links</h2>
              <div className="space-y-3">
                <Link
                  href="/wishlist"
                  className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors group"
                >
                  <Heart className="w-5 h-5 text-pink-400" />
                  <span className="text-gray-300 group-hover:text-white">Wishlist</span>
                  <ChevronRight className="w-4 h-4 text-gray-500 ml-auto" />
                </Link>
                <Link
                  href="/loyalty"
                  className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors group"
                >
                  <Gift className="w-5 h-5 text-purple-400" />
                  <span className="text-gray-300 group-hover:text-white">Loyalty Rewards</span>
                  <ChevronRight className="w-4 h-4 text-gray-500 ml-auto" />
                </Link>
                <Link
                  href="/track-order"
                  className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors group"
                >
                  <Truck className="w-5 h-5 text-blue-400" />
                  <span className="text-gray-300 group-hover:text-white">Track Order</span>
                  <ChevronRight className="w-4 h-4 text-gray-500 ml-auto" />
                </Link>
                <Link
                  href="/contact"
                  className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors group"
                >
                  <Mail className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300 group-hover:text-white">Contact Support</span>
                  <ChevronRight className="w-4 h-4 text-gray-500 ml-auto" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <h2 className="text-lg font-semibold text-white">Order History</h2>
            </div>
            
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">You haven&apos;t placed any orders yet</p>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors"
                >
                  Browse Products
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-white/10">
                {orders.map((order) => {
                  const status = statusColors[order.status] || statusColors.pending;
                  return (
                    <div key={order.id} className="p-6 hover:bg-white/5 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <span className="text-white font-semibold">Order #{order.number}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${status.bg} ${status.text}`}>
                              {order.status.replace('-', ' ')}
                            </span>
                          </div>
                          <p className="text-gray-400 text-sm">
                            Placed on {new Date(order.date_created).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-white">₹{order.total}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-3">
                        {order.line_items.slice(0, 4).map((item) => (
                          <div key={item.id} className="flex items-center gap-2 bg-white/5 rounded-lg p-2">
                            {item.image?.src && (
                              <Image
                                src={item.image.src}
                                alt={item.name}
                                width={40}
                                height={40}
                                className="rounded-lg object-cover"
                              />
                            )}
                            <div>
                              <p className="text-sm text-gray-300 line-clamp-1">{item.name}</p>
                              <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                            </div>
                          </div>
                        ))}
                        {order.line_items.length > 4 && (
                          <div className="flex items-center justify-center px-4 text-gray-400 text-sm">
                            +{order.line_items.length - 4} more items
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Addresses Tab */}
        {activeTab === 'addresses' && customer && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-400" />
                Billing Address
              </h3>
              {customer.billing.address_1 ? (
                <div className="text-gray-300 space-y-1">
                  <p className="font-medium text-white">
                    {customer.billing.first_name} {customer.billing.last_name}
                  </p>
                  <p>{customer.billing.address_1}</p>
                  {customer.billing.address_2 && <p>{customer.billing.address_2}</p>}
                  <p>
                    {customer.billing.city}, {customer.billing.state} {customer.billing.postcode}
                  </p>
                  <p>{customer.billing.country}</p>
                  {customer.billing.phone && (
                    <p className="mt-2 text-emerald-400">{customer.billing.phone}</p>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">No billing address saved</p>
              )}
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-400" />
                Shipping Address
              </h3>
              {customer.shipping.address_1 ? (
                <div className="text-gray-300 space-y-1">
                  <p className="font-medium text-white">
                    {customer.shipping.first_name} {customer.shipping.last_name}
                  </p>
                  <p>{customer.shipping.address_1}</p>
                  {customer.shipping.address_2 && <p>{customer.shipping.address_2}</p>}
                  <p>
                    {customer.shipping.city}, {customer.shipping.state} {customer.shipping.postcode}
                  </p>
                  <p>{customer.shipping.country}</p>
                </div>
              ) : (
                <p className="text-gray-500">No shipping address saved</p>
              )}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6">Account Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Email Address</label>
                  <p className="text-white">{email}</p>
                </div>
                
                {customer && (
                  <>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Full Name</label>
                      <p className="text-white">
                        {customer.first_name} {customer.last_name}
                      </p>
                    </div>
                  </>
                )}

                <div className="pt-4 border-t border-white/10">
                  <p className="text-gray-400 text-sm mb-4">
                    To update your account details, billing, or shipping addresses, please visit your{' '}
                    <a 
                      href={`${process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://admin.wholelotofnature.com'}/my-account`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 hover:text-emerald-300"
                    >
                      WooCommerce account page
                    </a>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
