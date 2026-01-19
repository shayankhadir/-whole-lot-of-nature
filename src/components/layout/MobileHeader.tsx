'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Dialog } from '@headlessui/react';
import { Menu, X, Search, User, ChevronRight } from 'lucide-react';
import { useWishlistStore } from '@/stores/wishlistStore';
import { useCartStore } from '@/stores/cartStore';
import { navigation, shopCollections } from './navigationData';

export default function MobileHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const cartCount = useCartStore((s) => s.items.reduce((sum, item) => sum + item.quantity, 0));
  const openCart = useCartStore((s) => s.openCart);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#0D1B0F]/95 backdrop-blur border-b border-[#2E7D32]/20 shadow-sm lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          {mounted ? (
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors backdrop-blur-md"
              aria-label="Open navigation menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          ) : (
            <div className="w-10 h-10" aria-hidden="true" />
          )}

          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="Whole Lot of Nature"
              width={140}
              height={44}
              className="h-10 w-auto"
              priority
            />
          </Link>

          {/* Icons removed to avoid duplication with floating nav */}
          <div className="w-10" /> 
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={setMenuOpen} cartCount={cartCount} wishlistCount={wishlistCount} />
    </>
  );
}

interface MobileMenuProps {
  open: boolean;
  onClose: (open: boolean) => void;
  cartCount: number;
  wishlistCount: number;
}

function MobileMenu({ open, onClose, cartCount, wishlistCount }: MobileMenuProps) {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    const query = search.trim();
    const url = query ? `/shop?search=${encodeURIComponent(query)}` : '/shop';
    router.push(url);
    onClose(false);
  };

  const navLinks = navigation;

  return (
    <Dialog open={open} onClose={onClose} className="lg:hidden">
      <div className="fixed inset-0 bg-black/40 z-40 backdrop-blur-md" aria-hidden="true" />
      <Dialog.Panel className="fixed inset-y-0 left-0 z-50 w-[88%] max-w-sm bg-[#0F1E11] text-white shadow-2xl">
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <Dialog.Title className="text-base font-semibold tracking-wide antialiased">Menu</Dialog.Title>
          <button
            type="button"
            onClick={() => onClose(false)}
            className="p-2 rounded-full hover:bg-white/10 backdrop-blur-md"
            aria-label="Close menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-col h-full overflow-hidden">
          <div className="px-4 py-4 space-y-6 overflow-y-auto">
            <form onSubmit={submitSearch} className="flex items-center gap-3 rounded-full border border-white/15 px-4 py-2.5 bg-white/5 backdrop-blur-md">
              <Search className="w-5 h-5 text-white/85" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products"
                className="flex-1 bg-transparent text-sm placeholder:text-white/60 focus:outline-none"
              />
            </form>

            <nav className="space-y-2">
              {navLinks.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => onClose(false)}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold tracking-wide uppercase hover:bg-white/10 transition-colors"
                >
                  <span>{item.name}</span>
                  <ChevronRight className="w-4 h-4 text-white/85" />
                </Link>
              ))}
            </nav>

            <div className="space-y-4">
              <p className="text-xs font-semibold tracking-wider text-[#66BB6A] uppercase pl-1">Collections</p>
              <div className="grid grid-cols-1 gap-3">
                {shopCollections.map((collection) => (
                  <div key={collection.title} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 backdrop-blur-md hover:border-[#66BB6A]/30 transition-colors">
                    <Link
                      href={collection.href}
                      onClick={() => onClose(false)}
                      className="flex items-center justify-between mb-3"
                    >
                      <span className="flex items-center gap-2 font-semibold text-white/90">
                        <collection.icon className="w-4 h-4 text-[#66BB6A]" />
                        {collection.title}
                      </span>
                      <ChevronRight className="w-4 h-4 text-white/60" />
                    </Link>
                    <div className="flex flex-wrap gap-2">
                      {collection.items.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => onClose(false)}
                          className="rounded-lg bg-white/5 px-3 py-1.5 text-xs text-white/70 hover:bg-[#66BB6A]/20 hover:text-[#66BB6A] transition-colors"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-auto border-t border-white/10 bg-white/5 px-4 py-4 backdrop-blur-md">
            <div className="grid grid-cols-2 gap-3 text-center">
              <Link href="/wishlist" onClick={() => onClose(false)} className="rounded-xl border border-white/15 px-3 py-2">
                <p className="text-xs uppercase tracking-wider text-white/85">Wishlist</p>
                <p className="text-lg font-semibold antialiased">{wishlistCount}</p>
              </Link>
              <button
                type="button"
                onClick={() => {
                  openCart();
                  onClose(false);
                }}
                className="rounded-xl border border-white/15 px-3 py-2"
              >
                <p className="text-xs uppercase tracking-wider text-white/85">Cart</p>
                <p className="text-lg font-semibold antialiased">{cartCount}</p>
              </button>
            </div>
            <Link
              href="/login"
              onClick={() => onClose(false)}
              className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-[#2E7D32] py-3 text-sm font-semibold"
            >
              <User className="w-4 h-4" />
              Account & Orders
            </Link>
          </div>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
}
