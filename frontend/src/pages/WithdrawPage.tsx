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
    <div className="withdraw-page p-2 sm:p-4 md:p-6 lg:p-8 space-y-4 bg-white dark:bg-gray-900">
      <BalanceMeter amount={amount} />
      <AddressInput onAddressChange={setAddress} />
      <PrimaryButton onClick={handleWithdraw} disabled={!address}>
        Withdraw
      </PrimaryButton>
    </div>
  );
};

export default WithdrawPage; 