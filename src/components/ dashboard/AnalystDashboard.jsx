import React from 'react';
import { Link } from 'react-router';
import { ChartBarIcon, DocumentArrowDownIcon, EyeIcon } from '@heroicons/react/24/outline';

export const AnalystDashboard = () => {
  const analyticsCards = [
    { title: 'Total Users', value: '1,234', change: '+12%', color: 'blue' },
    { title: 'Active Elections', value: '89', change: '+5 this week', color: 'green' },
    { title: 'Total Votes', value: '5,678', change: '+234 today', color: 'purple' },
    { title: 'Reports Generated', value: '456', change: '+3 this month', color: 'orange' }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Analytics Dashboard</h2>
        <p className="text-purple-100">Data insights and reporting tools</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {analyticsCards.map((card, index) => (
          <div key={index} className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{card.value}</div>
              <div className="text-sm text-gray-600">{card.title}</div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-green-600">{card.change}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Export & Reports</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">User Analytics Export</h4>
                <p className="text-sm text-gray-600">Download user engagement reports</p>
              </div>
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm">
                <DocumentArrowDownIcon className="h-4 w-4 inline mr-1" />
                Export CSV
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Election Performance</h4>
                <p className="text-sm text-gray-600">Voting patterns and participation</p>
              </div>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm">
                Generate Report
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Analytics Tools</h3>
          <div className="space-y-3">
            <Link to="/analytics/engagement" className="block p-3 bg-purple-50 hover:bg-purple-100 rounded-lg text-purple-700">
              User Engagement
            </Link>
            <Link to="/analytics/trends" className="block p-3 bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-700">
              Voting Trends
            </Link>
            <Link to="/analytics/performance" className="block p-3 bg-green-50 hover:bg-green-100 rounded-lg text-green-700">
              Performance Metrics
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};