import { ChatIcon, CurrencyDollarIcon, ChartBarIcon } from '@heroicons/react/outline';
import StatCard from '../components/StatCard';

const DashboardPage = () => {
  return (
    <div className="dashboard-page flex flex-col h-full bg-white dark:bg-gray-900 sm:p-4 md:p-6 lg:p-8">
      <header className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center">
          <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center">C</div>
          <span className="ml-2 text-lg font-semibold">Convoai</span>
        </div>
      </header>
      <div className="flex-grow p-2 sm:p-4 md:p-6 space-y-4 overflow-y-auto pb-32">
        <div className="grid grid-cols-1 gap-4">
          <StatCard title="Total Chats" value={123} icon={ChatIcon} />
          <StatCard title="Total TON Earned" value={45.67} icon={CurrencyDollarIcon} />
          <StatCard title="Available TON" value={12.34} icon={ChartBarIcon} />
        </div>
      </div>
      <nav className="fixed bottom-0 w-full bg-white border-t flex justify-around p-2 z-10">
        <button className="flex flex-col items-center">
          <span>🔍</span>
          <span className="text-xs">Chat</span>
        </button>
        <button className="flex flex-col items-center text-blue-500">
          <span>📊</span>
          <span className="text-xs">Dashboard</span>
        </button>
        <button className="flex flex-col items-center">
          <span>📤</span>
          <span className="text-xs">Withdraw</span>
        </button>
        <button className="flex flex-col items-center">
          <span>🕒</span>
          <span className="text-xs">History</span>
        </button>
      </nav>
    </div>
  );
};

export default DashboardPage; 