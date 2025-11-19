import TrendAgentDashboard from '@/components/admin/TrendAgentDashboard';
import { buildPageMetadata } from '@/lib/seo/pageMetadata';

export const metadata = buildPageMetadata({
  title: 'Trend Agent Admin Dashboard | Whole Lot of Nature',
  description: 'Monitor automated content generation runs, review success metrics, and launch marketing workflows.',
  path: '/admin/trends',
  robots: {
    index: false,
    follow: false,
  },
});

export default function AdminPage() {
  return (
    <>
      <h1 className="sr-only">Trend Agent Admin Dashboard</h1>
      <TrendAgentDashboard />
    </>
  );
}
