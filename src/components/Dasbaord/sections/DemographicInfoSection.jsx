import React from 'react';

const DemographicInfoSection = ({ userData }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Demographic Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Age</div>
          <div className="font-medium">{userData?.user_age || 'Not specified'}</div>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Gender</div>
          <div className="font-medium">{userData?.user_gender || 'Not specified'}</div>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Country</div>
          <div className="font-medium">{userData?.user_country || 'Not specified'}</div>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">City</div>
          <div className="font-medium">{userData?.city || 'Not specified'}</div>
        </div>
      </div>
    </div>
  );
};

export default DemographicInfoSection;