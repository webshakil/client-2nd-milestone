import React from 'react';

const AccountStatusSection = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Status</h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Email Verified</span>
          <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">Verified</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Phone Verified</span>
          <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">Verified</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Biometric Auth</span>
          <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">Active</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Profile Complete</span>
          <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">Complete</span>
        </div>
      </div>
    </div>
  );
};

export default AccountStatusSection;