/**
 * Coupon Service - Handle coupon validation and application
 * Integrates with WooCommerce REST API v2
 */

import { woocommerceClient } from './woocommerceService';

export interface CouponDetails {
  code: string;
  discount_type: 'percent' | 'fixed_cart' | 'fixed_product' | 'free_shipping';
  amount: number;
  description?: string;
  expiry_date?: string;
  usage_limit?: number;
  usage_count?: number;
  minimum_amount?: number;
  maximum_amount?: number;
  product_ids?: number[];
  excluded_product_ids?: number[];
  usage_limit_per_user?: number;
}

export interface CouponValidationResult {
  valid: boolean;
  coupon: CouponDetails | null;
  error?: string;
  message: string;
}

export interface CouponApplicationResult {
  applied: boolean;
  coupon: CouponDetails | null;
  discountAmount: number;
  discountPercentage?: number;
  message: string;
  error?: string;
}

interface WooCommerceCoupon {
  code: string;
  discount_type: 'percent' | 'fixed_cart' | 'fixed_product' | 'free_shipping';
  amount: string;
  description: string;
  date_expires: string | null;
  usage_limit: number | null;
  usage_count: number;
  minimum_amount: string;
  maximum_amount: string;
  product_ids: number[];
  excluded_product_ids: number[];
  usage_limit_per_user: number | null;
}

export class CouponService {
  /**
   * Validate coupon code against WooCommerce
   */
  static async validateCoupon(code: string): Promise<CouponValidationResult> {
    try {
      if (!code || code.trim().length === 0) {
        return {
          valid: false,
          coupon: null,
          error: 'EMPTY_CODE',
          message: 'Please enter a coupon code',
        };
      }

      const response = await woocommerceClient.get(`coupons`, {
        search: code,
        status: 'publish',
      });

      const coupons = Array.isArray(response.data) ? (response.data as WooCommerceCoupon[]) : [];
      const coupon = coupons.find(
        (c) => c.code.toLowerCase() === code.toLowerCase()
      );

      if (!coupon) {
        return {
          valid: false,
          coupon: null,
          error: 'COUPON_NOT_FOUND',
          message: `Coupon code "${code}" not found or is invalid`,
        };
      }

      // Check if coupon is expired
      if (coupon.date_expires && new Date(coupon.date_expires) < new Date()) {
        return {
          valid: false,
          coupon: null,
          error: 'COUPON_EXPIRED',
          message: 'This coupon has expired',
        };
      }

      // Check usage limit
      if (
        coupon.usage_limit &&
        coupon.usage_count >= coupon.usage_limit
      ) {
        return {
          valid: false,
          coupon: null,
          error: 'COUPON_USAGE_LIMIT_EXCEEDED',
          message: 'This coupon has reached its usage limit',
        };
      }

      const couponDetails: CouponDetails = {
        code: coupon.code,
        discount_type: coupon.discount_type,
        amount: parseFloat(coupon.amount || '0'),
        description: coupon.description,
        expiry_date: coupon.date_expires ?? undefined,
        usage_limit: coupon.usage_limit ?? undefined,
        usage_count: coupon.usage_count ?? 0,
        minimum_amount: coupon.minimum_amount ? parseFloat(coupon.minimum_amount) : undefined,
        maximum_amount: coupon.maximum_amount ? parseFloat(coupon.maximum_amount) : undefined,
        product_ids: coupon.product_ids,
        excluded_product_ids: coupon.excluded_product_ids,
        usage_limit_per_user: coupon.usage_limit_per_user ?? undefined,
      };

      return {
        valid: true,
        coupon: couponDetails,
        message: `Coupon "${code}" is valid`,
      };
    } catch (error) {
      console.error('Error validating coupon:', error);
      return {
        valid: false,
        coupon: null,
        error: 'VALIDATION_ERROR',
        message: 'Unable to validate coupon. Please try again.',
      };
    }
  }

  /**
   * Apply coupon to cart
   */
  static async applyCoupon(
    code: string,
    cartTotal: number
  ): Promise<CouponApplicationResult> {
    try {
      const validation = await this.validateCoupon(code);

      if (!validation.valid || !validation.coupon) {
        return {
          applied: false,
          coupon: null,
          discountAmount: 0,
          message: validation.message,
          error: validation.error,
        };
      }

      const coupon = validation.coupon;

      // Check minimum amount requirement
      if (coupon.minimum_amount && cartTotal < coupon.minimum_amount) {
        return {
          applied: false,
          coupon: null,
          discountAmount: 0,
          message: `Minimum order amount of ₹${coupon.minimum_amount} required`,
          error: 'MINIMUM_AMOUNT_NOT_MET',
        };
      }

      // Check maximum amount limit
      if (coupon.maximum_amount && cartTotal > coupon.maximum_amount) {
        return {
          applied: false,
          coupon: null,
          discountAmount: 0,
          message: `Order exceeds maximum eligible amount of ₹${coupon.maximum_amount}`,
          error: 'MAXIMUM_AMOUNT_EXCEEDED',
        };
      }

      // Calculate discount
      let discountAmount = 0;
      let discountPercentage = 0;

      if (coupon.discount_type === 'percent') {
        discountPercentage = coupon.amount;
        discountAmount = (cartTotal * coupon.amount) / 100;
      } else if (coupon.discount_type === 'fixed_cart') {
        discountAmount = Math.min(coupon.amount, cartTotal);
      }

      return {
        applied: true,
        coupon: coupon,
        discountAmount: Math.round(discountAmount * 100) / 100,
        discountPercentage: discountPercentage,
        message: `${coupon.description || `Coupon "${code}"`} applied successfully!`,
      };
    } catch (error) {
      console.error('Error applying coupon:', error);
      return {
        applied: false,
        coupon: null,
        discountAmount: 0,
        message: 'Failed to apply coupon',
        error: 'APPLICATION_ERROR',
      };
    }
  }

  /**
   * Get all active coupons (for promotional display)
   */
  static async getActiveCoupons(): Promise<CouponDetails[]> {
    try {
      const response = await woocommerceClient.get('coupons', {
        status: 'publish',
        per_page: 50,
      });

      const coupons = Array.isArray(response.data) ? (response.data as WooCommerceCoupon[]) : [];

      return coupons
        .filter((coupon) => {
          // Filter out expired coupons
          if (coupon.date_expires && new Date(coupon.date_expires) < new Date()) {
            return false;
          }
          // Filter out usage-limit-exceeded coupons
          if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) {
            return false;
          }
          return true;
        })
        .map((coupon: WooCommerceCoupon) => ({
          code: coupon.code,
          discount_type: coupon.discount_type,
          amount: parseFloat(coupon.amount || '0'),
          description: coupon.description,
        }));
    } catch (error) {
      console.error('Error fetching active coupons:', error);
      return [];
    }
  }
}
