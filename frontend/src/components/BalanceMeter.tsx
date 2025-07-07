import React from 'react';

interface BalanceMeterProps {
  amount: number;
}

const BalanceMeter: React.FC<BalanceMeterProps> = ({ amount }) => {
  return (
    <div className="balance-meter bg-bgSecondary p-4 rounded-xl shadow-md text-center">
      <h2 className="text-lg font-semibold text-textPrimary">Withdrawable Amount</h2>
      <p className="text-2xl font-bold text-accent">{amount.toFixed(2)} TON</p>
    </div>
  );
};

export default BalanceMeter; 