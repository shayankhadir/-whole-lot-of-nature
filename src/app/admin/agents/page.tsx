/**
 * Agent Command Center Page
 * Admin route for managing all marketing agents
 */

import AgentDashboard from '@/components/admin/AgentDashboard';

export const metadata = {
  title: 'Agent Command Center | Whole Lot of Nature Admin',
  description: 'Manage marketing automation agents for SEO, lead generation, and growth',
};

export default function AgentCommandCenterPage() {
  return <AgentDashboard />;
}
