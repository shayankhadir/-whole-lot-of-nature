import type { AccountOverview } from '@/lib/services/accountService';
import type { WooCommerceCustomer } from '@/lib/services/woocommerceService';
import Link from 'next/link';

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
    <section className="min-h-screen bg-[#030a06] px-4 py-12 text-white">
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_35px_120px_-60px_rgba(16,185,129,0.2)] backdrop-blur-md">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">Account Overview</p>
          <h1 className="mt-3 text-3xl font-bold text-white">
            {customer ? `Welcome back, ${customer.first_name || 'plant lover'}!` : 'Create your plant-loving profile'}
          </h1>
          <p className="mt-2 text-white/90">
            Signed in as <span className="font-medium text-white">{email}</span>. Manage orders, download invoices, and keep your addresses updated for smooth deliveries.
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
            <p className="text-sm text-emerald-400">Lifetime value</p>
            <p className="mt-2 text-3xl font-bold text-white">{currencyFormatter.format(stats.lifetimeValue || 0)}</p>
            <p className="mt-1 text-xs text-white/80">Across {stats.totalOrders} orders</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
            <p className="text-sm text-emerald-400">Active orders</p>
            <p className="mt-2 text-3xl font-bold text-white">{stats.activeOrders}</p>
            <p className="mt-1 text-xs text-white/80">Processing, packed, or ready to ship</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
            <p className="text-sm text-emerald-400">Last order</p>
            <p className="mt-2 text-3xl font-bold text-white">{stats.lastOrderDate ? dateFormatter.format(new Date(stats.lastOrderDate)) : '—'}</p>
            <p className="mt-1 text-xs text-white/80">Track from the timeline below</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Recent orders</h2>
              <Link href="/shop" className="text-sm font-semibold text-emerald-400 hover:text-emerald-300">Continue shopping →</Link>
            </div>

            {orders.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-dashed border-white/20 p-6 text-center text-white/80">
                <p>You have not placed any orders yet. Explore curated plant collections and soil mixes to get started.</p>
              </div>
            ) : (
              <ul className="mt-6 space-y-4">
                {orders.map((order) => (
                  <li key={order.id} className="rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-sm text-emerald-400">Order #{order.id}</p>
                        <p className="text-lg font-semibold text-white">
                          {currencyFormatter.format(Number(order.total))} · {order.line_items.map((item) => item.name).join(', ')}
                        </p>
                        <p className="text-xs text-white/80">
                          {dateFormatter.format(new Date(order.date_created))} · {order.payment_method_title || 'COD/UPI'}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="inline-flex items-center rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-300 border border-emerald-500/30">
                          {order.status.replace(/-/g, ' ')}
                        </span>
                        <div className="mt-3 text-sm text-white/80">
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
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
              <h3 className="text-lg font-semibold text-white">Billing address</h3>
              <p className="mt-2 text-sm text-white/90">{formatAddress(customer?.billing)}</p>
              <a href="/account" className="mt-4 inline-flex text-sm font-semibold text-emerald-400 hover:text-emerald-300">Update in WooCommerce →</a>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
              <h3 className="text-lg font-semibold text-white">Shipping address</h3>
              <p className="mt-2 text-sm text-white/90">{formatAddress(customer?.shipping)}</p>
              <p className="mt-4 text-xs text-emerald-400">Ensure the pin code is accurate for India Post tracking updates.</p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
