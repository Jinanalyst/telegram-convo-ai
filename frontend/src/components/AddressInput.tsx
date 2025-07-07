import React, { useState } from 'react';

interface AddressInputProps {
  onAddressChange: (address: string) => void;
}

const AddressInput: React.FC<AddressInputProps> = ({ onAddressChange }) => {
  const [address, setAddress] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAddress = e.target.value;
    setAddress(newAddress);
    onAddressChange(newAddress);
  };

  return (
    <div className="address-input flex items-center p-2 bg-bgSecondary rounded-xl shadow-md">
      <input
        type="text"
        value={address}
        onChange={handleChange}
        className="flex-grow p-2 rounded-full border border-gray-300 focus:outline-none"
        placeholder="Enter TON wallet address"
      />
    </div>
  );
};

export default AddressInput; 