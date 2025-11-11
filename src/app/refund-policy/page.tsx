
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Refund Policy | Whole Lot of Nature',
  description: 'Learn about our refund and return policy for plants and gardening products.',
}

export default function RefundPolicyPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-50 to-primary-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-3 rounded-full bg-white/80 px-4 py-2 border border-primary-100 text-primary-700">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M12 3a9 9 0 1 1-6.364 2.636A9 9 0 0 1 12 3Zm.75 4.5a.75.75 0 0 0-1.5 0V12a.75.75 0 0 0 .375.649l3 1.714a.75.75 0 1 0 .75-1.298l-2.625-1.5V7.5Z"/></svg>
            <span className="text-sm font-semibold">Fair & Friendly Returns</span>
          </div>
          <h1 className="mt-4 text-4xl md:text-5xl font-bold text-gray-900">Refund & Return Policy</h1>
          <p className="mt-4 text-gray-700 max-w-3xl mx-auto">Clear, customer-first policies for live plants and gardening supplies.</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-6">
            Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <div className="bg-primary-50 border-l-4 border-primary-600 p-6 mb-8">
            <p className="text-gray-800 font-medium">
              At Whole Lot of Nature, we want you to be completely satisfied with your purchase. We understand that plants are living products, so we have specific policies to ensure fairness for both our customers and our business.
            </p>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Return Eligibility</h2>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">For Live Plants:</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>Returns must be reported within 24 hours of delivery</li>
              <li>Plants must show clear signs of damage or disease upon delivery</li>
              <li>Photographic evidence of the issue must be provided</li>
              <li>Plants must be in their original packaging when possible</li>
              <li>Returns due to customer negligence or improper care will not be accepted</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">For Gardening Supplies & Accessories:</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Returns accepted within 7 days of delivery</li>
              <li>Items must be unused and in original packaging</li>
              <li>All tags and labels must be intact</li>
              <li>Proof of purchase is required</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Non-Returnable Items</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              The following items cannot be returned:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Plants that have been transplanted or removed from original containers</li>
              <li>Opened bags of soil, fertilizer, or other consumables</li>
              <li>Custom or personalized items</li>
              <li>Sale or clearance items (unless defective)</li>
              <li>Plants damaged due to improper care after delivery</li>
              <li>Gift cards</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How to Initiate a Return</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              To request a return:
            </p>
            <ol className="list-decimal pl-6 text-gray-700 space-y-3">
              <li>
                <strong>Contact Us:</strong> Reach out to our customer service team through our{' '}
                <Link href="/contact" className="text-primary-600 hover:text-primary-700 underline">
                  Contact Us
                </Link>{' '}
                page
              </li>
              <li>
                <strong>Provide Details:</strong> Include your order number, item details, and reason for return
              </li>
              <li>
                <strong>Submit Photos:</strong> For plants, provide clear photos showing the issue
              </li>
              <li>
                <strong>Await Approval:</strong> Our team will review your request within 24-48 hours
              </li>
              <li>
                <strong>Return Shipping:</strong> If approved, we'll provide return instructions
              </li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Refund Process</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Once your return is received and inspected:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>We will send you an email notification of receipt</li>
              <li>Inspection will be completed within 2-3 business days</li>
              <li>If approved, refunds will be processed to your original payment method</li>
              <li>Refunds typically appear within 5-10 business days depending on your bank</li>
              <li>Shipping charges are non-refundable unless the return is due to our error</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Exchanges</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We offer exchanges for:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Defective or damaged items</li>
              <li>Wrong items sent in error</li>
              <li>Items that do not match their description</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              To exchange an item, follow the return process above and specify that you'd like an exchange rather than a refund.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Damaged or Defective Items</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you receive a damaged or defective item:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Inspect your order upon delivery</li>
              <li>Report damage within 24 hours with photos</li>
              <li>We will arrange for replacement or full refund at no cost to you</li>
              <li>Return shipping will be covered by us</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Plant Health Guarantee</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We offer a 7-day health guarantee on all live plants:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Plants are guaranteed to arrive healthy and alive</li>
              <li>If a plant shows signs of disease or stress within 7 days, contact us</li>
              <li>We may offer care advice, replacement, or refund depending on the situation</li>
              <li>This guarantee does not cover issues resulting from improper care</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Return Shipping Costs</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Shipping costs for returns:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Customer pays return shipping for change of mind or non-defective items</li>
              <li>We cover return shipping for our errors, defects, or damaged items</li>
              <li>Use a trackable shipping method for returns</li>
              <li>We recommend insurance for valuable returns</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Cancellations</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Order cancellations:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Orders can be cancelled within 2 hours of placement</li>
              <li>Contact us immediately if you need to cancel</li>
              <li>Full refund if cancelled before shipping</li>
              <li>Once shipped, standard return policy applies</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have questions about our refund policy or need to initiate a return, please{' '}
              <Link href="/contact" className="text-primary-600 hover:text-primary-700 underline">
                contact our customer service team
              </Link>
              . We're here to help make your experience with Whole Lot of Nature positive and hassle-free.
            </p>
          </section>

          <div className="mt-12 p-6 bg-green-50 rounded-lg border border-green-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Our Commitment</h3>
            <p className="text-sm text-gray-700">
              We stand behind the quality of our products and want you to be 100% satisfied. If there's ever an issue with your order, we'll work with you to make it right. Your satisfaction is our priority!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
