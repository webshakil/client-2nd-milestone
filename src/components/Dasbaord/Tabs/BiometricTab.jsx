import React from 'react';

const BiometricTab = ({ securityMetrics }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Biometric Authentication Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 border border-green-200 bg-green-50 rounded-lg">
            <div className="flex items-center mb-4">
              <svg className="w-8 h-8 text-green-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <div>
                <h4 className="font-medium text-green-800">Device Fingerprint</h4>
                <p className="text-sm text-green-600">Registered & Active</p>
              </div>
            </div>
            <div className="text-sm text-green-700">
              <p>• Unique device identification</p>
              <p>• Hardware-based security</p>
              <p>• Anti-fraud protection</p>
            </div>
          </div>

          <div className="p-6 border border-blue-200 bg-blue-50 rounded-lg">
            <div className="flex items-center mb-4">
              <svg className="w-8 h-8 text-blue-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <div>
                <h4 className="font-medium text-blue-800">WebAuthn Status</h4>
                <p className="text-sm text-blue-600">
                  {securityMetrics.webAuthnSupported ? 'Available' : 'Not Available'}
                </p>
              </div>
            </div>
            <div className="text-sm text-blue-700">
              <p>• Passwordless authentication</p>
              <p>• Hardware security keys</p>
              <p>• Biometric verification</p>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Biometric Capabilities</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Face ID Support: {/iPhone|iPad/.test(navigator.userAgent) ? 'Yes' : 'No'}
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Fingerprint: {/Android/.test(navigator.userAgent) ? 'Yes' : 'No'}
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              WebAuthn: {securityMetrics.webAuthnSupported ? 'Yes' : 'No'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BiometricTab;