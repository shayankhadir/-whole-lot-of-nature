export default function JsonLd() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://wholelotofnature.com';

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Whole Lot of Nature',
    url: baseUrl,
  logo: `${baseUrl}/logo.svg`,
    description: 'Premium eco-friendly products for your home and garden.',
    sameAs: [
      'https://facebook.com/wholelotofnature',
      'https://instagram.com/wholelotofnature',
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: '123 Nature Street',
      addressLocality: 'Greenville',
      addressRegion: 'GV',
      postalCode: '12345',
      addressCountry: 'US',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-555-123-4567',
      contactType: 'customer service',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}