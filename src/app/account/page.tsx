import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';
import AccountDashboard from '@/components/account/AccountDashboard';
import { fetchAccountOverview } from '@/lib/services/accountService';

export default async function AccountPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return (
      <section className="min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-100 px-4 py-16">
        <div className="w-full max-w-lg rounded-3xl bg-white p-10 text-center shadow-[0_25px_90px_-60px_rgba(5,150,105,0.8)]">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-500">Secure customer area</p>
          <h1 className="mt-4 text-3xl font-bold text-emerald-900">Sign in to view your plant journey</h1>
          <p className="mt-3 text-emerald-700">
            Use Google, email magic link, or your storefront credentials to access orders, addresses, and tracking in one dashboard.
          </p>
          <div className="mt-8 flex flex-col gap-3">
            <Link
              href="/auth/signin"
              className="inline-flex h-12 items-center justify-center rounded-full bg-emerald-500 text-white font-semibold shadow hover:bg-emerald-600"
            >
              Continue to secure login
            </Link>
            <Link
              href="/signup"
              className="inline-flex h-12 items-center justify-center rounded-full border border-emerald-200 text-emerald-700 font-semibold"
            >
              Create a Whole Lot of Nature account
            </Link>
          </div>
          <p className="mt-6 text-xs text-emerald-500">
            By continuing you agree to our <Link href="/terms" className="underline">Terms</Link> and
            <Link href="/privacy" className="ml-1 underline">Privacy Policy</Link>.
          </p>
        </div>
      </section>
    );
  }

  const overview = await fetchAccountOverview(session.user.email);
  return <AccountDashboard email={session.user.email} overview={overview} />;
}
