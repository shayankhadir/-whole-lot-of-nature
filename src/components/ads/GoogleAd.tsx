'use client';

import { useEffect } from 'react';

interface GoogleAdProps {
  /**
   * Ad slot ID from Google AdSense
   */
  slot: string;
  /**
   * Ad format type
   */
  format?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal';
  /**
   * Enable responsive sizing
   */
  responsive?: boolean;
  /**
   * Custom styles for the ad container
   */
  style?: React.CSSProperties;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Layout key for multiplex ads
   */
  layoutKey?: string;
}

/**
 * Google AdSense Ad Component
 * 
 * @example
 * ```tsx
 * // Display ad in sidebar
 * <GoogleAd slot="1234567890" format="vertical" />
 * 
 * // Responsive banner ad
 * <GoogleAd 
 *   slot="9876543210" 
 *   format="horizontal"
 *   className="my-8"
 * />
 * ```
 */
export default function GoogleAd({ 
  slot, 
  format = 'auto', 
  responsive = true,
  style = { display: 'block' },
  className = '',
  layoutKey
}: GoogleAdProps) {
  useEffect(() => {
    try {
      // Push ad to AdSense queue
      // @ts-ignore - AdSense global
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  // Don't render if AdSense ID is not configured
  if (!process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID) {
    return null;
  }

  return (
    <ins
      className={`adsbygoogle ${className}`}
      style={style}
      data-ad-client={process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive.toString()}
      {...(layoutKey && { 'data-ad-layout-key': layoutKey })}
    />
  );
}

/**
 * Pre-configured ad components for common placements
 */

export function SidebarAd({ className = '' }: { className?: string }) {
  return (
    <div className={`rounded-lg overflow-hidden ${className}`}>
      <p className="text-xs text-gray-500 mb-2 text-center">Advertisement</p>
      <GoogleAd 
        slot="sidebar-ad-slot" 
        format="vertical"
        style={{ display: 'block', minHeight: '600px' }}
        className="bg-gray-50"
      />
    </div>
  );
}

export function BannerAd({ className = '' }: { className?: string }) {
  return (
    <div className={`my-8 rounded-lg overflow-hidden ${className}`}>
      <p className="text-xs text-gray-500 mb-2 text-center">Advertisement</p>
      <GoogleAd 
        slot="banner-ad-slot" 
        format="horizontal"
        style={{ display: 'block', minHeight: '90px' }}
        className="bg-gray-50"
      />
    </div>
  );
}

export function InFeedAd({ className = '' }: { className?: string }) {
  return (
    <div className={`my-6 rounded-lg overflow-hidden ${className}`}>
      <p className="text-xs text-gray-500 mb-2">Sponsored</p>
      <GoogleAd 
        slot="infeed-ad-slot" 
        format="fluid"
        layoutKey="-6t+ed+2i-1n-4w"
        className="bg-gray-50 min-h-[250px]"
      />
    </div>
  );
}
