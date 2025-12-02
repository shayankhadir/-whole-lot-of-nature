/**
 * Google Ads Conversion Tracking Utilities
 * ==========================================
 * Integration for Google Ads conversion tracking and remarketing.
 * 
 * Setup Instructions:
 * 1. Add your Google Ads Conversion ID to .env.local as NEXT_PUBLIC_GOOGLE_ADS_ID
 * 2. Add conversion labels for each action type
 * 3. The gtag script is loaded in layout.tsx
 */

// Type declaration for gtag
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

// Google Ads Configuration
export const GOOGLE_ADS_CONFIG = {
  // Main Google Ads Account ID (AW-XXXXXXXXXX)
  conversionId: process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || '',
  
  // Conversion Labels for different events
  conversionLabels: {
    purchase: process.env.NEXT_PUBLIC_GADS_PURCHASE_LABEL || '',
    addToCart: process.env.NEXT_PUBLIC_GADS_ADD_TO_CART_LABEL || '',
    beginCheckout: process.env.NEXT_PUBLIC_GADS_CHECKOUT_LABEL || '',
    signup: process.env.NEXT_PUBLIC_GADS_SIGNUP_LABEL || '',
    leadForm: process.env.NEXT_PUBLIC_GADS_LEAD_LABEL || '',
    pageView: process.env.NEXT_PUBLIC_GADS_PAGEVIEW_LABEL || '',
  },
};

/**
 * Check if Google Ads tracking is available
 */
export const isGoogleAdsAvailable = (): boolean => {
  return typeof window !== 'undefined' && 
         typeof window.gtag === 'function' && 
         !!GOOGLE_ADS_CONFIG.conversionId;
};

/**
 * Track a Google Ads conversion event
 */
export const trackConversion = (
  conversionLabel: string,
  value?: number,
  currency: string = 'INR',
  transactionId?: string
): void => {
  if (!isGoogleAdsAvailable() || !conversionLabel) {
    console.log('[Google Ads] Conversion tracking not available or label missing');
    return;
  }

  const conversionData: Record<string, unknown> = {
    send_to: `${GOOGLE_ADS_CONFIG.conversionId}/${conversionLabel}`,
  };

  if (value !== undefined) {
    conversionData.value = value;
    conversionData.currency = currency;
  }

  if (transactionId) {
    conversionData.transaction_id = transactionId;
  }

  window.gtag?.('event', 'conversion', conversionData);
  console.log('[Google Ads] Conversion tracked:', conversionLabel, conversionData);
};

/**
 * Track Purchase Conversion
 */
export const trackPurchase = (
  orderId: string,
  totalValue: number,
  currency: string = 'INR'
): void => {
  trackConversion(
    GOOGLE_ADS_CONFIG.conversionLabels.purchase,
    totalValue,
    currency,
    orderId
  );
};

/**
 * Track Add to Cart Event
 */
export const trackAddToCart = (
  productId: string | number,
  productName: string,
  value: number,
  currency: string = 'INR'
): void => {
  if (!isGoogleAdsAvailable()) return;

  // Standard GA4 add_to_cart event
  window.gtag?.('event', 'add_to_cart', {
    currency,
    value,
    items: [{
      item_id: productId,
      item_name: productName,
      price: value,
      quantity: 1,
    }],
  });

  // Google Ads conversion (if label exists)
  if (GOOGLE_ADS_CONFIG.conversionLabels.addToCart) {
    trackConversion(GOOGLE_ADS_CONFIG.conversionLabels.addToCart, value, currency);
  }
};

/**
 * Track Checkout Started
 */
export const trackBeginCheckout = (
  cartItems: Array<{ id: string | number; name: string; price: number; quantity: number }>,
  totalValue: number,
  currency: string = 'INR'
): void => {
  if (!isGoogleAdsAvailable()) return;

  window.gtag?.('event', 'begin_checkout', {
    currency,
    value: totalValue,
    items: cartItems.map(item => ({
      item_id: item.id,
      item_name: item.name,
      price: item.price,
      quantity: item.quantity,
    })),
  });

  if (GOOGLE_ADS_CONFIG.conversionLabels.beginCheckout) {
    trackConversion(GOOGLE_ADS_CONFIG.conversionLabels.beginCheckout, totalValue, currency);
  }
};

/**
 * Track User Signup
 */
export const trackSignup = (method: string = 'email'): void => {
  if (!isGoogleAdsAvailable()) return;

  window.gtag?.('event', 'sign_up', {
    method,
  });

  if (GOOGLE_ADS_CONFIG.conversionLabels.signup) {
    trackConversion(GOOGLE_ADS_CONFIG.conversionLabels.signup);
  }
};

/**
 * Track Lead Form Submission
 */
export const trackLeadFormSubmission = (formType: string = 'contact'): void => {
  if (!isGoogleAdsAvailable()) return;

  window.gtag?.('event', 'generate_lead', {
    form_type: formType,
  });

  if (GOOGLE_ADS_CONFIG.conversionLabels.leadForm) {
    trackConversion(GOOGLE_ADS_CONFIG.conversionLabels.leadForm);
  }
};

/**
 * Track Product View
 */
export const trackProductView = (
  productId: string | number,
  productName: string,
  category: string,
  price: number,
  currency: string = 'INR'
): void => {
  if (!isGoogleAdsAvailable()) return;

  window.gtag?.('event', 'view_item', {
    currency,
    value: price,
    items: [{
      item_id: productId,
      item_name: productName,
      item_category: category,
      price,
    }],
  });
};

/**
 * Set User Properties for remarketing
 */
export const setUserProperties = (properties: {
  customerId?: string;
  customerType?: 'new' | 'returning';
  lifetime_value?: number;
}): void => {
  if (!isGoogleAdsAvailable()) return;

  window.gtag?.('set', 'user_properties', properties);
};

/**
 * Enhanced Remarketing - Dynamic Remarketing Parameters
 */
export const trackDynamicRemarketing = (
  eventType: 'view_item' | 'add_to_cart' | 'purchase',
  items: Array<{
    id: string | number;
    google_business_vertical: 'retail';
  }>
): void => {
  if (!isGoogleAdsAvailable()) return;

  window.gtag?.('event', eventType, {
    send_to: GOOGLE_ADS_CONFIG.conversionId,
    items,
  });
};
