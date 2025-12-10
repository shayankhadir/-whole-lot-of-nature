import { NextResponse } from 'next/server';
import { cashfreeService } from '@/lib/services/cashfreeService';

export async function GET(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const { orderId } = params;
    const status = await cashfreeService.getOrderStatus(orderId);
    return NextResponse.json({ success: true, data: status });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
