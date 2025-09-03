import React from 'react';

const AuditorDashboard = ({ canViewAudit, hasPermission }) => {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-500 to-yellow-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Auditor Dashboard</h2>
        <p className="text-orange-100">Audit and verification tools</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {canViewAudit && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Audit Tools</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 bg-orange-50 hover:bg-orange-100 rounded-lg text-orange-700">
                Election Audit Trail
              </button>
              <button className="w-full text-left p-3 bg-yellow-50 hover:bg-yellow-100 rounded-lg text-yellow-700">
                Security Logs
              </button>
              <button className="w-full text-left p-3 bg-red-50 hover:bg-red-100 rounded-lg text-red-700">
                Compliance Check
              </button>
            </div>
          </div>
        )}
        
        {hasPermission('audit_elections') && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Verification</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-700">
                Vote Verification
              </button>
              <button className="w-full text-left p-3 bg-green-50 hover:bg-green-100 rounded-lg text-green-700">
                Integrity Reports
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditorDashboard;