import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<any>;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon }) => {
  return (
    <div className="stat-card bg-bgSecondary p-4 rounded-xl shadow-md flex items-center space-x-4">
      <Icon className="w-8 h-8 text-accent" />
      <div>
        <h3 className="text-sm font-medium text-textSecondary">{title}</h3>
        <p className="text-xl font-bold text-textPrimary">{value}</p>
      </div>
    </div>
  );
};

export default StatCard; 