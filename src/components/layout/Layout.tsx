'use client';

import { ReactNode } from 'react';
import ResponsiveHeader from './ResponsiveHeader';
import Footer from './Footer';
import CartSidebar from '../cart/CartSidebar';
import TopBanner from '../ui/TopBanner';
import PromoBanner from './PromoBanner';
import TropicalBackground from '../ui/TropicalBackground';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col relative">
      <TropicalBackground />
      <div className="relative z-10">
        <div className="relative">
          <PromoBanner />
          <TopBanner />
          <ResponsiveHeader />
        </div>
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <CartSidebar />
      </div>
    </div>
  );
}