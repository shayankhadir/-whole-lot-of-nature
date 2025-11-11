'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLoading } from '@/context/LoadingContext';

/**
 * Hook to automatically show loading screen on route transitions
 * Usage: Add useRouteLoading() in any component that triggers navigation
 */
export function useRouteLoading() {
  const router = useRouter();
  const { startLoading, stopLoading } = useLoading();

  // Create a wrapped push function that shows loading screen
  const pushWithLoading = (href: string, message?: string) => {
    startLoading(message || 'Loading your garden...');
    
    // Simulate network delay for demo purposes
    const loadingDuration = Math.random() * 1500 + 800;
    
    setTimeout(() => {
      router.push(href);
      
      // Stop loading after a brief moment to show completion animation
      setTimeout(() => {
        stopLoading();
      }, 500);
    }, loadingDuration);
  };

  return { pushWithLoading, startLoading, stopLoading };
}
