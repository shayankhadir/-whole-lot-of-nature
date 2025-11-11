import { Metadata } from 'next'
import BlurText from '@/components/ui/BlurText'

export const metadata: Metadata = {
  title: 'Contact Us | Whole Lot of Nature',
  description: 'Get in touch with Whole Lot of Nature for product inquiries, orders, and support.',
}

export default function ContactPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-50 to-primary-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Contact Us</h1>
          <p className="mt-4 text-gray-700 max-w-3xl mx-auto">We’re here to help. Reach out with questions about products, orders, or partnerships.</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Email</h2>
              <p className="text-gray-700">store@wholelotofnature.com</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Phone</h2>
              <p className="text-gray-700">+91 12345 67890</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Address</h2>
              <p className="text-gray-700">123 Nature Street, Greenville, GV 12345</p>
            </div>
            <div className="text-sm text-gray-500">
              Prefer a quick note? You can also reach us via the contact section on the <a href="/about#contact" className="text-primary-700 underline">About page</a>.
            </div>
          </div>
          <form className="space-y-4 bg-white border border-gray-200 rounded-none p-6">
            <div>
              <label className="block text-sm font-medium text-gray-900">Name</label>
              <input className="mt-1 w-full rounded-none border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900">Email</label>
              <input type="email" className="mt-1 w-full rounded-none border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900">Message</label>
              <textarea rows={4} className="mt-1 w-full rounded-none border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600" required />
            </div>
            <button type="submit" className="px-6 py-3 bg-primary-700 text-white rounded-none hover:bg-primary-600 transition-colors">Send Message</button>
          </form>
        </div>
      </section>
    </div>
  )
}