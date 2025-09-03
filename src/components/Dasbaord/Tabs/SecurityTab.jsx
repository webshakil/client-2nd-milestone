import React from 'react';

const SecurityTab = ({ securityFeatures, securityMetrics }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Security Framework Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(securityFeatures).map(([feature, details]) => (
            <div key={feature} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{feature}</h4>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  details.type === 'success' ? 'bg-green-100 text-green-800' :
                  details.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {details.status}
                </span>
              </div>
              <p className="text-sm text-gray-600">{details.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">HTTPS Status</div>
            <div className={`font-medium ${securityMetrics.httpsEnabled ? 'text-green-600' : 'text-red-600'}`}>
              {securityMetrics.httpsEnabled ? 'Secure Connection' : 'Insecure Connection'}
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">WebAuthn Support</div>
            <div className={`font-medium ${securityMetrics.webAuthnSupported ? 'text-green-600' : 'text-yellow-600'}`}>
              {securityMetrics.webAuthnSupported ? 'Supported' : 'Not Supported'}
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Local Storage</div>
            <div className={`font-medium ${securityMetrics.localStorageEnabled ? 'text-green-600' : 'text-red-600'}`}>
              {securityMetrics.localStorageEnabled ? 'Enabled' : 'Disabled'}
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Session Storage</div>
            <div className={`font-medium ${securityMetrics.sessionStorageEnabled ? 'text-green-600' : 'text-red-600'}`}>
              {securityMetrics.sessionStorageEnabled ? 'Enabled' : 'Disabled'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityTab;