import React from 'react';

const ModeratorDashboard = ({ canManageContent, canManageElections }) => {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Moderator Dashboard</h2>
        <p className="text-green-100">Content and election management tools</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {canManageContent && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Management</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 bg-green-50 hover:bg-green-100 rounded-lg text-green-700">
                Review Reported Content
              </button>
              <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-700">
                Moderate Comments
              </button>
              <button className="w-full text-left p-3 bg-yellow-50 hover:bg-yellow-100 rounded-lg text-yellow-700">
                Content Guidelines
              </button>
            </div>
          </div>
        )}
        
        {canManageElections && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Election Oversight</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 bg-teal-50 hover:bg-teal-100 rounded-lg text-teal-700">
                Review Elections
              </button>
              <button className="w-full text-left p-3 bg-purple-50 hover:bg-purple-100 rounded-lg text-purple-700">
                Monitor Voting
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModeratorDashboard;