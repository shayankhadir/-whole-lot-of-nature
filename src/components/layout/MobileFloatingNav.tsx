'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, ShoppingCart, User, ShoppingBag, MessageCircle } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';

interface NavItem {
  title: string;
  icon: React.ReactNode;
  href: string;
  action?: () => void;
  isAction?: boolean;
}

/**
 * Mobile Floating Navigation Component
 * - Only shown on mobile/tablet (<1024px)
 * - Icons are minimum 24px with 44x44px clickable area
 * - Uses Lucide React icons with fill="#2E7D32" or fill="white"
 * - Floating at bottom of screen
 */
export default function MobileFloatingNav() {
  const pathname = usePathname();
  const cartCount = useCartStore((s) => s.items.reduce((sum, item) => sum + item.quantity, 0));
  const [plantsyOpen, setPlantsyOpen] = useState(false);

  useEffect(() => {
    const handlePlantsyState = (event: Event) => {
      const custom = event as CustomEvent<{ isOpen?: boolean }>;
      if (typeof custom.detail?.isOpen === 'boolean') {
        setPlantsyOpen(custom.detail.isOpen);
      }
    };

    window.addEventListener('plantsy:state', handlePlantsyState);
    return () => window.removeEventListener('plantsy:state', handlePlantsyState);
  }, []);

  const navItems: NavItem[] = [
    {
      title: 'Home',
      icon: <Home className="w-6 h-6" strokeWidth={2} />,
      href: '/',
    },
    {
      title: 'Shop',
      icon: <ShoppingBag className="w-6 h-6" strokeWidth={2} />,
      href: '/shop',
    },
    {
      title: 'Chat',
      icon: <MessageCircle className="w-6 h-6" strokeWidth={2} />,
      href: '/plantsy',
      action: () => {
        window.dispatchEvent(new CustomEvent('plantsy:toggle'));
        setPlantsyOpen((prev) => !prev);
      },
      isAction: true,
    },
    {
      title: 'Cart',
      icon: <ShoppingCart className="w-6 h-6" strokeWidth={2} />,
      href: '/cart',
    },
    {
      title: 'Account',
      icon: <User className="w-6 h-6" strokeWidth={2} />,
      href: '/account',
    },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const getBadgeCount = (href: string) => {
    if (href === '/cart') return cartCount;
    return 0;
  };

  return (
    <motion.nav
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="fixed bottom-0 left-0 right-0 z-50 pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      {/* Glass-morphism background */}
      <div className="mx-4 mb-4 rounded-2xl backdrop-blur-xl bg-[#0D1B0F]/90 border border-[#2E7D32]/30 shadow-2xl">
        <div className="flex items-center justify-around px-2 py-3">
          {navItems.map((item) => {
            const active = isActive(item.href) && !item.isAction;
            const badgeCount = getBadgeCount(item.href);
            const isHighlighted = item.isAction && plantsyOpen;

            const itemContent = (
              <>
                {/* Icon Container */}
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className={`relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
                    active || isHighlighted
                      ? 'bg-[#2E7D32] text-white scale-110'
                      : 'text-white/85 group-hover:bg-[#2E7D32]/20 group-hover:text-white'
                  }`}
                >
                  {item.icon}

                  {/* Badge */}
                  {badgeCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg antialiased">
                      {badgeCount > 9 ? '9+' : badgeCount}
                    </span>
                  )}
                </motion.div>

                {/* Label */}
                <span
                  className={`mt-1 text-xs font-medium transition-colors ${
                    active || isHighlighted ? 'text-[#66BB6A]' : 'text-white/85'
                  }`}
                >
                  {item.title}
                </span>

                {/* Active Indicator */}
                {(active || isHighlighted) && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#66BB6A]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </>
            );

            if (item.isAction) {
              return (
                <button
                  key={item.href}
                  onClick={item.action}
                  className="relative flex flex-col items-center justify-center min-w-[44px] min-h-[44px] group"
                  aria-label={item.title}
                >
                  {itemContent}
                </button>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex flex-col items-center justify-center min-w-[44px] min-h-[44px] group"
              >
                {itemContent}
              </Link>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
}
