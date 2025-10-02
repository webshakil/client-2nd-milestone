import React from 'react';

const PrizeCard = ({ prize }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'distributed':
        return 'text-green-600 bg-green-100';
      case 'approved':
        return 'text-blue-600 bg-blue-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-600">Ticket #{prize.ticket_number}</p>
          <p className="text-2xl font-bold text-green-600">
            ${parseFloat(prize.amount).toFixed(2)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {new Date(prize.created_at).toLocaleString()}
          </p>
        </div>
        <span className={`text-xs px-3 py-1 rounded ${getStatusColor(prize.status)}`}>
          {prize.status}
        </span>
      </div>
      {prize.distributed_at && (
        <p className="text-sm text-gray-600 mt-3">
          Distributed: {new Date(prize.distributed_at).toLocaleString()}
        </p>
      )}
    </div>
  );
};

export default PrizeCard;