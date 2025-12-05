
import { Metadata } from 'next'

export const metadata: Metadata = {
  openGraph: {
    title: 'Privacy Policy | Whole Lot of Nature',
    description: 'Discover premium plants and gardening supplies at Whole Lot of Nature. Expert advice and quality products for your green space in Bangalore.',
    images: ['https://wholelotofnature.com/images/og-image.jpg'],
    url: 'https://wholelotofnature.com/privacy-policy',
  },
  title: 'Privacy Policy | Whole Lot of Nature',
  description: 'Learn how we protect and handle your personal information.',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#0D1B0F]">
      {/* Hero */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-[#66BB6A] antialiased mb-4">Privacy Policy</h1>
          <p className="text-base md:text-lg text-white/80 max-w-3xl mx-auto antialiased">How we collect, use, and safeguard your information.</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <p className="text-white/85 text-sm">
            Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <div className="bg-gradient-to-br from-[#1e3a28] to-[#0F1E11] border-l-4 border-[#66BB6A] p-6 rounded-lg">
            <p className="text-white/90 font-medium leading-relaxed">
              At Whole Lot of Nature, we respect your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or make a purchase.
            </p>
          </div>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-[#66BB6A] mb-4 antialiased">1. Information We Collect</h2>
            
            <h3 className="text-base md:text-lg font-semibold text-emerald-200 mb-3 antialiased">Personal Information</h3>
            <p className="text-white/80 leading-relaxed mb-4">
              We collect personal information that you voluntarily provide to us when you:
            </p>
            <ul className="list-disc pl-6 text-white/75 space-y-2 mb-4">
              <li>Create an account on our website</li>
              <li>Place an order or make a purchase</li>
              <li>Subscribe to our newsletter</li>
              <li>Contact us with inquiries or feedback</li>
              <li>Participate in surveys or promotions</li>
            </ul>

            <h3 className="text-base md:text-lg font-semibold text-emerald-200 mb-3 antialiased">Information Collected Includes:</h3>
            <ul className="list-disc pl-6 text-white/75 space-y-2">
              <li>Name and contact information (email, phone number, address)</li>
              <li>Billing and shipping addresses</li>
              <li>Payment information (processed securely through payment gateways)</li>
              <li>Purchase history and preferences</li>
              <li>Communications with our customer service team</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-[#66BB6A] mb-4 antialiased">2. Automatic Information Collection</h2>
            <p className="text-white/80 leading-relaxed mb-4">
              When you visit our website, we automatically collect certain information:
            </p>
            <ul className="list-disc pl-6 text-white/75 space-y-2">
              <li>Browser type and version</li>
              <li>Operating system</li>
              <li>IP address and location data</li>
              <li>Pages viewed and time spent on pages</li>
              <li>Referring website addresses</li>
              <li>Device information</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-[#66BB6A] mb-4 antialiased">3. How We Use Your Information</h2>
            <p className="text-white/80 leading-relaxed mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 text-white/75 space-y-2">
              <li>Process and fulfill your orders</li>
              <li>Communicate with you about your orders and account</li>
              <li>Send you marketing communications (with your consent)</li>
              <li>Improve our website, products, and services</li>
              <li>Personalize your shopping experience</li>
              <li>Prevent fraud and enhance security</li>
              <li>Comply with legal obligations</li>
              <li>Analyze website usage and trends</li>
              <li>Respond to customer service requests</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-[#66BB6A] mb-4 antialiased">4. Information Sharing and Disclosure</h2>
            <p className="text-white/80 leading-relaxed mb-4">
              We may share your information with:
            </p>
            
            <h3 className="text-base md:text-lg font-semibold text-emerald-200 mb-3 antialiased">Service Providers:</h3>
            <ul className="list-disc pl-6 text-white/75 space-y-2 mb-4">
              <li>Payment processors</li>
              <li>Shipping and delivery partners</li>
              <li>Email service providers</li>
              <li>Website hosting and analytics services</li>
            </ul>

            <h3 className="text-base md:text-lg font-semibold text-emerald-200 mb-3 antialiased">Legal Requirements:</h3>
            <p className="text-white/80 leading-relaxed mb-4">
              We may disclose your information if required by law or if we believe disclosure is necessary to:
            </p>
            <ul className="list-disc pl-6 text-white/75 space-y-2">
              <li>Comply with legal processes or government requests</li>
              <li>Enforce our terms and conditions</li>
              <li>Protect our rights, property, or safety</li>
              <li>Prevent fraud or illegal activities</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-[#66BB6A] mb-4 antialiased">5. Cookies and Tracking Technologies</h2>
            <p className="text-white/80 leading-relaxed mb-4">
              We use cookies and similar technologies to:
            </p>
            <ul className="list-disc pl-6 text-white/75 space-y-2 mb-4">
              <li>Remember your preferences and settings</li>
              <li>Keep you logged into your account</li>
              <li>Analyze website traffic and usage patterns</li>
              <li>Provide personalized content and advertisements</li>
              <li>Improve website functionality</li>
            </ul>
            <p className="text-white/80 leading-relaxed">
              You can control cookies through your browser settings. However, disabling cookies may affect your ability to use certain features of our website.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-[#66BB6A] mb-4 antialiased">6. Data Security</h2>
            <p className="text-white/80 leading-relaxed mb-4">
              We implement appropriate technical and organizational measures to protect your personal information:
            </p>
            <ul className="list-disc pl-6 text-white/75 space-y-2">
              <li>Secure Socket Layer (SSL) encryption for data transmission</li>
              <li>Secure servers and databases</li>
              <li>Regular security audits and updates</li>
              <li>Access controls and authentication</li>
              <li>Employee training on data protection</li>
            </ul>
            <p className="text-white/80 leading-relaxed mt-4">
              However, no method of transmission over the internet is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-[#66BB6A] mb-4 antialiased">7. Your Rights and Choices</h2>
            <p className="text-white/80 leading-relaxed mb-4">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 text-white/75 space-y-2">
              <li><strong>Access:</strong> Request a copy of your personal information</li>
              <li><strong>Correction:</strong> Update or correct inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information</li>
              <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
              <li><strong>Portability:</strong> Request transfer of your data to another service</li>
              <li><strong>Object:</strong> Object to certain processing of your information</li>
            </ul>
            <p className="text-white/80 leading-relaxed mt-4">
              To exercise these rights, please contact us through our Contact Us page.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-[#66BB6A] mb-4 antialiased">8. Marketing Communications</h2>
            <p className="text-white/80 leading-relaxed mb-4">
              With your consent, we may send you:
            </p>
            <ul className="list-disc pl-6 text-white/75 space-y-2">
              <li>Promotional emails about new products and special offers</li>
              <li>Newsletter with gardening tips and plant care advice</li>
              <li>Updates about your orders and account</li>
            </ul>
            <p className="text-white/80 leading-relaxed mt-4">
              You can opt-out of marketing communications at any time by clicking the &quot;unsubscribe&quot; link in our emails or contacting us directly.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-[#66BB6A] mb-4 antialiased">9. Third-Party Links</h2>
            <p className="text-white/80 leading-relaxed">
              Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. We encourage you to read their privacy policies before providing any personal information.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-[#66BB6A] mb-4 antialiased">10. Children&apos;s Privacy</h2>
            <p className="text-white/80 leading-relaxed">
              Our website is not intended for children under 18 years of age. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-[#66BB6A] mb-4 antialiased">11. Data Retention</h2>
            <p className="text-white/80 leading-relaxed">
              We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required by law. When we no longer need your information, we will securely delete or anonymize it.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-[#66BB6A] mb-4 antialiased">12. Changes to This Policy</h2>
            <p className="text-white/80 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new policy on our website and updating the &quot;Last updated&quot; date. We encourage you to review this policy periodically.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-[#66BB6A] mb-4 antialiased">13. Contact Us</h2>
            <p className="text-white/80 leading-relaxed">
              If you have questions or concerns about this Privacy Policy or our data practices, please contact us through our Contact Us page or reach out to our customer service team.
            </p>
          </section>

          <div className="mt-12 p-6 bg-gradient-to-br from-[#1e3a28] to-[#0F1E11] rounded-lg border border-[#2E7D32]/30">
            <h3 className="text-lg font-semibold text-[#66BB6A] mb-3 antialiased">Your Privacy Matters</h3>
            <p className="text-sm text-white/80">
              We are committed to transparency and protecting your privacy. If you have any questions about how we handle your personal information, please don&apos;t hesitate to reach out to us.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
