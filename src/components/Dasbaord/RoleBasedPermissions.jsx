import React from 'react';

const RoleBasedPermissions = ({ currentUserRole, isUserAdmin, rolePermissions }) => {
  const getRoleDescription = () => {
    const role = currentUserRole.toLowerCase();
    
    const descriptions = {
      analyst: 'Data analysis and reporting',
      moderator: 'Content and election management',
      auditor: 'Audit and verification tools',
      editor: 'Content editing capabilities',
      advertiser: 'Campaign management',
      user: 'Standard voting access'
    };

    if (isUserAdmin) {
      return 'Full administrative access';
    }

    return descriptions[role] || 'Standard user permissions';
  };

  return (
    <div className="mt-8 bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Role & Permissions</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Current Role</div>
          <div className="font-medium text-lg capitalize">{currentUserRole}</div>
          <div className="text-sm text-gray-500 mt-1">
            {getRoleDescription()}
          </div>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600 mb-2">Available Permissions</div>
          <div className="space-y-1">
            {rolePermissions?.permissions?.length > 0 ? (
              rolePermissions.permissions.map(permission => (
                <div key={permission} className="text-sm text-green-600 flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  {permission.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500">Standard user permissions</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleBasedPermissions;