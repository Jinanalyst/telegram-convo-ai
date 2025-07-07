import DepositItem from '../components/DepositItem';

const DepositsPage = () => {
  const deposits = [
    { date: '2023-10-01', amount: 10.5, txHash: 'abc123' },
    { date: '2023-10-02', amount: 5.0, txHash: 'def456' },
    { date: '2023-10-03', amount: 7.25, txHash: 'ghi789' },
  ]; // Example data

  return (
    <div className="deposits-page p-4 space-y-4">
      {deposits.map((deposit, index) => (
        <DepositItem key={index} date={deposit.date} amount={deposit.amount} txHash={deposit.txHash} />
      ))}
    </div>
  );
};

export default DepositsPage; 