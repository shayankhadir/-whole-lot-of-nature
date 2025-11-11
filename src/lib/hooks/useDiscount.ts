'use client';

import { useMemo } from 'react';
import { calculateDiscount, PriceDetails } from '@/lib/utils/priceUtils';

interface UseDiscountProps {
  regularPrice?: string | number;
  salePrice?: string | number;
}

/**
 * Hook to calculate and manage product discount details
 */
export function useDiscount({
  regularPrice,
  salePrice,
}: UseDiscountProps): PriceDetails {
  return useMemo(() => {
    return calculateDiscount(regularPrice, salePrice);
  }, [regularPrice, salePrice]);
}
