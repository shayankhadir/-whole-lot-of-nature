'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import DesktopHeader from './DesktopHeader';
import MobileFloatingNav from './MobileFloatingNav';
import { useMediaQuery } from '@/hooks/useMediaQuery';

/**
 * Responsive Header Component
 * - Mobile (<1024px): Shows only floating navigation at bottom
 * - Desktop (≥1024px): Shows only fixed header at top (transparent → colored on scroll)
 */
export default function ResponsiveHeader() {
  const pathname = usePathname();
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  return (
    <>
      {/* Desktop Header - Only shown on desktop */}
      {isDesktop && <DesktopHeader />}
      
      {/* Mobile Floating Navigation - Only shown on mobile/tablet */}
      {!isDesktop && <MobileFloatingNav />}
    </>
  );
}
