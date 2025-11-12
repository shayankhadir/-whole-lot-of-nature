'use client';

import { useRouter } from 'next/navigation';

/**
 * Hook for route transitions - simplified without loading screen
 * Usage: Add useRouteLoading() in any component that triggers navigation
 */
export function useRouteLoading() {
  const router = useRouter();

  // Create a wrapped push function
  const pushWithLoading = (href: string, message?: string) => {
    router.push(href);
  };

  return { pushWithLoading };
}
