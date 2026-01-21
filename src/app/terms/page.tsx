import { Metadata } from 'next'

export const metadata: Metadata = {
  openGraph: {
    title: 'Terms | Whole Lot of Nature',
    description: 'Discover premium plants and gardening supplies at Whole Lot of Nature. Expert advice and quality products for your green space in Bangalore.',
    images: ['https://wholelotofnature.com/images/og-image.jpg'],
    url: 'https://wholelotofnature.com/terms',
  },
  title: 'Terms & Conditions for Plant Orders | Whole Lot of Nature',
  description: 'Read the terms and conditions for Whole Lot of Nature orders, services, and site usage.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0D1B0F] py-16 md:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-[#66BB6A] mb-12 antialiased">Terms & Conditions</h1>
        <div className="space-y-6">
          <p className="text-white/85 text-sm">
            Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-[#66BB6A] mb-4 antialiased">1. Acceptance of Terms</h2>
            <p className="text-white/80 leading-relaxed">
              By accessing and using Whole Lot of Nature&apos;s website and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-[#66BB6A] mb-4 antialiased">2. Product Information</h2>
            <p className="text-white/80 leading-relaxed mb-4">
              We strive to provide accurate product information, including descriptions, images, and pricing. However:
            </p>
            <ul className="list-disc pl-6 text-white/75 space-y-2">
              <li>Product colors may vary slightly from images due to screen settings</li>
              <li>Plant sizes and appearances may vary as they are living organisms</li>
              <li>We reserve the right to correct any errors in product information or pricing</li>
              <li>Product availability is subject to change without notice</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-[#66BB6A] mb-4 antialiased">3. Orders and Payment</h2>
            <p className="text-white/80 leading-relaxed mb-4">
              When you place an order with us:
            </p>
            <ul className="list-disc pl-6 text-white/75 space-y-2">
              <li>All prices are listed in Indian Rupees (INR) and include applicable taxes</li>
              <li>Payment must be received before order processing begins</li>
              <li>We accept various payment methods as displayed at checkout</li>
              <li>We reserve the right to refuse or cancel any order for any reason</li>
              <li>Order confirmation does not guarantee product availability</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-[#66BB6A] mb-4 antialiased">4. Shipping and Delivery</h2>
            <p className="text-white/80 leading-relaxed mb-4">
              Regarding shipping:
            </p>
            <ul className="list-disc pl-6 text-white/75 space-y-2">
              <li>Free shipping on orders over ₹999</li>
              <li>Delivery times are estimates and not guaranteed</li>
              <li>Risk of loss passes to you upon delivery to the carrier</li>
              <li>We are not responsible for delays caused by shipping carriers or natural disasters</li>
              <li>Live plants require special handling and may have longer delivery times</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-[#66BB6A] mb-4 antialiased">5. Plant Care and Responsibility</h2>
            <p className="text-white/80 leading-relaxed mb-4">
              As a customer purchasing live plants:
            </p>
            <ul className="list-disc pl-6 text-white/75 space-y-2">
              <li>You are responsible for proper plant care after delivery</li>
              <li>We provide care instructions but cannot guarantee plant survival</li>
              <li>Environmental factors beyond our control may affect plant health</li>
              <li>Please report any delivery damage within 24 hours of receipt</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-[#66BB6A] mb-4 antialiased">6. Intellectual Property</h2>
            <p className="text-white/80 leading-relaxed">
              All content on this website, including text, graphics, logos, images, and software, is the property of Whole Lot of Nature and protected by intellectual property laws. You may not reproduce, distribute, or create derivative works without our explicit written permission.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-[#66BB6A] mb-4 antialiased">7. User Conduct</h2>
            <p className="text-white/80 leading-relaxed mb-4">
              You agree not to:
            </p>
            <ul className="list-disc pl-6 text-white/75 space-y-2">
              <li>Use our website for any unlawful purpose</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with the proper functioning of the website</li>
              <li>Upload malicious code or viruses</li>
              <li>Impersonate any person or entity</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-[#66BB6A] mb-4 antialiased">8. Limitation of Liability</h2>
            <p className="text-white/80 leading-relaxed">
              Whole Lot of Nature shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our products or services. Our total liability shall not exceed the amount paid by you for the product or service in question.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-[#66BB6A] mb-4 antialiased">9. Privacy</h2>
            <p className="text-white/80 leading-relaxed">
              Your use of our website is also governed by our Privacy Policy. Please review our Privacy Policy to understand our practices regarding your personal information.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-[#66BB6A] mb-4 antialiased">10. Changes to Terms</h2>
            <p className="text-white/80 leading-relaxed">
              We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting to the website. Your continued use of our services after changes constitutes acceptance of the modified terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-[#66BB6A] mb-4 antialiased">11. Governing Law</h2>
            <p className="text-white/80 leading-relaxed">
              These terms shall be governed by and construed in accordance with the laws of India. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in India.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-[#66BB6A] mb-4 antialiased">12. Contact Information</h2>
            <p className="text-white/80 leading-relaxed">
              If you have any questions about these Terms & Conditions, please contact us through our Contact Us page or reach out to our customer service team.
            </p>
          </section>

          <div className="mt-12 p-6 bg-gradient-to-br from-[#1e3a28] to-[#0F1E11] rounded-lg border border-[#2E7D32]/30">
            <p className="text-sm text-white/80">
              By using Whole Lot of Nature&apos;s website and services, you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
