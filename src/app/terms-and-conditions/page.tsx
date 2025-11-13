import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms & Conditions | Whole Lot of Nature',
  description: 'Read the Terms and Conditions that govern the use of Whole Lot of Nature products and services.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0D1B0F]">
      {/* Hero */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-[#66BB6A] antialiased mb-4">Terms & Conditions</h1>
          <p className="text-base md:text-lg text-white/80 max-w-3xl mx-auto">Please review these terms carefully before using our website or purchasing our products.</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {[{
            title: '1. Acceptance of Terms',
            body: 'By accessing or using Whole Lot of Nature (the “Site”), you agree to be bound by these Terms & Conditions and our Privacy Policy.'
          },{
            title: '2. Eligibility',
            body: 'You must be at least 18 years old or have legal parental/guardian consent to use this Site and place orders.'
          },{
            title: '3. Products & Availability',
            body: 'We strive to accurately describe products; availability may vary. Natural variations can occur in live plants and organic materials.'
          },{
            title: '4. Pricing & Payments',
            body: 'Prices are listed in INR and may change without notice. Payments are processed via secure gateways. Orders are confirmed upon successful payment.'
          },{
            title: '5. Shipping & Delivery',
            body: 'We ship across India. Estimated delivery times are provided at checkout and may vary based on carrier and region.'
          },{
            title: '6. Returns & Refunds',
            body: 'Please refer to our Refund Policy for eligibility and process. Certain items may be non-returnable due to their nature.'
          },{
            title: '7. User Conduct',
            body: 'You agree not to misuse the Site, including unauthorized access, data mining, or activities that disrupt service.'
          },{
            title: '8. Intellectual Property',
            body: 'All content is the property of Whole Lot of Nature or its licensors and protected by IP laws.'
          },{
            title: '9. Limitation of Liability',
            body: 'To the fullest extent permitted by law, Whole Lot of Nature is not liable for indirect, incidental, or consequential damages.'
          },{
            title: '10. Governing Law',
            body: 'These Terms are governed by the laws of India. Any disputes shall be subject to the jurisdiction of courts in Bengaluru, Karnataka.'
          },{
            title: '11. Contact',
            body: 'For questions about these Terms, contact us at info@wholelotofnature.com.'
          }].map((item) => (
            <div key={item.title} className="bg-gradient-to-br from-[#1e3a28] to-[#0F1E11] border border-[#2E7D32]/30 rounded-lg p-6">
              <h2 className="text-lg md:text-xl font-semibold text-[#66BB6A] antialiased">{item.title}</h2>
              <p className="mt-3 text-white/80 leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
