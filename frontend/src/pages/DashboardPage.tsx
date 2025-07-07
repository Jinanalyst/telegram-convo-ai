import { ChatIcon, CurrencyDollarIcon, ChartBarIcon } from '@heroicons/react/outline';
import StatCard from '../components/StatCard';

const DashboardPage = () => {
  return (
    <div className="dashboard-page p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
      <StatCard title="Total Chats" value={123} icon={ChatIcon} />
      <StatCard title="Total TON Earned" value={45.67} icon={CurrencyDollarIcon} />
      <StatCard title="Available TON" value={12.34} icon={ChartBarIcon} />
    </div>
  );
};

export default DashboardPage; 