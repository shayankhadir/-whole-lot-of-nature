interface PricedProduct {
  price?: string | number;
  regular_price?: string | number;
  sale_price?: string | number;
}

// Utility function to format price in Indian Rupees
export function formatPrice(price: string | number): string {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  if (isNaN(numPrice) || numPrice === 0) {
    return '₹0';
  }
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numPrice);
}

// Utility function to get sale price or regular price
export function getDisplayPrice(product: PricedProduct): string {
  const salePrice = product.sale_price;
  const regularPrice = product.regular_price;
  
  if (salePrice && parseFloat(String(salePrice)) > 0) {
    return formatPrice(salePrice);
  }
  
  if (regularPrice && parseFloat(String(regularPrice)) > 0) {
    return formatPrice(regularPrice);
  }
  
  return formatPrice(product.price || 0);
}

// Utility function to get original price for strikethrough
export function getOriginalPrice(product: PricedProduct): string | null {
  const salePrice = product.sale_price;
  const regularPrice = product.regular_price;
  
  if (salePrice && parseFloat(String(salePrice)) > 0 && regularPrice && parseFloat(String(regularPrice)) > parseFloat(String(salePrice))) {
    return formatPrice(regularPrice);
  }
  
  return null;
}

// Utility function to check if product is on sale
export function isOnSale(product: PricedProduct): boolean {
  const salePrice = product.sale_price;
  const regularPrice = product.regular_price;
  
  return !!(salePrice && parseFloat(String(salePrice)) > 0 && regularPrice && parseFloat(String(regularPrice)) > parseFloat(String(salePrice)));
}

// Utility function to get discount percentage
export function getDiscountPercentage(product: PricedProduct): number {
  const salePrice = parseFloat(String(product.sale_price || 0));
  const regularPrice = parseFloat(String(product.regular_price || 0));
  
  if (salePrice > 0 && regularPrice > salePrice) {
    return Math.round(((regularPrice - salePrice) / regularPrice) * 100);
  }
  
  return 0;
}

// Utility function to calculate discount between two prices
export function calculateDiscount(regularPrice: number, salePrice: number): number {
  if (!regularPrice || !salePrice || salePrice >= regularPrice) return 0;
  return Math.round(((regularPrice - salePrice) / regularPrice) * 100);
}