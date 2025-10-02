// src/components/PaymentModal.jsx
import React, { useState } from 'react';
import {
  XMarkIcon,
  CurrencyDollarIcon,
  CreditCardIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

const PaymentModal = ({ isOpen, onClose, election }) => {
  const [paymentProvider, setPaymentProvider] = useState('demo');
  const [processing, setProcessing] = useState(false);

  // Helper function to get payment amount
  const getPaymentAmount = (election) => {
    if (!election) return 10;
    const amount = election.participation_fee || election.regional_fees?.region1 || 10;
    const numAmount = parseFloat(amount);
    return isNaN(numAmount) ? 10 : numAmount;
  };

  // Mock Stripe Payment (no API call)
  const processStripePayment = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('Stripe checkout would open here. (Demo mode - no actual redirect)');
    console.log('Mock Stripe Checkout:', { success: true, sessionId: 'cs_test_mock_' + Date.now() });
    return { success: true };
  };

  // Mock Paddle Payment (no API call)
  const processPaddlePayment = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('Paddle checkout would open here. (Demo mode - no actual redirect)');
    console.log('Mock Paddle Checkout:', { success: true, transactionId: 'txn_mock_' + Date.now() });
    return { success: true };
  };

  // Mock Demo Payment (no API call)
  const processDemoPayment = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        toast.success('Demo payment successful! You can now vote.');
        resolve({ success: true });
      }, 2000);
    });
  };

  const handlePayment = async () => {
    setProcessing(true);

    let result;
    if (paymentProvider === 'stripe') {
      result = await processStripePayment();
    } else if (paymentProvider === 'paddle') {
      result = await processPaddlePayment();
    } else {
      result = await processDemoPayment();
      if (result.success) {
        onClose();
      }
    }

    setProcessing(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 overflow-y-auto h-full w-full z-[60]">
      <div className="relative top-10 mx-auto p-6 border w-11/12 md:w-2/3 lg:w-1/2 xl:w-1/3 shadow-lg rounded-lg bg-white max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Complete Payment</h3>
          <button
            onClick={onClose}
            disabled={processing}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Election Info */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">{election.title}</h4>
            <div className="flex justify-between items-center">
              <span className="text-blue-700">Participation Fee:</span>
              <span className="text-xl font-bold text-blue-900">
                ${getPaymentAmount(election).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Payment Provider Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Payment Provider
            </label>
            <div className="space-y-2">
              <button
                onClick={() => setPaymentProvider('stripe')}
                disabled={processing}
                className={`w-full flex items-center justify-between p-4 border-2 rounded-lg transition-all ${
                  paymentProvider === 'stripe'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                } disabled:opacity-50`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded flex items-center justify-center">
                    <CreditCardIcon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-left">
                    <span className="font-medium block">Stripe</span>
                    <span className="text-xs text-gray-500">Secure Card Payment</span>
                  </div>
                </div>
                {paymentProvider === 'stripe' && (
                  <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                )}
              </button>

              <button
                onClick={() => setPaymentProvider('paddle')}
                disabled={processing}
                className={`w-full flex items-center justify-between p-4 border-2 rounded-lg transition-all ${
                  paymentProvider === 'paddle'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                } disabled:opacity-50`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-teal-600 rounded flex items-center justify-center">
                    <CurrencyDollarIcon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-left">
                    <span className="font-medium block">Paddle</span>
                    <span className="text-xs text-gray-500">Multiple Options</span>
                  </div>
                </div>
                {paymentProvider === 'paddle' && (
                  <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                )}
              </button>

              <button
                onClick={() => setPaymentProvider('demo')}
                disabled={processing}
                className={`w-full flex items-center justify-between p-4 border-2 rounded-lg transition-all ${
                  paymentProvider === 'demo'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                } disabled:opacity-50`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-600 to-red-600 rounded flex items-center justify-center">
                    <span className="text-white font-bold text-xs">DEMO</span>
                  </div>
                  <div className="text-left">
                    <span className="font-medium block">Demo Mode</span>
                    <span className="text-xs text-gray-500">Testing Only</span>
                  </div>
                </div>
                {paymentProvider === 'demo' && (
                  <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                )}
              </button>
            </div>
          </div>

          {/* Provider Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            {paymentProvider === 'stripe' && (
              <div className="space-y-2">
                <h5 className="font-semibold text-gray-900">Stripe Checkout</h5>
                <p className="text-sm text-gray-600">
                  You will be redirected to Stripe's secure checkout page. Supports credit cards, debit cards, and digital wallets.
                </p>
              </div>
            )}
            
            {paymentProvider === 'paddle' && (
              <div className="space-y-2">
                <h5 className="font-semibold text-gray-900">Paddle Checkout</h5>
                <p className="text-sm text-gray-600">
                  You will be redirected to Paddle's secure checkout. Handles sales tax automatically and supports multiple payment methods.
                </p>
              </div>
            )}

            {paymentProvider === 'demo' && (
              <div className="space-y-2">
                <h5 className="font-semibold text-gray-900">Demo Mode</h5>
                <p className="text-sm text-gray-600">
                  This is a demonstration. No real payment will be processed.
                </p>
              </div>
            )}
          </div>

          {/* Security Badge */}
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>Secure SSL encrypted payment</span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              disabled={processing}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handlePayment}
              disabled={processing}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {processing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Processing...
                </>
              ) : (
                <>
                  <CreditCardIcon className="h-5 w-5" />
                  {paymentProvider === 'demo' ? 'Simulate Payment' : 'Proceed to Checkout'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
// // src/components/PaymentModal.jsx
// import React, { useState } from 'react';
// import {
//   XMarkIcon,
//   CurrencyDollarIcon,
//   CreditCardIcon,
// } from '@heroicons/react/24/outline';
// import { paymentService } from '../../../services/paymentService';
// //import { paymentService } from '../../../services/paymentService';
// //import PaymentService from '../../../services/PaymentService-2';
// //import PaymentService from '../services/PaymentService';

// const PaymentModal = ({ isOpen, onClose, election }) => {
//   const [paymentProvider, setPaymentProvider] = useState('demo');
//   const [processing, setProcessing] = useState(false);

//   const handlePayment = async () => {
//     setProcessing(true);

//     let result;
//     if (paymentProvider === 'stripe') {
//       result = await paymentService.processStripePayment(election);
//     } else if (paymentProvider === 'paddle') {
//       result = await paymentService.processPaddlePayment(election);
//     } else {
//       result = await paymentService.processDemoPayment(election);
//       if (result.success) {
//         onClose();
//       }
//     }

//     setProcessing(false);
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-gray-900 bg-opacity-75 overflow-y-auto h-full w-full z-[60]">
//       <div className="relative top-10 mx-auto p-6 border w-11/12 md:w-2/3 lg:w-1/2 xl:w-1/3 shadow-lg rounded-lg bg-white max-h-[90vh] overflow-y-auto">
//         <div className="flex items-center justify-between mb-6">
//           <h3 className="text-2xl font-bold text-gray-900">Complete Payment</h3>
//           <button
//             onClick={onClose}
//             disabled={processing}
//             className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
//           >
//             <XMarkIcon className="h-6 w-6" />
//           </button>
//         </div>

//         <div className="space-y-6">
//           {/* Election Info */}
//           <div className="bg-blue-50 rounded-lg p-4">
//             <h4 className="font-semibold text-blue-900 mb-2">{election.title}</h4>
//             <div className="flex justify-between items-center">
//               <span className="text-blue-700">Participation Fee:</span>
//               <span className="text-xl font-bold text-blue-900">
//                 ${paymentService.getPaymentAmount(election).toFixed(2)}
//               </span>
//             </div>
//           </div>

//           {/* Payment Provider Selection */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-3">
//               Select Payment Provider
//             </label>
//             <div className="space-y-2">
//               <button
//                 onClick={() => setPaymentProvider('stripe')}
//                 disabled={processing}
//                 className={`w-full flex items-center justify-between p-4 border-2 rounded-lg transition-all ${
//                   paymentProvider === 'stripe'
//                     ? 'border-blue-500 bg-blue-50'
//                     : 'border-gray-200 hover:border-gray-300'
//                 } disabled:opacity-50`}
//               >
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded flex items-center justify-center">
//                     <CreditCardIcon className="h-6 w-6 text-white" />
//                   </div>
//                   <div className="text-left">
//                     <span className="font-medium block">Stripe</span>
//                     <span className="text-xs text-gray-500">Secure Card Payment</span>
//                   </div>
//                 </div>
//                 {paymentProvider === 'stripe' && (
//                   <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
//                 )}
//               </button>

//               <button
//                 onClick={() => setPaymentProvider('paddle')}
//                 disabled={processing}
//                 className={`w-full flex items-center justify-between p-4 border-2 rounded-lg transition-all ${
//                   paymentProvider === 'paddle'
//                     ? 'border-blue-500 bg-blue-50'
//                     : 'border-gray-200 hover:border-gray-300'
//                 } disabled:opacity-50`}
//               >
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-teal-600 rounded flex items-center justify-center">
//                     <CurrencyDollarIcon className="h-6 w-6 text-white" />
//                   </div>
//                   <div className="text-left">
//                     <span className="font-medium block">Paddle</span>
//                     <span className="text-xs text-gray-500">Multiple Options</span>
//                   </div>
//                 </div>
//                 {paymentProvider === 'paddle' && (
//                   <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
//                 )}
//               </button>

//               <button
//                 onClick={() => setPaymentProvider('demo')}
//                 disabled={processing}
//                 className={`w-full flex items-center justify-between p-4 border-2 rounded-lg transition-all ${
//                   paymentProvider === 'demo'
//                     ? 'border-blue-500 bg-blue-50'
//                     : 'border-gray-200 hover:border-gray-300'
//                 } disabled:opacity-50`}
//               >
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 bg-gradient-to-br from-orange-600 to-red-600 rounded flex items-center justify-center">
//                     <span className="text-white font-bold text-xs">DEMO</span>
//                   </div>
//                   <div className="text-left">
//                     <span className="font-medium block">Demo Mode</span>
//                     <span className="text-xs text-gray-500">Testing Only</span>
//                   </div>
//                 </div>
//                 {paymentProvider === 'demo' && (
//                   <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
//                 )}
//               </button>
//             </div>
//           </div>

//           {/* Provider Information */}
//           <div className="bg-gray-50 rounded-lg p-4">
//             {paymentProvider === 'stripe' && (
//               <div className="space-y-2">
//                 <h5 className="font-semibold text-gray-900">Stripe Checkout</h5>
//                 <p className="text-sm text-gray-600">
//                   You will be redirected to Stripe's secure checkout page. Supports credit cards, debit cards, and digital wallets.
//                 </p>
//               </div>
//             )}
            
//             {paymentProvider === 'paddle' && (
//               <div className="space-y-2">
//                 <h5 className="font-semibold text-gray-900">Paddle Checkout</h5>
//                 <p className="text-sm text-gray-600">
//                   You will be redirected to Paddle's secure checkout. Handles sales tax automatically and supports multiple payment methods.
//                 </p>
//               </div>
//             )}

//             {paymentProvider === 'demo' && (
//               <div className="space-y-2">
//                 <h5 className="font-semibold text-gray-900">Demo Mode</h5>
//                 <p className="text-sm text-gray-600">
//                   This is a demonstration. No real payment will be processed.
//                 </p>
//               </div>
//             )}
//           </div>

//           {/* Security Badge */}
//           <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
//             <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
//             </svg>
//             <span>Secure SSL encrypted payment</span>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex gap-3 pt-4">
//             <button
//               onClick={onClose}
//               disabled={processing}
//               className="flex-1 px-6 py-3 border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handlePayment}
//               disabled={processing}
//               className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
//             >
//               {processing ? (
//                 <>
//                   <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
//                   Processing...
//                 </>
//               ) : (
//                 <>
//                   <CreditCardIcon className="h-5 w-5" />
//                   {paymentProvider === 'demo' ? 'Simulate Payment' : 'Proceed to Checkout'}
//                 </>
//               )}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PaymentModal;