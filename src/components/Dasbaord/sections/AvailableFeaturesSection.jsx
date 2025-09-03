import React from 'react';

const AvailableFeaturesSection = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Features (Milestone 1)</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
          <div className="flex items-center mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            <h4 className="font-medium text-gray-900">Multi-Factor Authentication</h4>
          </div>
          <p className="text-sm text-gray-600">Email + SMS + Biometric verification</p>
        </div>
        <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
          <div className="flex items-center mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            <h4 className="font-medium text-gray-900">User Management</h4>
          </div>
          <p className="text-sm text-gray-600">Role-based access control</p>
        </div>
        <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
          <div className="flex items-center mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            <h4 className="font-medium text-gray-900">Security Framework</h4>
          </div>
          <p className="text-sm text-gray-600">End-to-end encryption</p>
        </div>
        <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
          <div className="flex items-center mb-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
            <h4 className="font-medium text-gray-900">Election Management</h4>
          </div>
          <p className="text-sm text-gray-600">Coming in Milestone 2</p>
        </div>
      </div>
    </div>
  );
};

export default AvailableFeaturesSection;