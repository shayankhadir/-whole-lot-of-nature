"use client";

import { useEffect, useState, Fragment } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Dialog, Transition } from "@headlessui/react";
import {
  Menu,
  X,
  Heart,
  User,
  ChevronDown,
  Leaf,
  Droplet,
  Sparkles,
  Sprout,
  Gem,
  LogIn,
  Search,
  ShoppingCart,
  Truck,
  UserCircle,
} from "lucide-react";
import CartIcon from "../cart/CartIcon";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useCartStore } from "@/stores/cartStore";

const shopCollections = [
  {
    title: "Soil & Growing Media",
    description: "Rich blends, substrates, and organic nourishment for thriving roots.",
    href: "/shop?category=soil-and-growing-media",
    accent: "from-primary-800 to-primary-600",
    icon: Sprout,
    items: [
      { name: "Soil Mixes", href: "/shop?category=soil-mixes" },
      { name: "Soil-Less Substrates", href: "/shop?category=soil-less-mixes-and-substrates" },
      { name: "Amendments & Additives", href: "/shop?category=amendments-and-additives" },
      { name: "Fertilizers & Organic Manures", href: "/shop?category=fertilizers-and-organic-manures" },
    ],
  },
  {
    title: "Land Plants",
    description: "Curated indoor, outdoor, and sculptural greens for every light profile.",
    href: "/shop?category=land-plants",
    accent: "from-primary-800 to-primary-600",
    icon: Leaf,
    items: [
      { name: "Indoor Plants", href: "/shop?category=indoor-plants" },
      { name: "Outdoor / Garden Plants", href: "/shop?category=outdoor-garden-plants" },
      { name: "Succulents & Cacti", href: "/shop?category=succulents-and-cacti" },
      { name: "Low Maintenance", href: "/shop?category=low-maintenance-plants" },
    ],
  },
  {
    title: "Aquatic Life & Ecosystem",
    description: "Living aquascapes, oxygenating plants, and pond companions.",
    href: "/shop?category=aquatic-life-ecosystem",
    accent: "from-primary-800 to-primary-600",
    icon: Droplet,
    items: [
      { name: "Aquatic Plants", href: "/shop?category=aquatic-plants" },
      { name: "Snails & Pond Life", href: "/shop?category=aquatic-snails-and-pond-life" },
      { name: "Terrace & Balcony Water Gardens", href: "/shop?tag=terrace-garden" },
    ],
  },
  {
    title: "Wellness & Herbal",
    description: "Ayurvedic supplements and botanical rituals for daily restoration.",
    href: "/shop?category=wellness-herbal-products",
    accent: "from-primary-800 to-primary-600",
    icon: Sparkles,
    items: [
      { name: "Herbal Supplements", href: "/shop?category=herbal-supplements" },
      { name: "Hair & Body Care", href: "/shop?category=hair-and-body-products" },
      { name: "Herbal Powders & Extracts", href: "/shop?category=herbal-powders-and-extracts" },
    ],
  },
  {
    title: "Plant decor & eBooks",
    description: "Miniature sets, plant decor and digital guides for every green space.",
    href: "/shop?category=plant-decor-and-ebooks",
    accent: "from-primary-800 to-primary-600",
    icon: Gem,
    items: [
      { name: "Miniature Cactus Sets", href: "/shop?category=miniature-cactus-sets" },
      { name: "Miniature Succulent Sets", href: "/shop?category=miniature-succulent-sets" },
      { name: "E-books", href: "/shop?category=e-books-and-guides" },
      { name: "Guides & Kits", href: "/shop?category=decor-and-digital" },
    ],
  },
];

const navigation = [
  { name: "Shop", href: "/shop", dropdown: shopCollections },
  { name: "Blog", href: "/blog" },
  { name: "Services", href: "/services" },
  { name: "About", href: "/about" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const openCart = useCartStore((s) => s.openCart);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`sticky top-0 z-[100] transition-all duration-300 ${
        scrolled
          ? "glass border-b border-[#2E7D32]/20 shadow-[0_8px_20px_-10px_rgba(46,125,50,0.25)]"
          : "bg-gradient-to-b from-[#0A0A0A]/80 to-transparent backdrop-blur-md border-b border-white/5"
      } text-white`}
    >
      <nav className="relative mx-auto max-w-7xl py-2.5 px-4 lg:px-8" aria-label="Global">
        <div className="flex items-center justify-between gap-6">
          {/* Left: Logo */}
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center"
          >
            <Link href="/" className="-m-1.5 p-1.5 group">
              <div className="flex items-center gap-3">
                <Image src="/images/logo-removebg-preview.png" alt="Whole Lot of Nature" width={180} height={60} className="h-12 w-auto transition-transform duration-300 group-hover:scale-105" priority unoptimized />
              </div>
            </Link>
          </motion.div>

          {/* Right: Menu + Search + Icons */}
          <div className="hidden lg:flex items-center gap-x-6">
            {navigation.map((item, index) =>
              item.dropdown ? (
                <div key={item.name} className="static" onMouseLeave={() => setShopDropdownOpen(false)}>
                  <motion.button
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-1 text-sm font-semibold leading-6 text-white/95 hover:text-white transition-colors px-2 py-2 uppercase tracking-wider"
                    onMouseEnter={() => setShopDropdownOpen(true)}
                    onClick={() => setShopDropdownOpen((open) => !open)}
                  >
                    {item.name}
                    <motion.div animate={{ rotate: shopDropdownOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown className="h-4 w-4" strokeWidth={1.5} />
                    </motion.div>
                  </motion.button>

                  <Transition
                    show={shopDropdownOpen}
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 -translate-y-2"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 -translate-y-2"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="absolute top-full left-1/2 -translate-x-1/2 z-[999] w-screen max-w-7xl mt-1 border border-emerald-900/20 bg-gradient-to-b from-[#0a0a0a] to-[#0a0a0a] backdrop-blur-xl shadow-2xl rounded-b-3xl"
                      onMouseEnter={() => setShopDropdownOpen(true)}
                      onMouseLeave={() => setShopDropdownOpen(false)}
                    >
                      <div className="p-6 md:p-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-8">
                          {Array.isArray(item.dropdown) &&
                            item.dropdown.map((collection) => (
                              <Link
                                key={collection.title}
                                href={collection.href}
                                onClick={() => setShopDropdownOpen(false)}
                                className="group flex flex-col gap-4 rounded-2xl border border-emerald-900/30 bg-gradient-to-br from-[#0f1e11]/60 to-[#0c1b12]/60 p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-emerald-700/50 hover:bg-gradient-to-br hover:from-[#0f1e11]/80 hover:to-[#0c1b12]/80"
                              >
                                <div className="relative overflow-hidden rounded-full bg-emerald-900/30 p-4 ring-1 ring-emerald-700/40 w-14 h-14 flex items-center justify-center group-hover:bg-emerald-900/50 transition-all">
                                  <collection.icon className="h-7 w-7 text-emerald-400 group-hover:text-emerald-300 transition-colors" aria-hidden="true" strokeWidth={1.75} />
                                </div>
                                <div>
                                  <h3 className="text-lg font-semibold text-emerald-50 group-hover:text-emerald-300 transition-colors antialiased">
                                    {collection.title}
                                  </h3>
                                  <p className="mt-2 text-sm text-emerald-200/70">{collection.description}</p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {collection.items.map((sub) => (
                                    <Link
                                      key={sub.name}
                                      href={sub.href}
                                      onClick={() => setShopDropdownOpen(false)}
                                      className="inline-flex items-center rounded-lg border border-emerald-800/40 bg-emerald-950/30 px-3 py-1 text-xs font-medium text-emerald-300 hover:border-emerald-700/60 hover:bg-emerald-900/50 hover:text-emerald-200 transition-all"
                                    >
                                      {sub.name}
                                    </Link>
                                  ))}
                                </div>
                              </Link>
                            ))}
                        </div>
                        <div className="mt-6 flex items-center justify-between rounded-2xl border border-dashed border-emerald-800/40 bg-gradient-to-r from-emerald-950/40 to-emerald-900/20 p-4 text-sm text-emerald-200/90 shadow-md hover:shadow-lg transition-all">
                          <span className="text-emerald-100">Looking for bundles or limited editions?</span>
                          <Link href="/shop?tag=gift-bundles" className="font-semibold text-emerald-300 hover:text-emerald-200 transition-colors flex items-center gap-2">
                            Explore curated sets
                            <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>→</motion.span>
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  </Transition>
                </div>
              ) : (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Link
                    href={item.href}
                    className="group relative text-sm font-semibold leading-6 text-white/95 hover:text-white transition-colors px-2 py-2 uppercase tracking-wider"
                  >
                    {item.name}
                  </Link>
                </motion.div>
              )
            )}

            {/* Removed extra contact button as requested */}

            {/* Search */}
            <HeaderSearch open={searchOpen} setOpen={setSearchOpen} />

            {/* Account menu */}
            <div
              className="relative"
              onMouseEnter={() => setAccountOpen(true)}
              onMouseLeave={() => setAccountOpen(false)}
            >
              <button
                className="p-2 rounded-full text-white hover:bg-primary-400/20 transition-colors"
                aria-haspopup="true"
                aria-label="Account menu"
                onClick={() => setAccountOpen((v) => !v)}
              >
                <UserCircle className="h-6 w-6" strokeWidth={1.5} />
              </button>
              <Transition
                show={accountOpen}
                enter="transition ease-out duration-150"
                enterFrom="opacity-0 -translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 -translate-y-1"
              >
                <div id="account-menu" className="absolute right-0 mt-2 w-64 rounded-xl bg-white text-gray-900 shadow-lg ring-1 ring-black/5">
                  <div className="p-2">
                    <Link href="/login" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50">
                      <UserCircle className="h-4 w-4 text-primary-900" />
                      <span className="text-sm font-medium text-primary-900">Sign in / My account</span>
                    </Link>
                    <Link href="/wishlist" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50">
                      <Heart className="h-4 w-4 text-primary-900" />
                      <span className="text-sm font-medium text-primary-900">Wishlist</span>
                    </Link>
                    <Link href="/track-order" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50">
                      <Truck className="h-4 w-4 text-primary-900" />
                      <span className="text-sm font-medium text-primary-900">Track order</span>
                    </Link>
                  </div>
                </div>
              </Transition>
            </div>
            
            {/* Cart Icon */}
            <button
              onClick={openCart}
              className="relative p-2 rounded-full text-white hover:bg-primary-400/20 transition-colors"
              aria-label="Open shopping cart"
            >
              <ShoppingCart className="h-6 w-6" strokeWidth={1.5} />
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden justify-end">
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-primary-600 hover:bg-gray-100 transition-colors"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </motion.button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-50" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link href="/" className="-m-1.5 p-1.5">
              <Image src="/images/logo-removebg-preview.png" alt="Whole Lot of Nature" width={140} height={50} className="h-10 w-auto" unoptimized />
            </Link>
            <button type="button" className="-m-2.5 rounded-md p-2.5 text-primary-600" onClick={() => setMobileMenuOpen(false)}>
              <span className="sr-only">Close menu</span>
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) =>
                  item.dropdown ? (
                    <div key={item.name}>
                      <span className="block px-3 py-2 text-base font-semibold text-gray-900 antialiased">{item.name}</span>
                      <div className="space-y-4 pl-3">
                        {Array.isArray(item.dropdown) &&
                          item.dropdown.map((collection) => (
                            <div key={collection.title} className="rounded-xl border border-gray-100 bg-gray-50/60 p-3">
                              <Link href={collection.href} className="flex items-center justify-between text-sm font-semibold text-gray-900" onClick={() => setMobileMenuOpen(false)}>
                                <span className="inline-flex items-center gap-2">
                                  <collection.icon className="h-4 w-4 text-primary-600" aria-hidden="true" />
                                  {collection.title}
                                </span>
                                <ChevronDown className="h-4 w-4 rotate-[-90deg] text-gray-400" />
                              </Link>
                              <div className="mt-2 flex flex-wrap gap-2">
                                {collection.items.map((sub) => (
                                  <Link key={sub.name} href={sub.href} onClick={() => setMobileMenuOpen(false)} className="inline-flex items-center rounded-full border border-gray-200 px-3 py-1.5 min-h-[36px] text-xs text-gray-700 hover:border-[#2E7D32] hover:text-[#2E7D32] transition-colors touch-manipulation">
                                    {sub.name}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ) : (
                    <Link key={item.name} href={item.href} className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 antialiased">
                      {item.name}
                    </Link>
                  )
                )}
              </div>
              <div className="py-6 space-y-4">
                {/* Mobile search */}
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const q = formData.get('q') as string;
                  const url = q ? `/shop?q=${encodeURIComponent(q)}` : "/shop";
                  window.location.href = url;
                }} className="px-3">
                  <div className="flex items-center w-full bg-gray-50 rounded-full px-4 py-2.5 border border-gray-200">
                    <Search className="w-5 h-5 text-gray-500" strokeWidth={1.75} />
                    <input
                      name="q"
                      type="search"
                      placeholder="Search products"
                      className="ml-2 w-full bg-transparent placeholder-gray-500 text-gray-900 text-sm outline-none"
                    />
                  </div>
                </form>
                
                <div className="flex gap-4 px-3">
                  <Link href="/wishlist" className="group">
                    <Heart className="h-6 w-6 text-primary-600" />
                  </Link>
                  <Link href="/login" className="group">
                    <User className="h-6 w-6 text-primary-600" />
                  </Link>
                  <CartIcon />
                </div>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </motion.header>
  );
}

// Inline component: HeaderSearch
function HeaderSearch({ open, setOpen }: { open: boolean; setOpen: (v: boolean) => void }) {
  const [value, setValue] = useState("");
  const router = useRouter();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const url = value ? `/shop?q=${encodeURIComponent(value)}` : "/shop";
    if (router && typeof router.push === "function") router.push(url);
    else if (typeof window !== "undefined") window.location.href = url;
    setOpen(false);
  };

  return (
    <form onSubmit={submit} className="relative">
      <div className="flex items-center w-64 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20 hover:bg-white/15 transition-all">
        <Search className="w-5 h-5 text-white" strokeWidth={1.75} />
        <input
          aria-label="Search products"
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search products"
          className="ml-2 w-full bg-transparent placeholder-white/70 text-white text-sm outline-none"
        />
      </div>
    </form>
  );
}
