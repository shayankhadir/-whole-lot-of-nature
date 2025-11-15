'use client';

import DesktopHeader from './DesktopHeader';
import MobileFloatingNav from './MobileFloatingNav';
import MobileHeader from './MobileHeader';
import { useMediaQuery } from '@/hooks/useMediaQuery';

/**
 * Responsive Header Component
 * - Mobile (<1024px): Shows only floating navigation at bottom
 * - Desktop (≥1024px): Shows only fixed header at top (transparent → colored on scroll)
 */
export default function ResponsiveHeader() {
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  if (isDesktop) {
    return <DesktopHeader />;
  }

  return (
    <>
      <MobileHeader />
      <MobileFloatingNav />
    </>
  );
}
