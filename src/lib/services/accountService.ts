import { WooCommerceService, type WooCommerceCustomer, type WooCommerceOrder } from '@/lib/services/woocommerceService';

export interface AccountOverview {
  customer: WooCommerceCustomer | null;
  orders: WooCommerceOrder[];
  stats: {
    totalOrders: number;
    lifetimeValue: number;
    activeOrders: number;
    lastOrderDate?: string;
  };
}

function calculateStats(customer: WooCommerceCustomer | null, orders: WooCommerceOrder[]): AccountOverview['stats'] {
  const totalOrders = customer?.orders_count ?? orders.length;
  const lifetimeValue = customer?.total_spent ? Number(customer.total_spent) : orders.reduce((sum, order) => sum + Number(order.total), 0);
  const activeOrders = orders.filter((order) => ['processing', 'on-hold', 'pending'].includes(order.status)).length;
  const lastOrderDate = orders[0]?.date_created;

  return {
    totalOrders,
    lifetimeValue,
    activeOrders,
    lastOrderDate,
  };
}

export async function fetchAccountOverview(email: string): Promise<AccountOverview> {
  const customer = await WooCommerceService.getCustomerByEmail(email);
  const orders = customer ? await WooCommerceService.getOrdersForCustomer(customer.id, 6) : [];

  return {
    customer,
    orders,
    stats: calculateStats(customer, orders),
  };
}
