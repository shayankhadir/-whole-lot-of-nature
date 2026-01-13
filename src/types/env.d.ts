/**
 * Environment Variable Type Definitions
 * This file extends the ProcessEnv interface to include custom environment variables
 */

declare namespace NodeJS {
  interface ProcessEnv {
    // Node Environment
    NODE_ENV: 'development' | 'production' | 'test';
    
    // Site URLs
    NEXT_PUBLIC_SITE_URL?: string;
    NEXT_PUBLIC_API_URL?: string;
    
    // WordPress / WooCommerce
    WORDPRESS_URL?: string;
    WORDPRESS_API_URL?: string;
    NEXT_PUBLIC_WORDPRESS_URL?: string;
    WORDPRESS_SITE_URL?: string;
    WORDPRESS_USERNAME?: string;
    WORDPRESS_PASSWORD?: string;
    WORDPRESS_APP_PASSWORD?: string;
    
    // WooCommerce Keys
    WC_CONSUMER_KEY?: string;
    WC_CONSUMER_SECRET?: string;
    WOOCOMMERCE_CONSUMER_KEY?: string;
    WOOCOMMERCE_CONSUMER_SECRET?: string;
    NEXT_PUBLIC_WOOCOMMERCE_URL?: string;
    
    // Cashfree Payment Gateway
    CASHFREE_APP_ID?: string;
    CASHFREE_SECRET_KEY?: string;
    CASHFREE_MODE?: 'sandbox' | 'production';
    NEXT_PUBLIC_CASHFREE_MODE?: 'sandbox' | 'production';
    
    // Google Analytics & Ads
    NEXT_PUBLIC_GA_MEASUREMENT_ID?: string;
    NEXT_PUBLIC_GA_ID?: string;
    NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?: string;
    NEXT_PUBLIC_GOOGLE_ADS_ID?: string;
    
    // Facebook Pixel
    NEXT_PUBLIC_FB_PIXEL_ID?: string;
    
    // AI Services
    ANTHROPIC_API_KEY?: string;
    PERPLEXITY_API_KEY?: string;
    OPENAI_API_KEY?: string;
    
    // Email & Notifications
    RESEND_API_KEY?: string;
    ADMIN_EMAIL?: string;
    
    // Instagram
    INSTAGRAM_ACCESS_TOKEN?: string;
    INSTAGRAM_USER_ID?: string;
    NEXT_PUBLIC_INSTAGRAM_ACCESS_TOKEN?: string;
    NEXT_PUBLIC_INSTAGRAM_USER_ID?: string;
    
    // Admin & Security
    ADMIN_SECRET_KEY?: string;
    CRON_SECRET?: string;
    NEXTAUTH_SECRET?: string;
    NEXTAUTH_URL?: string;
    
    // Database
    DATABASE_URL?: string;
    
    // Agent Configuration
    AGENT_PUBLISH_STRATEGY?: 'draft' | 'scheduled' | 'immediate';
    
    // Buffer Social Media
    BUFFER_ACCESS_TOKEN?: string;
    BUFFER_PROFILE_ID?: string;
    
    // Search Engine
    NEXT_PUBLIC_ALGOLIA_APP_ID?: string;
    NEXT_PUBLIC_ALGOLIA_SEARCH_KEY?: string;
    ALGOLIA_ADMIN_KEY?: string;
  }
}

export {};
