import { CartItem } from '@/stores/cartStore';

// Use local API proxy to avoid CORS issues with WooCommerce Store API
const CART_API_URL = '/api/cart';

const getHeaders = () => {
  return {
    'Content-Type': 'application/json',
  };
};

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || 'An error occurred');
  }
  return response.json();
};

export const cartService = {
  getCart: async () => {
    const response = await fetch(CART_API_URL, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });
    return handleResponse(response);
  },

  addItem: async (id: number, quantity: number = 1) => {
    const response = await fetch(`${CART_API_URL}?action=add-item`, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify({
        id: id,
        quantity: quantity,
      }),
    });
    return handleResponse(response);
  },

  removeItem: async (key: string) => {
    const response = await fetch(`${CART_API_URL}?action=remove-item`, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify({
        key: key,
      }),
    });
    return handleResponse(response);
  },

  updateItem: async (key: string, quantity: number) => {
    const response = await fetch(`${CART_API_URL}?action=update-item`, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify({
        key: key,
        quantity: quantity,
      }),
    });
    return handleResponse(response);
  },
  
  applyCoupon: async (code: string) => {
    const response = await fetch(`${CART_API_URL}?action=apply-coupon`, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify({
        code: code,
      }),
    });
    return handleResponse(response);
  },
  
  removeCoupon: async (code: string) => {
    const response = await fetch(`${CART_API_URL}?action=remove-coupon`, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify({
        code: code,
      }),
    });
    return handleResponse(response);
  },

  clearCart: async () => {
    const response = await fetch(CART_API_URL, {
      method: 'DELETE',
      headers: getHeaders(),
      credentials: 'include',
    });
    return handleResponse(response);
  }
};
