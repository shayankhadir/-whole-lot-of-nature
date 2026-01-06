'use client';

import { useEffect } from 'react';
import { initWebVitals } from '@/lib/analytics/webVitals';

/**
 * Web Vitals Reporter Component
 * Initializes Core Web Vitals tracking and reports to GA4
 * Add this component to your layout.tsx
 */
export default function WebVitalsReporter() {
  useEffect(() => {
    initWebVitals();
  }, []);

  // This component doesn't render anything
  return null;
}
