import { CartItem } from '@/stores/cartStore';

const WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://wholelotofnature.com';
const STORE_API_URL = `${WORDPRESS_URL}/wp-json/wc/store/v1/cart`;

let nonce = '';

const getHeaders = () => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (nonce) {
    headers['X-WC-Store-API-Nonce'] = nonce;
  }
  return headers;
};

const handleResponse = async (response: Response) => {
  const newNonce = response.headers.get('X-WC-Store-API-Nonce');
  if (newNonce) {
    nonce = newNonce;
    // Optionally persist nonce to localStorage if needed, 
    // but the API usually handles session via cookies too.
    if (typeof window !== 'undefined') {
      localStorage.setItem('wc_store_api_nonce', newNonce);
    }
  }
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'An error occurred');
  }
  
  return response.json();
};

// Initialize nonce from storage if available
if (typeof window !== 'undefined') {
  nonce = localStorage.getItem('wc_store_api_nonce') || '';
}

export const cartService = {
  getCart: async () => {
    const response = await fetch(STORE_API_URL, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  addItem: async (id: number, quantity: number = 1) => {
    const response = await fetch(`${STORE_API_URL}/add-item`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        id: id,
        quantity: quantity,
      }),
    });
    return handleResponse(response);
  },

  removeItem: async (key: string) => {
    const response = await fetch(`${STORE_API_URL}/remove-item`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        key: key,
      }),
    });
    return handleResponse(response);
  },

  updateItem: async (key: string, quantity: number) => {
    const response = await fetch(`${STORE_API_URL}/update-item`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        key: key,
        quantity: quantity,
      }),
    });
    return handleResponse(response);
  },
  
  applyCoupon: async (code: string) => {
    const response = await fetch(`${STORE_API_URL}/apply-coupon`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        code: code,
      }),
    });
    return handleResponse(response);
  },
  
  removeCoupon: async (code: string) => {
    const response = await fetch(`${STORE_API_URL}/remove-coupon`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        code: code,
      }),
    });
    return handleResponse(response);
  }
};
