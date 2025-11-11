'use client';

import { ReactNode } from 'react';
import Header from './HeaderNew';
import Footer from './Footer';
import CartSidebar from '../cart/CartSidebar';
import TopBanner from '../ui/TopBanner';
import TropicalBackground from '../ui/TropicalBackground';
import MobileBottomNav from './MobileBottomNav';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col relative">
      <TropicalBackground />
      <div className="relative z-10">
        <TopBanner />
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <CartSidebar />
        <MobileBottomNav />
      </div>
    </div>
  );
}