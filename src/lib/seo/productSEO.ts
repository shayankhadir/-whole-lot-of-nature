/**
 * Product SEO Utilities
 * Generates rich SEO metadata for product pages
 */

import { WooCommerceProduct } from '../services/woocommerceService';

interface ProductSEO {
  title: string;
  description: string;
  keywords: string[];
  canonical: string;
  structuredData: Record<string, any>;
  openGraph: {
    title: string;
    description: string;
    images: string[];
    type: string;
  };
}

/**
 * Strip HTML tags from string
 */
const stripHtml = (html: string): string => {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
};

/**
 * Generate SEO-optimized keywords from product data
 */
export const generateProductKeywords = (product: WooCommerceProduct): string[] => {
  const keywords = new Set<string>();
  
  // Product name variations
  keywords.add(product.name.toLowerCase());
  keywords.add(`${product.name.toLowerCase()} online`);
  keywords.add(`buy ${product.name.toLowerCase()}`);
  keywords.add(`${product.name.toLowerCase()} india`);
  keywords.add(`${product.name.toLowerCase()} price`);
  
  // Categories
  product.categories?.forEach(cat => {
    keywords.add(cat.name.toLowerCase());
    keywords.add(`${cat.name.toLowerCase()} online`);
    keywords.add(`buy ${cat.name.toLowerCase()}`);
  });
  
  // Tags
  product.tags?.forEach(tag => {
    keywords.add(tag.name.toLowerCase());
  });
  
  // Generic plant keywords
  keywords.add('plants online india');
  keywords.add('buy plants online');
  keywords.add('plant delivery india');
  keywords.add('indoor plants india');
  keywords.add('gardening supplies');
  
  // Location-specific
  keywords.add('plants bangalore');
  keywords.add('plant nursery bangalore');
  
  return Array.from(keywords).slice(0, 20); // Limit to 20 keywords
};

/**
 * Generate SEO-optimized meta description
 */
export const generateProductDescription = (product: WooCommerceProduct): string => {
  const category = product.categories?.[0]?.name || 'Plant';
  const price = product.sale_price || product.price || product.regular_price;
  
  // Safely parse price with fallback
  let priceText = 'Best price';
  if (price) {
    const parsedPrice = parseFloat(price);
    if (!isNaN(parsedPrice)) {
      priceText = `₹${parsedPrice.toLocaleString('en-IN')}`;
    }
  }
  
  // Try to use short description first
  let description = stripHtml(product.short_description || product.description || '');
  
  if (description.length < 50) {
    // Generate description if too short
    description = `Buy ${product.name} online in India. Premium ${category.toLowerCase()} with fast delivery across India. ${priceText}. Expert care tips included. Order now from Whole Lot of Nature.`;
  } else if (description.length > 160) {
    // Truncate if too long
    description = description.substring(0, 157) + '...';
  }
  
  return description;
};

/**
 * Generate rich structured data for product
 */
export const generateProductStructuredData = (
  product: WooCommerceProduct,
  siteUrl: string = 'https://wholelotofnature.com'
): Record<string, any> => {
  const price = product.sale_price || product.price || product.regular_price || '0';
  const images = product.images?.map(img => img.src) || [];
  
  const structuredData: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: stripHtml(product.short_description || product.description || ''),
    image: images,
    sku: product.sku || `WLN-${product.id}`,
    mpn: product.sku || product.id.toString(),
    brand: {
      '@type': 'Brand',
      name: 'Whole Lot of Nature',
      logo: `${siteUrl}/Whole%20lot%20of%20nature%20logo.png`,
      url: siteUrl
    },
    offers: {
      '@type': 'Offer',
      url: `${siteUrl}/shop/${product.slug}`,
      priceCurrency: 'INR',
      price: parseFloat(price).toFixed(2),
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      availability: product.in_stock 
        ? 'https://schema.org/InStock' 
        : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: 'Whole Lot of Nature'
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: '0',
          currency: 'INR'
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'IN'
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 0,
            maxValue: 1,
            unitCode: 'DAY'
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 3,
            maxValue: 7,
            unitCode: 'DAY'
          }
        }
      }
    },
    category: product.categories?.map(cat => cat.name).join(', '),
  };
  
  // Add rating if available
  if (product.average_rating && parseFloat(product.average_rating) > 0) {
    structuredData.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: parseFloat(product.average_rating).toFixed(1),
      reviewCount: product.rating_count || 1,
      bestRating: '5',
      worstRating: '1'
    };
  }
  
  // Add breadcrumb
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteUrl
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Shop',
        item: `${siteUrl}/shop`
      }
    ]
  };
  
  if (product.categories?.[0]) {
    breadcrumb.itemListElement.push({
      '@type': 'ListItem',
      position: 3,
      name: product.categories[0].name,
      item: `${siteUrl}/shop?category=${product.categories[0].slug}`
    });
    
    breadcrumb.itemListElement.push({
      '@type': 'ListItem',
      position: 4,
      name: product.name,
      item: `${siteUrl}/shop/${product.slug}`
    });
  }
  
  return {
    product: structuredData,
    breadcrumb
  };
};

/**
 * Generate complete SEO metadata for product page
 */
export const generateProductSEO = (
  product: WooCommerceProduct,
  siteUrl: string = 'https://wholelotofnature.com'
): ProductSEO => {
  const title = `${product.name} | Buy Online India | Whole Lot of Nature`;
  const description = generateProductDescription(product);
  const keywords = generateProductKeywords(product);
  const canonical = `${siteUrl}/shop/${product.slug}`;
  const structuredData = generateProductStructuredData(product, siteUrl);
  const images = product.images?.map(img => img.src) || [];
  
  return {
    title,
    description,
    keywords,
    canonical,
    structuredData,
    openGraph: {
      title: `${product.name} | Whole Lot of Nature`,
      description,
      images: images.slice(0, 4), // OG accepts multiple images
      type: 'product'
    }
  };
};

/**
 * Generate FAQ schema for product page
 */
export const generateProductFAQSchema = (product: WooCommerceProduct): Record<string, any> => {
  const faqs = [
    {
      question: `How much does ${product.name} cost?`,
      answer: `${product.name} is available for ${product.sale_price || product.price || product.regular_price} INR at Whole Lot of Nature. We offer free delivery across India on orders above ₹500.`
    },
    {
      question: `Is ${product.name} available for delivery in India?`,
      answer: `Yes, ${product.name} is available for delivery across India. We ship to all major cities including Bangalore, Mumbai, Delhi, Chennai, Hyderabad, and more.`
    },
    {
      question: `How do I care for ${product.name}?`,
      answer: `Each ${product.name} comes with detailed care instructions. Generally, provide indirect sunlight, water when soil feels dry, and use organic fertilizer monthly.`
    },
    {
      question: `Is ${product.name} safe for pets?`,
      answer: `Please check the product description for pet safety information. We clearly mark pet-friendly plants. Contact our support team if you have specific concerns.`
    },
    {
      question: `What is the return policy for ${product.name}?`,
      answer: `We offer a 7-day return policy on ${product.name}. If the plant arrives damaged or unhealthy, we will provide a full refund or replacement.`
    }
  ];
  
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
};
