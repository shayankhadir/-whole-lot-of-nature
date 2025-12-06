import { Metadata } from 'next'
import ContactForm from '@/components/forms/ContactForm'

export const metadata: Metadata = {
  openGraph: {
    title: 'Contact | Whole Lot of Nature',
    description: 'Discover premium plants and gardening supplies at Whole Lot of Nature. Expert advice and quality products for your green space in Bangalore.',
    images: ['https://wholelotofnature.com/images/og-image.jpg'],
    url: 'https://wholelotofnature.com/contact',
  },
  title: 'Contact Us | Whole Lot of Nature',
  description: 'Get in touch with Whole Lot of Nature for product inquiries, orders, and support.',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#0D1B0F]">
      {/* Hero */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-[#66BB6A] antialiased mb-4">Contact Us</h1>
          <p className="text-base md:text-lg text-white/80 max-w-3xl mx-auto antialiased">We&apos;re here to help. Reach out with questions about products, orders, or support.</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h2 className="text-base md:text-lg font-semibold text-[#66BB6A] antialiased">Email</h2>
              <p className="text-white/85 mt-2">store@wholelotofnature.com</p>
            </div>
            <div>
              <h2 className="text-base md:text-lg font-semibold text-[#66BB6A] antialiased">Phone</h2>
              <p className="text-white/85 mt-2">+91 12345 67890</p>
            </div>
            <div>
              <h2 className="text-base md:text-lg font-semibold text-[#66BB6A] antialiased">Address</h2>
              <p className="text-white/85 mt-2">123 Nature Street, Greenville, GV 12345</p>
            </div>
            <div className="text-sm text-white/50 pt-4">
              Prefer a quick note? You can also reach us via the contact section on the <a href="/about#contact" className="text-[#66BB6A] hover:text-[#2E7D32] underline transition-colors">About page</a>.
            </div>
          </div>
          <ContactForm />
        </div>
      </section>
    </div>
  )
}