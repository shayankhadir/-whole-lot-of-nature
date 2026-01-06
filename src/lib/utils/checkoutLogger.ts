/**
 * Checkout Logger Utility
 * Provides structured logging for checkout flow debugging
 * Helps identify where customers are dropping off or encountering errors
 */

export type CheckoutStage = 
  | 'CART_VIEWED'
  | 'CHECKOUT_STARTED'
  | 'FORM_VALIDATION'
  | 'ORDER_CREATION'
  | 'PAYMENT_INITIATED'
  | 'PAYMENT_COMPLETED'
  | 'PAYMENT_FAILED'
  | 'ORDER_CONFIRMED'
  | 'WEBHOOK_RECEIVED';

export interface CheckoutLogEntry {
  timestamp: string;
  stage: CheckoutStage;
  success: boolean;
  orderId?: string;
  sessionId?: string;
  errorCode?: string;
  errorMessage?: string;
  context?: Record<string, any>;
  duration?: number;
}

// In-memory log for current session (client-side)
const sessionLogs: CheckoutLogEntry[] = [];

/**
 * Log a checkout event
 */
export function logCheckoutEvent(
  stage: CheckoutStage,
  success: boolean,
  context?: {
    orderId?: string;
    errorCode?: string;
    errorMessage?: string;
    duration?: number;
    [key: string]: any;
  }
): CheckoutLogEntry {
  const entry: CheckoutLogEntry = {
    timestamp: new Date().toISOString(),
    stage,
    success,
    sessionId: getSessionId(),
    ...context,
  };

  // Log to console with color coding
  const prefix = success ? '✅' : '❌';
  const color = success ? 'color: green' : 'color: red';
  
  if (typeof window !== 'undefined') {
    console.log(`%c${prefix} [CHECKOUT] ${stage}`, color, entry);
    sessionLogs.push(entry);
    
    // Store in localStorage for debugging (keep last 50 entries)
    try {
      const storedLogs = JSON.parse(localStorage.getItem('checkout_logs') || '[]');
      storedLogs.push(entry);
      if (storedLogs.length > 50) storedLogs.shift();
      localStorage.setItem('checkout_logs', JSON.stringify(storedLogs));
    } catch (e) {
      // localStorage might be full or disabled
    }
  } else {
    // Server-side logging
    console.log(`[CHECKOUT] ${stage} | Success: ${success}`, JSON.stringify(entry));
  }

  return entry;
}

/**
 * Log checkout success with timing
 */
export function logCheckoutSuccess(
  stage: CheckoutStage,
  data?: Record<string, any>,
  startTime?: number
) {
  const duration = startTime ? Date.now() - startTime : undefined;
  return logCheckoutEvent(stage, true, { ...data, duration });
}

/**
 * Log checkout error with details
 */
export function logCheckoutError(
  stage: CheckoutStage,
  error: Error | string | any,
  context?: Record<string, any>
) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorCode = error?.code || error?.response?.status || 'UNKNOWN';
  
  return logCheckoutEvent(stage, false, {
    errorCode,
    errorMessage,
    stack: error instanceof Error ? error.stack : undefined,
    ...context,
  });
}

/**
 * Get or create session ID for tracking
 */
function getSessionId(): string {
  if (typeof window === 'undefined') return 'server';
  
  let sessionId = sessionStorage.getItem('checkout_session_id');
  if (!sessionId) {
    sessionId = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('checkout_session_id', sessionId);
  }
  return sessionId;
}

/**
 * Get all logs from current session
 */
export function getSessionLogs(): CheckoutLogEntry[] {
  return [...sessionLogs];
}

/**
 * Get logs from localStorage (persists across page reloads)
 */
export function getStoredLogs(): CheckoutLogEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem('checkout_logs') || '[]');
  } catch {
    return [];
  }
}

/**
 * Clear stored logs
 */
export function clearStoredLogs(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('checkout_logs');
    sessionLogs.length = 0;
  }
}

/**
 * Get user-friendly error message for display
 */
export function getErrorMessage(errorCode: string | undefined, fallback: string = 'Something went wrong'): string {
  const errorMessages: Record<string, string> = {
    'NETWORK_ERROR': 'Network connection issue. Please check your internet and try again.',
    'PAYMENT_FAILED': 'Payment could not be processed. Please try again or use a different payment method.',
    'PAYMENT_CANCELLED': 'Payment was cancelled. Your order has been saved.',
    'PAYMENT_TIMEOUT': 'Payment timed out. Please try again.',
    'ORDER_CREATE_FAILED': 'Could not create your order. Please refresh and try again.',
    'INVALID_CART': 'Your cart has expired. Please add items again.',
    'INSUFFICIENT_STOCK': 'Some items in your cart are no longer available.',
    'SHIPPING_UNAVAILABLE': 'Shipping is not available to your location.',
    'VALIDATION_ERROR': 'Please check your information and try again.',
    'API_ERROR': 'Our system is temporarily unavailable. Please try again in a few minutes.',
    'RAZORPAY_FAILED': 'Payment gateway error. Please try again.',
    'CASHFREE_FAILED': 'Payment gateway error. Please try again.',
  };

  return errorMessages[errorCode || ''] || fallback;
}

/**
 * Send logs to server for analysis (optional)
 */
export async function sendLogsToServer(logs?: CheckoutLogEntry[]): Promise<void> {
  const logsToSend = logs || getStoredLogs();
  
  if (logsToSend.length === 0) return;
  
  try {
    await fetch('/api/analytics/checkout-logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ logs: logsToSend }),
    });
  } catch (error) {
    console.error('Failed to send checkout logs:', error);
  }
}

export default {
  logCheckoutEvent,
  logCheckoutSuccess,
  logCheckoutError,
  getSessionLogs,
  getStoredLogs,
  clearStoredLogs,
  getErrorMessage,
  sendLogsToServer,
};
