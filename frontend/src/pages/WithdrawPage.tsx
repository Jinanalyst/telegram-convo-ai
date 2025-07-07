import { useState } from 'react';
import BalanceMeter from '../components/BalanceMeter';
import AddressInput from '../components/AddressInput';
import PrimaryButton from '../components/PrimaryButton';

const WithdrawPage = () => {
  const [address, setAddress] = useState('');
  const [amount] = useState(10.0); // Example amount

  const isValidAddress = (address: string) => {
    // Add logic to validate TON wallet address
    return address.length > 0; // Placeholder validation
  };

  const handleWithdraw = () => {
    if (isValidAddress(address)) {
      alert(`Withdrawal of ${amount} TON to ${address} was successful!`);
    } else {
      alert('Please enter a valid TON wallet address.');
    }
  };

  return (
    <div className="withdraw-page flex flex-col h-full bg-white dark:bg-gray-900 sm:p-4 md:p-6 lg:p-8">
      <header className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center">
          <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center">C</div>
          <span className="ml-2 text-lg font-semibold">Withdraw TON</span>
        </div>
      </header>
      <div className="flex-grow overflow-y-auto p-2 sm:p-4 md:p-6 space-y-4 pb-32">
        <BalanceMeter amount={amount} />
        <AddressInput onAddressChange={setAddress} />
        <PrimaryButton onClick={handleWithdraw} disabled={!address}>
          Withdraw
        </PrimaryButton>
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
        <button className="flex flex-col items-center text-blue-500">
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

export default WithdrawPage; 