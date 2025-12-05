'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, Truck, MapPin, ArrowRight, Leaf } from 'lucide-react';
import { motion } from 'framer-motion';

import type { Metadata } from 'next';

const metadata: Metadata = {
  title: 'Order Success | Whole Lot of Nature',
  description: 'Discover premium plants and gardening supplies at Whole Lot of Nature. Expert advice and quality products for your green space in Bangalore.',
  openGraph: {
    title: 'Order Success | Whole Lot of Nature',
    description: 'Discover premium plants and gardening supplies at Whole Lot of Nature. Expert advice and quality products for your green space in Bangalore.',
    images: ['https://wholelotofnature.com/images/og-image.jpg'],
    url: 'https://wholelotofnature.com/order-success',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Order Success | Whole Lot of Nature',
    description: 'Discover premium plants and gardening supplies at Whole Lot of Nature. Expert advice and quality products for your green space in Bangalore.',
    images: ['https://wholelotofnature.com/images/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://wholelotofnature.com/order-success',
  },
};



interface OrderDetails {
  orderId: string;
  status: string;
  total: string;
  currency: string;
  paymentMethod?: string;
  dateCreated?: string;
}

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id') || searchParams.get('orderId');
  const orderKey = searchParams.get('key') || searchParams.get('orderKey');
  
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrderDetails() {
      if (!orderId) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/checkout?orderId=${orderId}`);
        if (response.ok) {
          const data = await response.json();
          setOrder(data);
        } else {
          setError('Could not fetch order details');
        }
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Could not fetch order details');
      } finally {
        setLoading(false);
      }
    }

    fetchOrderDetails();
  }, [orderId]);

  const steps = [
    { icon: CheckCircle, label: 'Order Placed', active: true },
    { icon: Package, label: 'Processing', active: order?.status === 'processing' || order?.status === 'completed' },
    { icon: Truck, label: 'Shipped', active: order?.status === 'completed' },
    { icon: MapPin, label: 'Delivered', active: false },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0d3512] via-[#0a2810] to-[#061208] text-white">
      {/* Success Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-emerald-500/10" />
        <div className="container mx-auto px-4 py-16 relative">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.6 }}
            className="flex justify-center mb-8"
          >
            <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-14 h-14 text-emerald-400" />
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Thank You for Your Order!
            </h1>
            <p className="text-lg text-gray-300 max-w-xl mx-auto">
              Your plants are being prepared with love and care. We&apos;ll notify you once they&apos;re on their way.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-16 -mt-4">
        {/* Order Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-8">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : orderId ? (
              <>
                <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-6">
                  <div>
                    <p className="text-gray-400 text-sm">Order Number</p>
                    <p className="text-2xl font-bold text-emerald-400">#{orderId}</p>
                  </div>
                  {order?.status && (
                    <div className="text-right">
                      <p className="text-gray-400 text-sm">Status</p>
                      <span className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm font-medium capitalize">
                        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                        {order.status}
                      </span>
                    </div>
                  )}
                </div>

                {/* Order Progress */}
                <div className="mb-8">
                  <h3 className="text-sm font-medium text-gray-400 mb-4">Order Progress</h3>
                  <div className="flex items-center justify-between">
                    {steps.map((step, index) => (
                      <div key={step.label} className="flex flex-col items-center relative">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          step.active ? 'bg-emerald-500 text-white' : 'bg-white/10 text-gray-500'
                        }`}>
                          <step.icon className="w-5 h-5" />
                        </div>
                        <p className={`mt-2 text-xs ${step.active ? 'text-emerald-400' : 'text-gray-500'}`}>
                          {step.label}
                        </p>
                        {index < steps.length - 1 && (
                          <div className={`absolute top-5 left-full w-full h-0.5 -ml-4 ${
                            step.active ? 'bg-emerald-500' : 'bg-white/10'
                          }`} style={{ width: '60px' }} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {order?.total && (
                  <div className="bg-emerald-500/10 rounded-xl p-4 mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Order Total</span>
                      <span className="text-2xl font-bold text-white">
                        {order.currency === 'INR' ? '₹' : order.currency}{order.total}
                      </span>
                    </div>
                    {order.paymentMethod && (
                      <p className="text-sm text-gray-400 mt-2">
                        Paid via {order.paymentMethod}
                      </p>
                    )}
                  </div>
                )}

                <p className="text-gray-400 text-sm text-center">
                  A confirmation email has been sent to your registered email address.
                </p>
              </>
            ) : (
              <div className="text-center py-8">
                <Leaf className="w-12 h-12 text-emerald-500/50 mx-auto mb-4" />
                <p className="text-gray-400">No order details available</p>
              </div>
            )}
          </div>

          {/* What's Next */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">What Happens Next?</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-emerald-400 text-sm font-bold">1</span>
                </div>
                <div>
                  <p className="text-white font-medium">Order Confirmation</p>
                  <p className="text-gray-400 text-sm">You&apos;ll receive an email with your order details shortly.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-emerald-400 text-sm font-bold">2</span>
                </div>
                <div>
                  <p className="text-white font-medium">Careful Packaging</p>
                  <p className="text-gray-400 text-sm">Your plants are lovingly packed with eco-friendly materials.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-emerald-400 text-sm font-bold">3</span>
                </div>
                <div>
                  <p className="text-white font-medium">Shipping Update</p>
                  <p className="text-gray-400 text-sm">Once shipped, you&apos;ll get a tracking number via email and SMS.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-emerald-400 text-sm font-bold">4</span>
                </div>
                <div>
                  <p className="text-white font-medium">Happy Plants Delivered!</p>
                  <p className="text-gray-400 text-sm">Usually within 4-7 business days across India.</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/track-order"
              className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-medium transition-colors"
            >
              Track Your Order
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/shop"
              className="flex-1 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-medium transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </motion.div>

        {/* Plant Care Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="max-w-2xl mx-auto mt-12"
        >
          <div className="bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 border border-emerald-500/20 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-emerald-400 mb-2 flex items-center gap-2">
              <Leaf className="w-5 h-5" />
              Pro Tip: Prepare for Your Plants
            </h3>
            <p className="text-gray-300 text-sm">
              While your plants are on their way, find a spot with indirect sunlight and have some water ready. 
              When they arrive, let them rest for a day before watering. Need help? Chat with <Link href="/plantsy" className="text-emerald-400 hover:underline">Plantsy</Link>, our AI plant care assistant!
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
