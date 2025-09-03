import React from 'react';

const PersonalInfoSection = ({ userData }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Email</div>
          <div className="font-medium">{userData?.sngine_email}</div>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Phone</div>
          <div className="font-medium">{userData?.sngine_phone}</div>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">User Type</div>
          <div className="font-medium capitalize">{userData?.user_type}</div>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Subscription</div>
          <div className="font-medium capitalize">{userData?.subscription_status}</div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoSection;