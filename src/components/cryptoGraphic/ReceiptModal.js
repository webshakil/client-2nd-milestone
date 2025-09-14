// src/components/ReceiptModal.js - COMPLETE STANDALONE FILE
import React from 'react';

const ReceiptModal = ({ receipt, isOpen, onClose, showToast }) => {
  if (!isOpen) return null;

  const handleCopyCode = () => {
    if (receipt?.verificationCode) {
      navigator.clipboard.writeText(receipt.verificationCode)
        .then(() => {
          if (showToast) {
            showToast('Verification code copied to clipboard!', 'success');
          } else {
            alert('Verification code copied!');
          }
        })
        .catch(() => {
          if (showToast) {
            showToast('Failed to copy code', 'error');
          }
        });
    }
  };

  const handleDownloadReceipt = () => {
    const receiptData = {
      receiptId: receipt.receiptId,
      verificationCode: receipt.verificationCode,
      receiptHash: receipt.receiptHash,
      timestamp: new Date().toISOString(),
      electionId: receipt.electionId || 'N/A'
    };

    const dataStr = JSON.stringify(receiptData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `vote-receipt-${receipt.verificationCode}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    if (showToast) {
      showToast('Receipt downloaded successfully!', 'success');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center">
          {/* Success Icon */}
          <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>

          <h3 className="text-xl font-semibold text-gray-900 mb-4">Vote Receipt</h3>
          
          {/* Receipt Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="space-y-3 text-left">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Receipt ID:</span>
                <span className="font-mono text-sm bg-white px-2 py-1 rounded border">
                  {receipt?.receiptId ? receipt.receiptId.substring(0, 8) + '...' : 'N/A'}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Verification Code:</span>
                <span className="font-mono text-sm bg-yellow-100 px-2 py-1 rounded border font-bold">
                  {receipt?.verificationCode || 'N/A'}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Receipt Hash:</span>
                <span className="font-mono text-xs bg-white px-2 py-1 rounded border">
                  {receipt?.receiptHash ? receipt.receiptHash.substring(0, 12) + '...' : 'N/A'}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Timestamp:</span>
                <span className="text-xs">
                  {new Date().toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Status:</span>
                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                  Verified
                </span>
              </div>
            </div>
          </div>

          {/* Security Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
            <div className="flex items-start">
              <svg className="w-4 h-4 text-blue-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z" />
              </svg>
              <div className="text-left">
                <p className="text-sm text-blue-800 font-medium mb-1">
                  Keep this verification code safe
                </p>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• Use it to verify your vote was counted</li>
                  <li>• Your vote remains completely anonymous</li>
                  <li>• Receipt is cryptographically secured</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <div className="flex space-x-3">
              <button
                onClick={handleCopyCode}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy Code
              </button>
              
              <button
                onClick={handleDownloadReceipt}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium"
              >
                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors font-medium"
            >
              Done
            </button>
          </div>

          {/* Additional Info */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              This receipt confirms your vote was successfully encrypted and submitted. 
              Keep your verification code to check your vote was included in the final tally.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;

// USAGE EXAMPLE:
// import ReceiptModal from './components/ReceiptModal';
// 
// const [showReceiptModal, setShowReceiptModal] = useState(false);
// const [receipt, setReceipt] = useState(null);
//
// <ReceiptModal 
//   receipt={receipt}
//   isOpen={showReceiptModal}
//   onClose={() => setShowReceiptModal(false)}
//   showToast={showToast}
// />