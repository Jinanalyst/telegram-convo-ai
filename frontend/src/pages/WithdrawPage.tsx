import { useState } from 'react';
import BalanceMeter from '../components/BalanceMeter';
import AddressInput from '../components/AddressInput';
import PrimaryButton from '../components/PrimaryButton';

const WithdrawPage = () => {
  const [address, setAddress] = useState('');
  const [amount] = useState(10.0); // Example amount

  const handleWithdraw = () => {
    if (address) {
      alert('Withdrawal successful!');
    } else {
      alert('Please enter a valid address.');
    }
  };

  return (
    <div className="withdraw-page p-4 space-y-4">
      <BalanceMeter amount={amount} />
      <AddressInput onAddressChange={setAddress} />
      <PrimaryButton onClick={handleWithdraw} disabled={!address}>
        Withdraw
      </PrimaryButton>
    </div>
  );
};

export default WithdrawPage; 