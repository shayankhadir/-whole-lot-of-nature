'use client';

import { ReactNode, useEffect } from 'react';
import ResponsiveHeader from './ResponsiveHeader';
import Footer from './Footer';
import CartSidebar from '../cart/CartSidebar';
import TopBanner from '../ui/TopBanner';
import PromoBanner from './PromoBanner';
import TropicalBackground from '../ui/TropicalBackground';
import PlantsyChatWidget from '../agents/PlantsyChatWidget';
import GlobalSearchOverlay from '../search/GlobalSearchOverlay';
import { useCartStore } from '@/stores/cartStore';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  useEffect(() => {
    useCartStore.getState().fetchCart();
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative">
      <TropicalBackground />
      <div className="relative z-10">
        <div className="relative">
          <TopBanner />
          <ResponsiveHeader />
        </div>
        <main className="flex-grow pb-28 lg:pb-0">
          {children}
        </main>
        <Footer />
        <CartSidebar />
        <PlantsyChatWidget />
        <GlobalSearchOverlay />
      </div>
    </div>
  );
}