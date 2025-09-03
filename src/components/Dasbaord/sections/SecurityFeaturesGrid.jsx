import React from 'react';

const SecurityFeaturesGrid = ({ securityFeatures }) => {
  return (
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
  );
};

export default SecurityFeaturesGrid;