import DepositItem from '../components/DepositItem';

const DepositsPage = () => {
  const deposits = [
    { date: '2023-10-01', amount: 10.5, txHash: 'abc123' },
    { date: '2023-10-02', amount: 5.0, txHash: 'def456' },
    { date: '2023-10-03', amount: 7.25, txHash: 'ghi789' },
  ]; // Example data

  return (
    <div className="deposits-page flex flex-col h-full bg-white dark:bg-gray-900 sm:p-4 md:p-6 lg:p-8">
      <header className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center">
          <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center">C</div>
          <span className="ml-2 text-lg font-semibold">Deposit History</span>
        </div>
      </header>
      <div className="flex-grow overflow-y-auto p-2 sm:p-4 md:p-6 space-y-4 pb-32">
        {deposits.map((deposit, index) => (
          <DepositItem key={index} date={deposit.date} amount={deposit.amount} txHash={deposit.txHash} />
        ))}
      </div>
      <nav className="fixed bottom-0 w-full bg-white border-t flex justify-around p-2 z-10">
        <button className="flex flex-col items-center">
          <span>🔍</span>
          <span className="text-xs">Chat</span>
        </button>
        <button className="flex flex-col items-center">
          <span>📊</span>
          <span className="text-xs">Dashboard</span>
        </button>
        <button className="flex flex-col items-center">
          <span>📤</span>
          <span className="text-xs">Withdraw</span>
        </button>
        <button className="flex flex-col items-center text-blue-500">
          <span>🕒</span>
          <span className="text-xs">History</span>
        </button>
      </nav>
    </div>
  );
};

export default DepositsPage; 