
import React, { useState } from 'react';
import { ShieldCheckIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
/* eslint-disable */
const VerificationPage = () => {
  const [receiptId, setReceiptId] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = async () => {
    if (!receiptId.trim()) return;
    
    setIsVerifying(true);
    // Simulate verification
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsVerifying(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Vote Verification</h1>
        <p className="text-gray-600">Verify that your vote was recorded correctly and securely</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="max-w-md mx-auto text-center">
          <ShieldCheckIcon className="mx-auto h-16 w-16 text-blue-600 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-4">Enter Your Vote Receipt</h3>
          
          <div className="space-y-4">
            <div className="relative">
              <input
                type="text"
                placeholder="VR-123456-789012"
                value={receiptId}
                onChange={(e) => setReceiptId(e.target.value)}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg text-center font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <button
              onClick={handleVerify}
              disabled={!receiptId.trim() || isVerifying}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isVerifying ? 'Verifying...' : 'Verify Vote'}
            </button>
          </div>
          
          <p className="text-sm text-gray-500 mt-4">
            Your vote receipt was provided when you submitted your vote.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerificationPage