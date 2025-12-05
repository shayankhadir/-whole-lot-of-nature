
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  openGraph: {
    title: 'Refund Policy | Whole Lot of Nature',
    description: 'Discover premium plants and gardening supplies at Whole Lot of Nature. Expert advice and quality products for your green space in Bangalore.',
    images: ['https://wholelotofnature.com/images/og-image.jpg'],
    url: 'https://wholelotofnature.com/refund-policy',
  },
  title: 'Refund Policy | Whole Lot of Nature',
  description: 'Learn about our refund and return policy for plants and gardening products.',
}

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-[#0D1B0F]">
      {/* Hero */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-[#66BB6A] antialiased mb-4">Refund & Return Policy</h1>
          <p className="text-base md:text-lg text-white/80 max-w-3xl mx-auto antialiased">Clear, customer-first policies for live plants and gardening supplies.</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <p className="text-white/85 text-sm">
            Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <div className="bg-gradient-to-br from-[#1e3a28] to-[#0F1E11] border-l-4 border-[#66BB6A] p-6 rounded-lg">
            <p className="text-white/90 font-medium leading-relaxed">
              At Whole Lot of Nature, we want you to be completely satisfied with your purchase. We understand that plants are living products, so we have specific policies to ensure fairness for both our customers and our business.
            </p>
          </div>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-[#66BB6A] mb-4 antialiased">1. Return Eligibility</h2>
            <h3 className="text-base md:text-lg font-semibold text-emerald-200 mb-3 antialiased">For Live Plants:</h3>
            <ul className="list-disc pl-6 text-white/75 space-y-2 mb-4">
              <li>Returns must be reported within 24 hours of delivery</li>
              <li>Plants must show clear signs of damage or disease upon delivery</li>
              <li>Photographic evidence of the issue must be provided</li>
              <li>Plants must be in their original packaging when possible</li>
              <li>Returns due to customer negligence or improper care will not be accepted</li>
            </ul>

            <h3 className="text-base md:text-lg font-semibold text-emerald-200 mb-3 antialiased">For Gardening Supplies & Accessories:</h3>
            <ul className="list-disc pl-6 text-white/75 space-y-2">
              <li>Returns accepted within 7 days of delivery</li>
              <li>Items must be unused and in original packaging</li>
              <li>All tags and labels must be intact</li>
              <li>Proof of purchase is required</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-[#66BB6A] mb-4 antialiased">2. Non-Returnable Items</h2>
            <p className="text-white/80 leading-relaxed mb-4">
              The following items cannot be returned:
            </p>
            <ul className="list-disc pl-6 text-white/75 space-y-2">
              <li>Plants that have been transplanted or removed from original containers</li>
              <li>Opened bags of soil, fertilizer, or other consumables</li>
              <li>Custom or personalized items</li>
              <li>Sale or clearance items (unless defective)</li>
              <li>Plants damaged due to improper care after delivery</li>
              <li>Gift cards</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-[#66BB6A] mb-4 antialiased">3. How to Initiate a Return</h2>
            <p className="text-white/80 leading-relaxed mb-4">
              To request a return:
            </p>
            <ol className="list-decimal pl-6 text-white/75 space-y-3">
              <li>
                <strong>Contact Us:</strong> Reach out to our customer service team through our{' '}
                <Link href="/contact" className="text-[#66BB6A] hover:text-[#2E7D32] underline transition-colors">
                  Contact page
                </Link>
                {' '}or email us at store@wholelotofnature.com
              </li>
              <li>
                <strong>Provide Details:</strong> Include your order number, product name, and photos of the issue
              </li>
              <li>
                <strong>Await Approval:</strong> Our team will review your request within 24-48 hours
              </li>
              <li>
                <strong>Arrange Shipment:</strong> Once approved, we'll provide a prepaid return label or shipping instructions
              </li>
              <li>
                <strong>Receive Refund:</strong> Upon receipt and inspection, we'll process your refund within 5-7 business days
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-[#66BB6A] mb-4 antialiased">4. Return Shipping</h2>
            <p className="text-white/80 leading-relaxed">
              For eligible returns due to damage or defects, we provide a prepaid return label. For returns initiated by the customer (non-damage related), return shipping costs are the responsibility of the customer unless otherwise specified.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-[#66BB6A] mb-4 antialiased">5. Refund Processing</h2>
            <p className="text-white/80 leading-relaxed mb-4">
              Once we receive and inspect your return:
            </p>
            <ul className="list-disc pl-6 text-white/75 space-y-2">
              <li>We'll send you confirmation of receipt within 24 hours</li>
              <li>Inspection typically takes 2-3 business days</li>
              <li>Approved refunds are processed within 5-7 business days</li>
              <li>Refunds are issued to the original payment method</li>
              <li>Allow additional 1-2 weeks for the refund to appear in your account, depending on your bank</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-[#66BB6A] mb-4 antialiased">6. Plant Quality Guarantee</h2>
            <p className="text-white/80 leading-relaxed">
              All our plants are carefully selected and inspected before shipment. If you receive a plant that is dead or severely damaged, we'll replace it free of charge or issue a full refund at your option.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-[#66BB6A] mb-4 antialiased">7. Exceptions and Special Cases</h2>
            <p className="text-white/80 leading-relaxed mb-4">
              Special circumstances may be reviewed on a case-by-case basis:
            </p>
            <ul className="list-disc pl-6 text-white/75 space-y-2">
              <li>Seasonal delays (rare plant availability)</li>
              <li>Regional restrictions</li>
              <li>Unforeseen shipping complications</li>
            </ul>
            <p className="text-white/80 leading-relaxed mt-4">
              Please contact our customer service team to discuss your specific situation.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-[#66BB6A] mb-4 antialiased">8. Contact Us for Returns</h2>
            <p className="text-white/80 leading-relaxed">
              If you have questions about our return and refund policy, please reach out to us. We're here to help!
            </p>
            <div className="mt-4 p-4 bg-gradient-to-br from-[#1e3a28] to-[#0F1E11] rounded-lg border border-[#2E7D32]/30">
              <p className="text-white/90 text-sm">
                <strong>Email:</strong> store@wholelotofnature.com<br/>
                <strong>Phone:</strong> +91 12345 67890<br/>
                <strong>Hours:</strong> Monday - Sunday, 9 AM - 6 PM IST
              </p>
            </div>
          </section>

          <div className="mt-12 p-6 bg-gradient-to-br from-[#1e3a28] to-[#0F1E11] rounded-lg border border-[#2E7D32]/30">
            <h3 className="text-lg font-semibold text-[#66BB6A] mb-3 antialiased">Your Satisfaction is Our Priority</h3>
            <p className="text-sm text-white/80">
              We stand behind the quality of our products. If you're not satisfied with your purchase, we'll work with you to make it right.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

