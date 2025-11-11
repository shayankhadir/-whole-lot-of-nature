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
export function getDisplayPrice(product: any): string {
  const salePrice = product.sale_price;
  const regularPrice = product.regular_price;
  
  if (salePrice && parseFloat(salePrice) > 0) {
    return formatPrice(salePrice);
  }
  
  if (regularPrice && parseFloat(regularPrice) > 0) {
    return formatPrice(regularPrice);
  }
  
  return formatPrice(product.price || 0);
}

// Utility function to get original price for strikethrough
export function getOriginalPrice(product: any): string | null {
  const salePrice = product.sale_price;
  const regularPrice = product.regular_price;
  
  if (salePrice && parseFloat(salePrice) > 0 && regularPrice && parseFloat(regularPrice) > parseFloat(salePrice)) {
    return formatPrice(regularPrice);
  }
  
  return null;
}

// Utility function to check if product is on sale
export function isOnSale(product: any): boolean {
  const salePrice = product.sale_price;
  const regularPrice = product.regular_price;
  
  return salePrice && parseFloat(salePrice) > 0 && regularPrice && parseFloat(regularPrice) > parseFloat(salePrice);
}

// Utility function to get discount percentage
export function getDiscountPercentage(product: any): number {
  const salePrice = parseFloat(product.sale_price || 0);
  const regularPrice = parseFloat(product.regular_price || 0);
  
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