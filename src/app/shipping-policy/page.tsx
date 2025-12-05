
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  openGraph: {
    title: 'Shipping Policy | Whole Lot of Nature',
    description: 'Learn about our shipping policies, delivery times, and handling for live plants and gardening supplies across India.',
    images: ['https://wholelotofnature.com/images/og-image.jpg'],
    url: 'https://wholelotofnature.com/shipping-policy',
  },
  title: 'Shipping Policy | Whole Lot of Nature',
  description: 'Shipping information, delivery timelines, and handling care for your plants.',
}

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-[#0D1B0F]">
      {/* Hero */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-[#66BB6A] antialiased mb-4">Shipping Policy</h1>
          <p className="text-base md:text-lg text-white/80 max-w-3xl mx-auto antialiased">
            Delivering nature to your doorstep with care and speed.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <p className="text-white/85 text-sm">
            Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <div className="bg-gradient-to-br from-[#1e3a28] to-[#0F1E11] border-l-4 border-[#66BB6A] p-6 rounded-lg">
            <p className="text-white/90 font-medium leading-relaxed">
              At Whole Lot of Nature, we take extra precautions to ensure your plants and products arrive safely. We ship across India using trusted courier partners.
            </p>
          </div>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-[#66BB6A] mb-4 antialiased">1. Processing Time</h2>
            <p className="text-white/80 leading-relaxed mb-4">
              All orders are processed within 1-2 business days. Orders are not shipped or delivered on weekends or holidays to ensure plants do not sit in transit depots.
            </p>
            <p className="text-white/80 leading-relaxed">
              If we are experiencing a high volume of orders, shipments may be delayed by a few days. Please allow additional days in transit for delivery. If there will be a significant delay in shipment of your order, we will contact you via email or telephone.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-[#66BB6A] mb-4 antialiased">2. Shipping Rates & Delivery Estimates</h2>
            <p className="text-white/80 leading-relaxed mb-4">
              Shipping charges for your order will be calculated and displayed at checkout.
            </p>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm text-white/80">
                <thead className="bg-white/10 uppercase font-medium text-emerald-200">
                  <tr>
                    <th className="px-6 py-3">Shipping Method</th>
                    <th className="px-6 py-3">Estimated Delivery Time</th>
                    <th className="px-6 py-3">Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  <tr>
                    <td className="px-6 py-4">Standard Shipping</td>
                    <td className="px-6 py-4">3-7 business days</td>
                    <td className="px-6 py-4">Calculated at checkout</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4">Express Shipping</td>
                    <td className="px-6 py-4">2-4 business days</td>
                    <td className="px-6 py-4">Calculated at checkout</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-white/60 text-sm mt-4 italic">
              * Delivery delays can occasionally occur due to weather or courier issues.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-[#66BB6A] mb-4 antialiased">3. Shipment Confirmation & Order Tracking</h2>
            <p className="text-white/80 leading-relaxed mb-4">
              You will receive a Shipment Confirmation email once your order has shipped containing your tracking number(s). The tracking number will be active within 24 hours.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-[#66BB6A] mb-4 antialiased">4. Damages</h2>
            <p className="text-white/80 leading-relaxed mb-4">
              Whole Lot of Nature is not liable for any products damaged or lost during shipping. If you received your order damaged, please contact the shipment carrier to file a claim.
            </p>
            <p className="text-white/80 leading-relaxed">
              However, for live plants, if they arrive in poor condition, please contact us immediately (within 24 hours) with photos at <Link href="/contact" className="text-[#66BB6A] underline">our contact page</Link>. We will do our best to resolve the issue.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
