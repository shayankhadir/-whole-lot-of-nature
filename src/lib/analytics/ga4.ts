// Google Analytics 4 Integration for E-commerce Tracking
// Configuration and utility functions for GA4 events

type GtagCommand = 'config' | 'event' | 'js' | 'set';

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// Helper to safely call gtag
const gtag = (command: GtagCommand, action: string, params?: Record<string, unknown>): void => {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag(command, action, params);
  }
};

// Check if GA is available
export const isGAEnabled = (): boolean => {
  return typeof window !== 'undefined' && 
         typeof window.gtag === 'function' && 
         !!GA_MEASUREMENT_ID;
};

// Initialize GA4 (call this in _app.tsx or layout.tsx)
export const initGA = (): void => {
  if (typeof window === 'undefined' || !GA_MEASUREMENT_ID) return;

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];
  
  // Define gtag function if not exists
  if (typeof window.gtag !== 'function') {
    window.gtag = function gtagFn(...args: unknown[]) {
      window.dataLayer?.push(args);
    };
  }
  
  gtag('js', new Date().toISOString());
  gtag('config', GA_MEASUREMENT_ID, {
    page_path: window.location.pathname,
    send_page_view: true
  });
};

// Track page views
export const trackPageView = (url: string, title?: string): void => {
  if (!isGAEnabled()) return;
  
  gtag('event', 'page_view', {
    page_path: url,
    page_title: title || document.title,
    page_location: window.location.href,
  });
};

// E-commerce Events

interface ProductItem {
  item_id: string;
  item_name: string;
  item_category?: string;
  item_category2?: string;
  item_brand?: string;
  price: number;
  quantity?: number;
  currency?: string;
}

// View Item (Product Page)
export const trackViewItem = (product: ProductItem): void => {
  if (!isGAEnabled()) return;
  
  gtag('event', 'view_item', {
    currency: product.currency || 'INR',
    value: product.price,
    items: [
      {
        item_id: product.item_id,
        item_name: product.item_name,
        item_category: product.item_category || 'Plants',
        item_brand: product.item_brand || 'Whole Lot of Nature',
        price: product.price,
        quantity: product.quantity || 1,
      }
    ]
  });
};

// Add to Cart
export const trackAddToCart = (product: ProductItem): void => {
  if (!isGAEnabled()) return;
  
  gtag('event', 'add_to_cart', {
    currency: product.currency || 'INR',
    value: product.price * (product.quantity || 1),
    items: [
      {
        item_id: product.item_id,
        item_name: product.item_name,
        item_category: product.item_category || 'Plants',
        item_brand: product.item_brand || 'Whole Lot of Nature',
        price: product.price,
        quantity: product.quantity || 1,
      }
    ]
  });
};

// Remove from Cart
export const trackRemoveFromCart = (product: ProductItem): void => {
  if (!isGAEnabled()) return;
  
  gtag('event', 'remove_from_cart', {
    currency: product.currency || 'INR',
    value: product.price * (product.quantity || 1),
    items: [
      {
        item_id: product.item_id,
        item_name: product.item_name,
        item_category: product.item_category || 'Plants',
        item_brand: product.item_brand || 'Whole Lot of Nature',
        price: product.price,
        quantity: product.quantity || 1,
      }
    ]
  });
};

// View Cart
export const trackViewCart = (items: ProductItem[], total: number): void => {
  if (!isGAEnabled()) return;
  
  gtag('event', 'view_cart', {
    currency: 'INR',
    value: total,
    items: items.map(item => ({
      item_id: item.item_id,
      item_name: item.item_name,
      item_category: item.item_category || 'Plants',
      item_brand: item.item_brand || 'Whole Lot of Nature',
      price: item.price,
      quantity: item.quantity || 1,
    }))
  });
};

// Begin Checkout
export const trackBeginCheckout = (items: ProductItem[], total: number, coupon?: string): void => {
  if (!isGAEnabled()) return;
  
  gtag('event', 'begin_checkout', {
    currency: 'INR',
    value: total,
    coupon: coupon || undefined,
    items: items.map(item => ({
      item_id: item.item_id,
      item_name: item.item_name,
      item_category: item.item_category || 'Plants',
      item_brand: item.item_brand || 'Whole Lot of Nature',
      price: item.price,
      quantity: item.quantity || 1,
    }))
  });
};

// Add Shipping Info (Step 2)
export const trackAddShippingInfo = (
  items: ProductItem[], 
  total: number, 
  shippingTier: string,
  coupon?: string
): void => {
  if (!isGAEnabled()) return;
  
  gtag('event', 'add_shipping_info', {
    currency: 'INR',
    value: total,
    coupon: coupon || undefined,
    shipping_tier: shippingTier,
    items: items.map(item => ({
      item_id: item.item_id,
      item_name: item.item_name,
      item_category: item.item_category || 'Plants',
      item_brand: item.item_brand || 'Whole Lot of Nature',
      price: item.price,
      quantity: item.quantity || 1,
    }))
  });
};

// Add Payment Info (Step 3)
export const trackAddPaymentInfo = (
  items: ProductItem[], 
  total: number, 
  paymentType: string,
  coupon?: string
): void => {
  if (!isGAEnabled()) return;
  
  gtag('event', 'add_payment_info', {
    currency: 'INR',
    value: total,
    coupon: coupon || undefined,
    payment_type: paymentType,
    items: items.map(item => ({
      item_id: item.item_id,
      item_name: item.item_name,
      item_category: item.item_category || 'Plants',
      item_brand: item.item_brand || 'Whole Lot of Nature',
      price: item.price,
      quantity: item.quantity || 1,
    }))
  });
};

// Purchase Complete
export const trackPurchase = (
  transactionId: string,
  items: ProductItem[],
  total: number,
  shipping: number,
  tax: number,
  coupon?: string
): void => {
  if (!isGAEnabled()) return;
  
  gtag('event', 'purchase', {
    transaction_id: transactionId,
    currency: 'INR',
    value: total,
    shipping: shipping,
    tax: tax,
    coupon: coupon || undefined,
    items: items.map(item => ({
      item_id: item.item_id,
      item_name: item.item_name,
      item_category: item.item_category || 'Plants',
      item_brand: item.item_brand || 'Whole Lot of Nature',
      price: item.price,
      quantity: item.quantity || 1,
    }))
  });
};

// Refund
export const trackRefund = (transactionId: string, value?: number): void => {
  if (!isGAEnabled()) return;
  
  gtag('event', 'refund', {
    transaction_id: transactionId,
    value: value || undefined,
    currency: 'INR',
  });
};

// Custom Events

// Newsletter Signup
export const trackNewsletterSignup = (method: string = 'footer'): void => {
  if (!isGAEnabled()) return;
  
  gtag('event', 'sign_up', {
    method: method,
  });
};

// Search
export const trackSearch = (searchTerm: string): void => {
  if (!isGAEnabled()) return;
  
  gtag('event', 'search', {
    search_term: searchTerm,
  });
};

// Login
export const trackLogin = (method: string): void => {
  if (!isGAEnabled()) return;
  
  gtag('event', 'login', {
    method: method,
  });
};

// Share
export const trackShare = (contentType: string, itemId: string, method: string): void => {
  if (!isGAEnabled()) return;
  
  gtag('event', 'share', {
    content_type: contentType,
    item_id: itemId,
    method: method,
  });
};

// Contact Form Submission
export const trackContact = (formName: string): void => {
  if (!isGAEnabled()) return;
  
  gtag('event', 'generate_lead', {
    currency: 'INR',
    value: 0,
    form_name: formName,
  });
};

// Wishlist
export const trackAddToWishlist = (product: ProductItem): void => {
  if (!isGAEnabled()) return;
  
  gtag('event', 'add_to_wishlist', {
    currency: product.currency || 'INR',
    value: product.price,
    items: [
      {
        item_id: product.item_id,
        item_name: product.item_name,
        item_category: product.item_category || 'Plants',
        item_brand: product.item_brand || 'Whole Lot of Nature',
        price: product.price,
        quantity: 1,
      }
    ]
  });
};

// View Category/Collection
export const trackViewCategory = (
  categoryName: string, 
  items: ProductItem[]
): void => {
  if (!isGAEnabled()) return;
  
  gtag('event', 'view_item_list', {
    item_list_id: categoryName.toLowerCase().replace(/\s+/g, '_'),
    item_list_name: categoryName,
    items: items.slice(0, 10).map((item, index) => ({
      item_id: item.item_id,
      item_name: item.item_name,
      item_category: item.item_category || categoryName,
      item_brand: item.item_brand || 'Whole Lot of Nature',
      price: item.price,
      quantity: 1,
      index: index,
    }))
  });
};

// Promotion Clicks
export const trackPromoClick = (
  promoId: string, 
  promoName: string, 
  creativeName?: string
): void => {
  if (!isGAEnabled()) return;
  
  gtag('event', 'select_promotion', {
    creative_name: creativeName || promoName,
    creative_slot: 'homepage_banner',
    promotion_id: promoId,
    promotion_name: promoName,
  });
};

// Checkout Step Tracking (for funnel analysis)
export const trackCheckoutStep = (
  step: number, 
  stepName: string,
  items: ProductItem[],
  total: number
): void => {
  if (!isGAEnabled()) return;
  
  gtag('event', 'checkout_progress', {
    currency: 'INR',
    value: total,
    checkout_step: step,
    checkout_step_name: stepName,
    items: items.map(item => ({
      item_id: item.item_id,
      item_name: item.item_name,
      price: item.price,
      quantity: item.quantity || 1,
    }))
  });
};

// Error Tracking
export const trackError = (errorName: string, errorMessage: string, fatal: boolean = false): void => {
  if (!isGAEnabled()) return;
  
  gtag('event', 'exception', {
    description: `${errorName}: ${errorMessage}`,
    fatal: fatal,
  });
};

// Timing Events (Performance)
export const trackTiming = (category: string, variable: string, value: number): void => {
  if (!isGAEnabled()) return;
  
  gtag('event', 'timing_complete', {
    name: variable,
    value: value,
    event_category: category,
  });
};
