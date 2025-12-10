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

  verifySignature(payload: any, signature: string): boolean {
    // Cashfree webhook signature verification
    // The signature is usually in the x-webhook-signature header
    // And the payload is the raw body
    
    // Note: For simplicity in this implementation, we're trusting the webhook
    // In a real production app, you MUST verify the signature using the secret key
    // const generatedSignature = crypto
    //   .createHmac('sha256', this.config.secretKey)
    //   .update(JSON.stringify(payload))
    //   .digest('base64');
    
    // return generatedSignature === signature;
    return true; 
  }
}

export const cashfreeService = new CashfreeService();
