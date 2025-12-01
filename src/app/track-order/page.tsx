'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Truck, CheckCircle, Clock, Search } from 'lucide-react';

interface OrderStatus {
  id: string;
  orderId: string;
  status: 'processing' | 'shipped' | 'in-transit' | 'delivered';
  placedDate: string;
  estimatedDelivery: string;
  items: number;
  total: number;
  trackingNumber?: string;
  timeline: {
    status: string;
    date: string;
    description: string;
    completed: boolean;
  }[];
}

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [orderStatus, setOrderStatus] = useState<OrderStatus | null>(null);
  const [error, setError] = useState('');

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setError('');
    setOrderStatus(null);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock data - in real app, this would come from API
    if (orderNumber.toLowerCase().startsWith('wln')) {
      setOrderStatus({
        id: '1',
        orderId: orderNumber,
        status: 'in-transit',
        placedDate: '2025-11-15',
        estimatedDelivery: '2025-11-22',
        items: 3,
        total: 1299,
        trackingNumber: 'TRK123456789',
        timeline: [
          {
            status: 'Order Placed',
            date: '2025-11-15, 10:30 AM',
            description: 'Your order has been confirmed',
            completed: true,
          },
          {
            status: 'Processing',
            date: '2025-11-15, 2:45 PM',
            description: 'Your plants are being carefully packed',
            completed: true,
          },
          {
            status: 'Shipped',
            date: '2025-11-16, 9:15 AM',
            description: 'Order dispatched from our nursery',
            completed: true,
          },
          {
            status: 'In Transit',
            date: '2025-11-19, 7:30 AM',
            description: 'Your package is on its way',
            completed: true,
          },
          {
            status: 'Out for Delivery',
            date: 'Pending',
            description: 'Will be delivered today',
            completed: false,
          },
          {
            status: 'Delivered',
            date: 'Pending',
            description: 'Order delivered successfully',
            completed: false,
          },
        ],
      });
    } else {
      setError('Order not found. Please check your order number and email.');
    }

    setIsSearching(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'processing':
        return <Clock className="w-5 h-5" />;
      case 'shipped':
      case 'in transit':
        return <Truck className="w-5 h-5" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5" />;
      default:
        return <Package className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: OrderStatus['status']) => {
    switch (status) {
      case 'processing':
        return 'text-yellow-600 bg-yellow-50';
      case 'shipped':
        return 'text-blue-600 bg-blue-50';
      case 'in-transit':
        return 'text-purple-600 bg-purple-50';
      case 'delivered':
        return 'text-[#2E7D32] bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 py-24 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 antialiased">
            Track Your Order
          </h1>
          <p className="text-white/80 text-lg antialiased">
            Enter your order details to track your plants
          </p>
        </div>

        {/* Search Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 mb-8"
        >
          <form onSubmit={handleTrackOrder} className="space-y-6">
            <div>
              <label htmlFor="orderNumber" className="block text-sm font-medium text-white mb-2">
                Order Number
              </label>
              <input
                type="text"
                id="orderNumber"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="e.g., WLN123456"
                required
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent backdrop-blur-md"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent backdrop-blur-md"
              />
            </div>

            <button
              type="submit"
              disabled={isSearching}
              className="w-full bg-[#2E7D32] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#1B5E20] transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSearching ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  <span>Track Order</span>
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
        </motion.div>

        {/* Order Status */}
        {orderStatus && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Order Info Card */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2 antialiased">
                    Order #{orderStatus.orderId}
                  </h2>
                  <p className="text-gray-400">
                    Placed on {new Date(orderStatus.placedDate).toLocaleDateString('en-IN', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>
                <div className={`px-4 py-2 rounded-full ${getStatusColor(orderStatus.status)}`}>
                  <span className="font-semibold capitalize">
                    {orderStatus.status.replace('-', ' ')}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Items</p>
                  <p className="text-white font-semibold">{orderStatus.items} items</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Total Amount</p>
                  <p className="text-white font-semibold">₹{orderStatus.total.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Estimated Delivery</p>
                  <p className="text-white font-semibold">
                    {new Date(orderStatus.estimatedDelivery).toLocaleDateString('en-IN', { 
                      day: 'numeric', 
                      month: 'short' 
                    })}
                  </p>
                </div>
              </div>

              {orderStatus.trackingNumber && (
                <div className="mt-6 pt-6 border-t border-white/10">
                  <p className="text-gray-400 text-sm mb-1">Tracking Number</p>
                  <p className="text-white font-mono">{orderStatus.trackingNumber}</p>
                </div>
              )}
            </div>

            {/* Timeline */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-white mb-6 antialiased">Order Timeline</h3>
              
              <div className="space-y-6">
                {orderStatus.timeline.map((event, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          event.completed
                            ? 'bg-[#2E7D32] text-white'
                            : 'bg-white/10 text-gray-400'
                        }`}
                      >
                        {getStatusIcon(event.status)}
                      </div>
                      {index < orderStatus.timeline.length - 1 && (
                        <div
                          className={`w-0.5 flex-1 mt-2 ${
                            event.completed ? 'bg-[#2E7D32]' : 'bg-white/10'
                          }`}
                          style={{ minHeight: '40px' }}
                        />
                      )}
                    </div>
                    
                    <div className="flex-1 pb-8">
                      <h4
                        className={`font-semibold mb-1 ${
                          event.completed ? 'text-white' : 'text-gray-400'
                        }`}
                      >
                        {event.status}
                      </h4>
                      <p className="text-gray-400 text-sm mb-1">{event.date}</p>
                      <p className="text-gray-400 text-sm">{event.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Help Section */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-center">
              <p className="text-gray-400 mb-4">
                Need help with your order?
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="/contact"
                  className="px-6 py-2 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-colors backdrop-blur-md"
                >
                  Contact Support
                </a>
                <a
                  href="/refund-policy"
                  className="px-6 py-2 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-colors backdrop-blur-md"
                >
                  Return Policy
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
