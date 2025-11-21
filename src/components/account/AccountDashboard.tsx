import type { AccountOverview } from '@/lib/services/accountService';
import type { WooCommerceCustomer } from '@/lib/services/woocommerceService';

interface AccountDashboardProps {
  email: string;
  overview: AccountOverview;
}

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' });

function formatAddress(address?: WooCommerceCustomer['billing']) {
  if (!address) return 'Update your address to unlock faster shipping.';
  const lines = [address.address_1, address.address_2, address.city, address.state, address.postcode].filter(Boolean);
  return lines.length ? lines.join(', ') : 'Add your address details from the Account settings.';
}

export default function AccountDashboard({ email, overview }: AccountDashboardProps) {
  const { customer, orders, stats } = overview;

  return (
    <section className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100 px-4 py-12">
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="rounded-3xl border border-emerald-100 bg-white/80 p-8 shadow-[0_35px_120px_-60px_rgba(16,185,129,0.8)]">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-500">Account Overview</p>
          <h1 className="mt-3 text-3xl font-bold text-emerald-900">
            {customer ? `Welcome back, ${customer.first_name || 'plant lover'}!` : 'Create your plant-loving profile'}
          </h1>
          <p className="mt-2 text-emerald-800">
            Signed in as <span className="font-medium">{email}</span>. Manage orders, download invoices, and keep your addresses updated for smooth deliveries.
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-emerald-100 bg-white p-5">
            <p className="text-sm text-emerald-500">Lifetime value</p>
            <p className="mt-2 text-3xl font-bold text-emerald-900">{currencyFormatter.format(stats.lifetimeValue || 0)}</p>
            <p className="mt-1 text-xs text-emerald-600">Across {stats.totalOrders} orders</p>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-white p-5">
            <p className="text-sm text-emerald-500">Active orders</p>
            <p className="mt-2 text-3xl font-bold text-emerald-900">{stats.activeOrders}</p>
            <p className="mt-1 text-xs text-emerald-600">Processing, packed, or ready to ship</p>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-white p-5">
            <p className="text-sm text-emerald-500">Last order</p>
            <p className="mt-2 text-3xl font-bold text-emerald-900">{stats.lastOrderDate ? dateFormatter.format(new Date(stats.lastOrderDate)) : '—'}</p>
            <p className="mt-1 text-xs text-emerald-600">Track from the timeline below</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="rounded-3xl border border-emerald-100 bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-emerald-900">Recent orders</h2>
              <a href="/shop" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700">Continue shopping →</a>
            </div>

            {orders.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-dashed border-emerald-200 p-6 text-center text-emerald-700">
                <p>You have not placed any orders yet. Explore curated plant collections and soil mixes to get started.</p>
              </div>
            ) : (
              <ul className="mt-6 space-y-4">
                {orders.map((order) => (
                  <li key={order.id} className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-sm text-emerald-600">Order #{order.id}</p>
                        <p className="text-lg font-semibold text-emerald-900">
                          {currencyFormatter.format(Number(order.total))} · {order.line_items.map((item) => item.name).join(', ')}
                        </p>
                        <p className="text-xs text-emerald-600">
                          {dateFormatter.format(new Date(order.date_created))} · {order.payment_method_title || 'COD/UPI'}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                          {order.status.replace(/-/g, ' ')}
                        </span>
                        <div className="mt-3 text-sm">
                          Shipping: {order.shipping_lines?.[0]?.method_title || 'Standard / Free'}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-emerald-100 bg-white p-6">
              <h3 className="text-lg font-semibold text-emerald-900">Billing address</h3>
              <p className="mt-2 text-sm text-emerald-700">{formatAddress(customer?.billing)}</p>
              <a href="/account" className="mt-4 inline-flex text-sm font-semibold text-emerald-600 hover:text-emerald-700">Update in WooCommerce →</a>
            </div>
            <div className="rounded-3xl border border-emerald-100 bg-white p-6">
              <h3 className="text-lg font-semibold text-emerald-900">Shipping address</h3>
              <p className="mt-2 text-sm text-emerald-700">{formatAddress(customer?.shipping)}</p>
              <p className="mt-4 text-xs text-emerald-500">Ensure the pin code is accurate for India Post tracking updates.</p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
