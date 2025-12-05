import type { Metadata } from 'next';
import TrendAgentDashboard from '@/components/admin/TrendAgentDashboard';

export const metadata: Metadata = {
  openGraph: {
    title: 'Admin | Whole Lot of Nature',
    description: 'Discover premium plants and gardening supplies at Whole Lot of Nature. Expert advice and quality products for your green space in Bangalore.',
    images: ['https://wholelotofnature.com/images/og-image.jpg'],
    url: 'https://wholelotofnature.com/admin',
  },
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
