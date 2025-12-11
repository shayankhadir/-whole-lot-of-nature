import { Metadata } from 'next'
import Image from 'next/image'
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
    <div className="relative min-h-screen overflow-hidden bg-[#0b1c12] text-white">
      {/* Leafy backdrop */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/backgrounds/ai-generated-lush-tropical-green-leaves-background-photo.jpg"
          alt="Lush tropical leaves"
          fill
          className="object-cover opacity-20"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#041107]/90 via-[#0b1c12]/85 to-[#041107]/90" />
      </div>

      {/* Hero */}
      <section className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-200 text-sm uppercase tracking-[0.2em]">
            Bangalore • Whole Lot of Nature
          </span>
          <h1 className="text-4xl md:text-5xl font-display font-bold leading-tight antialiased">
            Let&apos;s build your green sanctuary
          </h1>
          <p className="text-lg md:text-xl text-emerald-100/80 max-w-3xl mx-auto antialiased">
            Questions about plants, soil, landscaping, or aquascaping? Our team replies within 24 hours on weekdays.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="pb-16 md:pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-5 gap-10 lg:gap-12 items-start">
          <div className="lg:col-span-2 space-y-6 bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-2xl">
            <h2 className="text-2xl font-semibold text-emerald-100 antialiased">Visit, call, or write</h2>
            <div className="space-y-4 text-emerald-50/80 text-base">
              <div>
                <p className="text-emerald-300 text-sm uppercase tracking-wide">Email</p>
                <p className="mt-1 font-medium">store@wholelotofnature.com</p>
              </div>
              <div>
                <p className="text-emerald-300 text-sm uppercase tracking-wide">Phone</p>
                <p className="mt-1 font-medium">+91 12345 67890</p>
              </div>
              <div>
                <p className="text-emerald-300 text-sm uppercase tracking-wide">Studio</p>
                <p className="mt-1 font-medium">Bangalore, Karnataka</p>
                <p className="text-sm text-emerald-100/70">Serving the city and nearby areas</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 pt-4 text-sm text-emerald-100/80">
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                <p className="font-semibold text-emerald-200">Landscaping & ponds</p>
                <p className="text-emerald-100/70 mt-1">Full-service garden, pond, and aquascaping projects (coming soon).</p>
              </div>
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                <p className="font-semibold text-emerald-200">Order support</p>
                <p className="text-emerald-100/70 mt-1">Status, returns, and plant care guidance for every purchase.</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="rounded-3xl border border-emerald-500/20 bg-white/5 backdrop-blur-md shadow-2xl">
              <div className="p-6 md:p-8">
                <p className="text-sm uppercase tracking-[0.2em] text-emerald-200 mb-3">Send a note</p>
                <h3 className="text-2xl font-semibold text-white mb-6 antialiased">Tell us what you need</h3>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}