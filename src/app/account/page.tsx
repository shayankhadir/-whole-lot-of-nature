"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function AccountPage() {
  const wpBase = (process.env.NEXT_PUBLIC_WORDPRESS_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://wholelotofnature.com").replace(/\/$/, "");
  const myAccount = `${wpBase}/my-account/`;

  return (
    <section className="min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-100 px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="rounded-2xl bg-white shadow-xl ring-1 ring-black/5 p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-primary-900 antialiased">Sign in</h1>
            <p className="mt-1 text-sm text-primary-900">Choose how you'd like to sign in</p>
          </div>

          <a
            href={myAccount}
            className="w-full inline-flex items-center justify-center h-12 rounded-full border border-primary-300 text-primary-900 font-semibold hover:bg-primary-700 hover:text-white transition-colors"
          >
            Sign in with Shop
          </a>

          <p className="mt-6 text-center text-xs text-primary-900">
            By continuing you agree to our
            <Link href="/terms" className="ml-1 underline hover:text-primary-700">terms</Link>
            <span className="mx-1">and</span>
            <Link href="/privacy" className="underline hover:text-primary-700">privacy policy</Link>.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
