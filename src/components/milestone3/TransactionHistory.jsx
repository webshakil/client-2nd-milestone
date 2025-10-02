import React from 'react';

const TransactionHistory = ({ transactions }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'deposit':
        return '↓';
      case 'withdrawal':
        return '↑';
      case 'payment':
        return '→';
      case 'prize':
        return '★';
      default:
        return '•';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Transaction History</h2>
      {transactions.length === 0 ? (
        <p className="text-gray-600">No transactions yet</p>
      ) : (
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 rounded-full w-10 h-10 flex items-center justify-center text-xl">
                  {getTypeIcon(transaction.transaction_type)}
                </div>
                <div>
                  <p className="font-semibold capitalize">
                    {transaction.transaction_type.replace('_', ' ')}
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date(transaction.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold">
                  {transaction.transaction_type === 'withdrawal' ? '-' : '+'}
                  ${parseFloat(transaction.amount).toFixed(2)}
                </p>
                <span
                  className={`text-xs px-2 py-1 rounded ${getStatusColor(
                    transaction.status
                  )}`}
                >
                  {transaction.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;