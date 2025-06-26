import { DashboardSummary } from '../components/DashboardSummary';
import { PageHeader } from '../components/PageHeader';

export function Dashboard() {
  return (
    <div>
      <PageHeader title="Dashboard" />
      <DashboardSummary />
    </div>
  );
}