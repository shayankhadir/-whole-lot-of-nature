import { NextRequest, NextResponse } from 'next/server';
import { woocommerceClient as woocommerce } from '@/lib/services/woocommerceService';

type WCCoupon = {
  id: number;
  code: string;
  amount: string; // WooCommerce returns amounts as strings
  discount_type: 'percent' | 'fixed_cart' | 'fixed_product' | string;
  date_expires?: string | null;
};

export async function POST(req: NextRequest) {
  try {
    const { code, subtotal } = await req.json();
    if (!code) return NextResponse.json({ valid: false, message: 'Coupon code required' }, { status: 400 });

    // Fetch coupon by code
  const res = await woocommerce.get('coupons', { code });
  const raw: unknown = res.data;
  const coupons = Array.isArray(raw) ? (raw as WCCoupon[]) : [];
    if (!Array.isArray(coupons) || coupons.length === 0) {
      return NextResponse.json({ valid: false, message: 'Coupon not found' });
    }

  const coupon = coupons[0];
    // Basic validation: check date and usage limits if present
    const now = new Date();
    if (coupon.date_expires) {
      const exp = new Date(coupon.date_expires);
      if (now > exp) return NextResponse.json({ valid: false, message: 'Coupon expired' });
    }

    // Compute discount based on type
    const sub = typeof subtotal === 'number' ? subtotal : 0;
    let discountAmount = 0;
    switch (coupon.discount_type) {
      case 'percent':
        discountAmount = Math.round((Number(coupon.amount) / 100) * sub);
        break;
      case 'fixed_cart':
        discountAmount = Math.round(Number(coupon.amount));
        break;
      default:
        discountAmount = 0;
    }

    if (discountAmount <= 0) {
      return NextResponse.json({ valid: false, message: 'Coupon does not apply' });
    }

    return NextResponse.json({ valid: true, discount: discountAmount, type: coupon.discount_type });
  } catch (err: unknown) {
    const e = err as { response?: { data?: unknown }; message?: string };
    console.error('Coupon validate error', e?.response?.data || e?.message || e);
    return NextResponse.json({ valid: false, message: 'Validation error' }, { status: 500 });
  }
}
