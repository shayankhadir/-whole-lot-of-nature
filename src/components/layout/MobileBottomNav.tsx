"use client";

import Link from "next/link";
import { Home, ShoppingBag, Heart, User, ShoppingCart } from "lucide-react";
import CartIcon from "../cart/CartIcon";

export default function MobileBottomNav() {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-[60] bg-white/90 backdrop-blur border-t border-gray-200 shadow-[0_-6px_20px_-12px_rgba(0,0,0,0.2)] lg:hidden">
      <ul className="grid grid-cols-5 text-xs">
        <li>
          <Link href="/" className="flex flex-col items-center justify-center py-2.5 text-gray-700 hover:text-primary-700">
            <Home className="h-6 w-6" />
            <span>Home</span>
          </Link>
        </li>
        <li>
          <Link href="/shop" className="flex flex-col items-center justify-center py-2.5 text-gray-700 hover:text-primary-700">
            <ShoppingBag className="h-6 w-6" />
            <span>Shop</span>
          </Link>
        </li>
        <li>
          <Link href="/wishlist" className="flex flex-col items-center justify-center py-2.5 text-gray-700 hover:text-primary-700">
            <Heart className="h-6 w-6" />
            <span>Wishlist</span>
          </Link>
        </li>
        <li>
          <Link href="/account" className="flex flex-col items-center justify-center py-2.5 text-gray-700 hover:text-primary-700">
            <User className="h-6 w-6" />
            <span>Account</span>
          </Link>
        </li>
        <li>
          <div className="flex flex-col items-center justify-center py-2.5 text-gray-700 hover:text-primary-700">
            <CartIcon className="h-6 w-6" />
            <span>Cart</span>
          </div>
        </li>
      </ul>
    </nav>
  );
}
