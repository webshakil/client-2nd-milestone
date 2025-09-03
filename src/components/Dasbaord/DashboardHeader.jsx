import React from 'react';

const DashboardHeader = ({ currentTime, userData, currentUserRole, isUserAdmin, handleLogout }) => {
  const getRoleBadge = () => {
    const role = currentUserRole.toLowerCase();
    
    if (isUserAdmin) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          {role === 'manager' ? 'Super Admin' : 'Admin'}
        </span>
      );
    }
    
    if (role !== 'user') {
      const colors = {
        analyst: 'bg-purple-100 text-purple-800',
        moderator: 'bg-green-100 text-green-800',
        auditor: 'bg-orange-100 text-orange-800',
        editor: 'bg-blue-100 text-blue-800',
        advertiser: 'bg-pink-100 text-pink-800'
      };
      
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[role] || 'bg-gray-100 text-gray-800'}`}>
          {role.charAt(0).toUpperCase() + role.slice(1)}
        </span>
      );
    }
    
    return null;
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-blue-600">Vottery</h1>
            {getRoleBadge()}
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              {currentTime.toLocaleString()}
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-blue-600">
                  {userData?.sngine_email?.[0]?.toUpperCase()}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-700">{userData?.sngine_email}</span>
            </div>

            <button
              onClick={handleLogout}
              className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100"
              title="Logout"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;