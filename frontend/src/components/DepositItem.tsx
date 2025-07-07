import React from 'react';

interface DepositItemProps {
  date: string;
  amount: number;
  txHash: string;
}

const DepositItem: React.FC<DepositItemProps> = ({ date, amount, txHash }) => {
  return (
    <div className="deposit-item flex justify-between items-center p-4 bg-bgSecondary rounded-xl shadow-md hover:bg-bgPrimary transition-colors duration-200">
      <div>
        <p className="text-sm text-textSecondary">{date}</p>
        <p className="text-lg font-bold text-textPrimary">{amount.toFixed(2)} TON</p>
      </div>
      <a href={`https://tonviewer.com/tx/${txHash}`} target="_blank" rel="noopener noreferrer" className="text-accent underline">
        View Tx
      </a>
    </div>
  );
};

export default DepositItem; 