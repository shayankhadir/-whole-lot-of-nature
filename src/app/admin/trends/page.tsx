import TrendAgentDashboard from '@/components/admin/TrendAgentDashboard';

export const metadata = {
  title: 'Trend Agent Admin - Whole Lot of Nature',
  description: 'Monitor and manage automated content generation',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPage() {
  return <TrendAgentDashboard />;
}
