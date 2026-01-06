import crypto from 'crypto';

interface CreateOrderRequest {
  orderId: string;
  orderAmount: number;
  orderCurrency: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  returnUrl: string;
}

interface CashfreeConfig {
  appId: string;
  secretKey: string;
  env: 'sandbox' | 'production';
}

export class CashfreeService {
  private config: CashfreeConfig;
  private baseUrl: string;

  constructor() {
    this.config = {
      appId: process.env.CASHFREE_APP_ID || '',
      secretKey: process.env.CASHFREE_SECRET_KEY || '',
      env: (process.env.CASHFREE_MODE as 'sandbox' | 'production') || 'sandbox',
    };

    this.baseUrl = this.config.env === 'production'
      ? 'https://api.cashfree.com/pg'
      : 'https://sandbox.cashfree.com/pg';
  }

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      'x-api-version': '2023-08-01',
      'x-client-id': this.config.appId,
      'x-client-secret': this.config.secretKey,
    };
  }

  async createOrder(data: CreateOrderRequest) {
    try {
      const payload = {
        order_id: data.orderId,
        order_amount: data.orderAmount,
        order_currency: data.orderCurrency,
        customer_details: {
          customer_id: data.customerPhone, // Using phone as customer ID
          customer_name: data.customerName,
          customer_email: data.customerEmail,
          customer_phone: data.customerPhone,
        },
        order_meta: {
          return_url: data.returnUrl,
        },
      };

      const response = await fetch(`${this.baseUrl}/orders`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create order');
      }

      return result;
    } catch (error) {
      console.error('Cashfree Create Order Error:', error);
      throw error;
    }
  }

  async getOrderStatus(orderId: string) {
    try {
      const response = await fetch(`${this.baseUrl}/orders/${orderId}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch order status');
      }

      return result;
    } catch (error) {
      console.error('Cashfree Get Status Error:', error);
      throw error;
    }
  }

  verifySignature(rawBody: string, signature: string, timestamp: string): boolean {
    // Cashfree webhook signature verification
    // Uses HMAC-SHA256 with the raw body and timestamp
    
    if (!signature || !timestamp) {
      console.error('Missing signature or timestamp for webhook verification');
      return false;
    }

    try {
      // Cashfree signature format: timestamp + rawBody
      const signedPayload = timestamp + rawBody;
      
      const generatedSignature = crypto
        .createHmac('sha256', this.config.secretKey)
        .update(signedPayload)
        .digest('base64');
      
      // Constant-time comparison to prevent timing attacks
      const isValid = crypto.timingSafeEqual(
        Buffer.from(generatedSignature),
        Buffer.from(signature)
      );
      
      if (!isValid) {
        console.error('Webhook signature verification failed');
      }
      
      return isValid;
    } catch (error) {
      console.error('Signature verification error:', error);
      return false;
    }
  }

  // Fallback for legacy signature format (if needed)
  verifySignatureLegacy(payload: any, signature: string): boolean {
    if (!signature) return false;
    
    try {
      const generatedSignature = crypto
        .createHmac('sha256', this.config.secretKey)
        .update(JSON.stringify(payload))
        .digest('base64');
      
      return generatedSignature === signature;
    } catch (error) {
      console.error('Legacy signature verification error:', error);
      return false;
    }
  }
}

export const cashfreeService = new CashfreeService();
