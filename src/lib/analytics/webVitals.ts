/**
 * Web Vitals Tracking - Core Web Vitals for Performance Monitoring
 * Tracks LCP, FID, CLS, FCP, TTFB and sends to analytics
 */

type MetricName = 'CLS' | 'FCP' | 'INP' | 'LCP' | 'TTFB';

interface WebVitalsMetric {
  name: MetricName;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
  navigationType: string;
}

// Thresholds for Core Web Vitals (in milliseconds except CLS)
const THRESHOLDS: Record<MetricName, { good: number; needsImprovement: number }> = {
  LCP: { good: 2500, needsImprovement: 4000 },      // Largest Contentful Paint
  CLS: { good: 0.1, needsImprovement: 0.25 },       // Cumulative Layout Shift
  FCP: { good: 1800, needsImprovement: 3000 },      // First Contentful Paint
  TTFB: { good: 800, needsImprovement: 1800 },      // Time to First Byte
  INP: { good: 200, needsImprovement: 500 },        // Interaction to Next Paint
};

/**
 * Get performance rating based on thresholds
 */
function getRating(name: MetricName, value: number): 'good' | 'needs-improvement' | 'poor' {
  const threshold = THRESHOLDS[name];
  if (value <= threshold.good) return 'good';
  if (value <= threshold.needsImprovement) return 'needs-improvement';
  return 'poor';
}

/**
 * Send metric to Google Analytics 4
 */
function sendToGA4(metric: WebVitalsMetric): void {
  if (typeof window === 'undefined') return;
  
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
  
  if (gtag) {
    gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      metric_rating: metric.rating,
      metric_delta: Math.round(metric.delta),
      non_interaction: true,
    });
  }
}

/**
 * Log metric to console in development
 */
function logMetric(metric: WebVitalsMetric): void {
  if (process.env.NODE_ENV === 'development') {
    const color = metric.rating === 'good' ? '🟢' : metric.rating === 'needs-improvement' ? '🟡' : '🔴';
    console.log(
      `${color} ${metric.name}: ${metric.value.toFixed(2)} (${metric.rating})`
    );
  }
}

/**
 * Handle individual metric report
 */
function handleMetric(metric: WebVitalsMetric): void {
  // Add rating to metric
  const enhancedMetric: WebVitalsMetric = {
    ...metric,
    rating: getRating(metric.name, metric.value),
  };
  
  // Log in development
  logMetric(enhancedMetric);
  
  // Send to Google Analytics
  sendToGA4(enhancedMetric);
}

/**
 * Initialize Web Vitals tracking
 * Call this in your app/layout.tsx or a client component
 */
export async function initWebVitals(): Promise<void> {
  if (typeof window === 'undefined') return;
  
  try {
    // Dynamic import to reduce initial bundle size
    // Note: FID was replaced by INP in web-vitals v4
    const { onCLS, onFCP, onINP, onLCP, onTTFB } = await import('web-vitals');
    
    // Register handlers for each metric
    onCLS((metric) => handleMetric(metric as WebVitalsMetric));
    onFCP((metric) => handleMetric(metric as WebVitalsMetric));
    onINP((metric) => handleMetric(metric as WebVitalsMetric));
    onLCP((metric) => handleMetric(metric as WebVitalsMetric));
    onTTFB((metric) => handleMetric(metric as WebVitalsMetric));
    
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Web Vitals tracking initialized');
    }
  } catch (error) {
    console.error('Failed to load web-vitals:', error);
  }
}

/**
 * React hook to initialize Web Vitals tracking
 */
export function useWebVitals(): void {
  if (typeof window !== 'undefined') {
    // Initialize once on mount
    initWebVitals();
  }
}

/**
 * Get performance summary (useful for debugging)
 */
export function getPerformanceSummary(): Record<string, number> | null {
  if (typeof window === 'undefined' || !window.performance) return null;
  
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  const paint = performance.getEntriesByType('paint');
  
  const fcp = paint.find(entry => entry.name === 'first-contentful-paint');
  
  return {
    domContentLoaded: navigation?.domContentLoadedEventEnd - navigation?.startTime || 0,
    loadComplete: navigation?.loadEventEnd - navigation?.startTime || 0,
    firstContentfulPaint: fcp?.startTime || 0,
    timeToFirstByte: navigation?.responseStart - navigation?.requestStart || 0,
  };
}
