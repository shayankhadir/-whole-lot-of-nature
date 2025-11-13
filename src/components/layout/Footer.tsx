'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-primary-900 text-white border-t border-primary-800">
      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center space-x-6 md:order-2">
          <Link href="https://www.instagram.com/wholelotofnature/" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors">
            <span className="sr-only">Instagram</span>
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
            </svg>
          </Link>
          <Link href="https://www.youtube.com/@wholelotofnature" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors">
            <span className="sr-only">YouTube</span>
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
        <div className="mt-8 md:order-1 md:mt-0">
          <p className="text-center text-xs leading-5 text-white/70">
            &copy; {new Date().getFullYear()} Whole Lot of Nature. All rights reserved.
          </p>
        </div>
      </div>
      {/* Contact CTA */}
      <div className="mx-auto max-w-7xl px-6 pb-4 lg:px-8">
        <div className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-md">
          <p className="text-sm text-white/85">Need help or have a question?</p>
          <Link href="/about#contact" className="inline-flex items-center rounded-none bg-white px-4 py-2 text-sm font-semibold text-primary-700 shadow hover:bg-gray-100">
            Contact us
          </Link>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-4 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-sm font-semibold leading-6 text-white">Shop</h3>
            <ul role="list" className="mt-6 space-y-4">
              <li>
                <Link href="/shop" className="text-sm leading-6 text-white/70 hover:text-white">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/shop/categories" className="text-sm leading-6 text-white/70 hover:text-white">
                  Categories
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold leading-6 text-white">Company</h3>
            <ul role="list" className="mt-6 space-y-4">
              <li>
                <Link href="/about" className="text-sm leading-6 text-white/70 hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/team" className="text-sm leading-6 text-white/70 hover:text-white">
                  Our Team
                </Link>
              </li>
              <li>
                <Link href="/partnerships" className="text-sm leading-6 text-white/70 hover:text-white">
                  Partnerships
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm leading-6 text-white/70 hover:text-white">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold leading-6 text-white">Support</h3>
            <ul role="list" className="mt-6 space-y-4">
              <li>
                <Link href="/about#contact" className="text-sm leading-6 text-white/70 hover:text-white">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm leading-6 text-white/70 hover:text-white">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="text-sm leading-6 text-white/70 hover:text-white">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-sm leading-6 text-white/70 hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-and-conditions" className="text-sm leading-6 text-white/70 hover:text-white">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold leading-6 text-white">Newsletter</h3>
            <p className="mt-6 text-sm leading-6 text-white/80">
              Subscribe for updates, tips, and offers.
            </p>
            <form className="mt-6">
              <input
                type="email"
                placeholder="Enter your email"
                className="block w-full rounded-none border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-white/30 placeholder:text-gray-300 focus:ring-2 focus:ring-inset focus:ring-white sm:text-sm sm:leading-6"
              />
              <button
                type="submit"
                className="mt-4 block w-full rounded-none bg-white text-primary-700 px-3.5 py-2.5 text-center text-sm font-semibold shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
    </footer>
  );
}