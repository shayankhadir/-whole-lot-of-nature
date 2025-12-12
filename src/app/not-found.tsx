import Link from 'next/link';

/**
 * Not Found (404) Page
 * 
 * Displays when a user navigates to a non-existent page.
 * Simplified version for SSR compatibility.
 */
export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 flex items-center justify-center relative overflow-hidden px-4 sm:px-6 lg:px-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#2E7D32] rounded-full mix-blend-multiply filter blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#2E7D32] rounded-full mix-blend-multiply filter blur-3xl" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 text-center max-w-2xl">
        {/* Large 404 Number */}
        <div className="mb-8 sm:mb-12">
          <h1 className="text-9xl sm:text-10xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600 select-none drop-shadow-2xl antialiased">
            404
          </h1>
        </div>

        {/* Heading */}
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight antialiased">
          Page Not Found
        </h2>

        {/* Description */}
        <p className="text-xl sm:text-2xl text-gray-300 mb-8 leading-relaxed antialiased">
          Something went wrong, or the page you&apos;re looking for doesn&apos;t exist.
          Let&apos;s get you back on track!
        </p>

        {/* Additional Info */}
        <p className="text-lg text-gray-100 mb-10 italic antialiased">
          It seems our digital garden has a gap. Let&apos;s get you back to the right place.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
          {/* Back to Home Button */}
          <Link href="/">
            <button className="bg-[#2E7D32] hover:bg-[#1b5e20] text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 text-lg shadow-lg hover:shadow-xl antialiased">
              Back to Homepage
            </button>
          </Link>

          {/* Shop Button */}
          <Link href="/shop">
            <button className="border-2 border-gray-400 hover:border-[#2E7D32] text-gray-300 hover:text-[#2E7D32] font-bold py-3 px-8 rounded-lg transition-all duration-300 text-lg antialiased">
              Continue Shopping
            </button>
          </Link>
        </div>

        {/* Help Text */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <p className="text-gray-100 text-sm mb-4">
            Need help? Visit our support resources:
          </p>
          <div className="flex justify-center gap-6 flex-wrap">
            <Link
              href="/contact"
              className="text-[#2E7D32] hover:text-[#66BB6A] transition-colors duration-300 underline"
            >
              Contact Us
            </Link>
            <Link
              href="/faq"
              className="text-[#2E7D32] hover:text-[#66BB6A] transition-colors duration-300 underline"
            >
              FAQ
            </Link>
            <Link
              href="/faq"
              className="text-[#2E7D32] hover:text-[#66BB6A] transition-colors duration-300 underline"
            >
              FAQ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
