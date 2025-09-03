import React from 'react';
import UserManagementSection from '../sections/UserManagementSection';

const AdminDashboard = ({ 
  canManageUsers, 
  canViewAudit, 
  canViewAnalytics, 
  hasPermission,
  selectedUserId,
  setSelectedUserId,
  selectedAdminRole,
  setSelectedAdminRole,
  selectedUserType,
  setSelectedUserType,
  selectedSubscription,
  setSelectedSubscription,
  isUpdatingRole,
  handleUpdateUserRole 
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Admin Dashboard</h2>
        <p className="text-red-100">Administrative controls and system management</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">1,234</div>
                <div className="text-sm text-gray-600">Total Users</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">89</div>
                <div className="text-sm text-gray-600">Active Elections</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">5,678</div>
                <div className="text-sm text-gray-600">Total Votes</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">456</div>
                <div className="text-sm text-gray-600">Subscriptions</div>
              </div>
            </div>
          </div>

          {canManageUsers && (
            <UserManagementSection
              selectedUserId={selectedUserId}
              setSelectedUserId={setSelectedUserId}
              selectedAdminRole={selectedAdminRole}
              setSelectedAdminRole={setSelectedAdminRole}
              selectedUserType={selectedUserType}
              setSelectedUserType={setSelectedUserType}
              selectedSubscription={selectedSubscription}
              setSelectedSubscription={setSelectedSubscription}
              isUpdatingRole={isUpdatingRole}
              handleUpdateUserRole={handleUpdateUserRole}
            />
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              {hasPermission('system_config') && (
                <button className="w-full text-left p-3 bg-red-50 hover:bg-red-100 rounded-lg text-red-700">
                  System Maintenance
                </button>
              )}
              {canViewAudit && (
                <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-700">
                  Security Audit
                </button>
              )}
              {canViewAnalytics && (
                <button className="w-full text-left p-3 bg-green-50 hover:bg-green-100 rounded-lg text-green-700">
                  Generate Reports
                </button>
              )}
              {canViewAnalytics && (
                <button className="w-full text-left p-3 bg-yellow-50 hover:bg-yellow-100 rounded-lg text-yellow-700">
                  User Analytics
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;