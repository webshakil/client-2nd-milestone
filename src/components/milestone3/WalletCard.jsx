import React from 'react';

const WalletCard = ({ wallet }) => {
  if (!wallet) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p>No wallet found</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-8 text-white">
      <div className="flex justify-between items-start mb-6">
        <div>
          <p className="text-sm opacity-90">Available Balance</p>
          <h2 className="text-4xl font-bold mt-2">
            ${parseFloat(wallet.balance).toFixed(2)}
          </h2>
        </div>
        <div className="bg-white bg-opacity-20 rounded-lg p-3">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
            <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      <div className="flex justify-between items-end">
        <div>
          <p className="text-xs opacity-75">Currency</p>
          <p className="font-semibold">{wallet.currency}</p>
        </div>
        <div className="text-right">
          <p className="text-xs opacity-75">Wallet ID</p>
          <p className="font-semibold">#{wallet.id}</p>
        </div>
      </div>
    </div>
  );
};

export default WalletCard;