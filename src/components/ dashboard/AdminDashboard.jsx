import React, { useState } from 'react';
import { Link } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import UserRoleManager from '../admin/UserRoleManager';
import {
  UsersIcon,
  DocumentTextIcon,
  ChartBarIcon,
  CogIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const AdminDashboard = () => {
  const { canManageUsers, hasPermission } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const systemStats = [
    {
      title: 'Total Users',
      value: '1,234',
      change: '+12%',
      changeType: 'positive',
      icon: UsersIcon,
      color: 'blue'
    },
    {
      title: 'Active Elections',
      value: '89',
      change: '+5 this week',
      changeType: 'positive',
      icon: DocumentTextIcon,
      color: 'green'
    },
    {
      title: 'Total Votes',
      value: '5,678',
      change: '+234 today',
      changeType: 'positive',
      icon: CheckCircleIcon,
      color: 'purple'
    },
    {
      title: 'System Health',
      value: '99.9%',
      change: 'All systems operational',
      changeType: 'positive',
      icon: ShieldCheckIcon,
      color: 'green'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'user_registration',
      description: 'New user registered: john.doe@example.com',
      timestamp: '2 minutes ago',
      severity: 'info'
    },
    {
      id: 2,
      type: 'election_created',
      description: 'Election created: "Best Programming Language 2025"',
      timestamp: '15 minutes ago',
      severity: 'info'
    },
    {
      id: 3,
      type: 'security_alert',
      description: 'Multiple failed login attempts from IP: 192.168.1.100',
      timestamp: '1 hour ago',
      severity: 'warning'
    },
    {
      id: 4,
      type: 'system_maintenance',
      description: 'Database backup completed successfully',
      timestamp: '2 hours ago',
      severity: 'success'
    }
  ];

  const quickActions = [
    {
      title: 'User Management',
      description: 'Manage users, roles, and permissions',
      href: '/admin/users',
      icon: UsersIcon,
      color: 'blue',
      show: canManageUsers()
    },
    {
      title: 'System Analytics',
      description: 'View platform analytics and reports',
      href: '/analytics',
      icon: ChartBarIcon,
      color: 'green',
      show: hasPermission('view_analytics')
    },
    {
      title: 'Security Audit',
      description: 'Review security logs and audit trails',
      href: '/audit',
      icon: ShieldCheckIcon,
      color: 'orange',
      show: hasPermission('view_audit')
    },
    {
      title: 'System Settings',
      description: 'Configure platform settings',
      href: '/admin/settings',
      icon: CogIcon,
      color: 'purple',
      show: hasPermission('system_config')
    }
  ].filter(action => action.show);

  const tabs = [
    { id: 'overview', name: 'Overview', show: true },
    { id: 'users', name: 'User Management', show: canManageUsers() },
    { id: 'analytics', name: 'Analytics', show: hasPermission('view_analytics') },
    { id: 'settings', name: 'Settings', show: hasPermission('system_config') }
  ].filter(tab => tab.show);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-red-100">Administrative controls and system management</p>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {systemStats.map((stat, index) => {
              const Icon = stat.icon;
              const colorClasses = {
                blue: 'bg-blue-50 text-blue-600 border-blue-200',
                green: 'bg-green-50 text-green-600 border-green-200',
                purple: 'bg-purple-50 text-purple-600 border-purple-200',
                orange: 'bg-orange-50 text-orange-600 border-orange-200'
              };
              
              return (
                <div key={index} className="bg-white rounded-lg shadow border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-lg border ${colorClasses[stat.color]}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="text-sm text-green-600">{stat.change}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Actions */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  const colorClasses = {
                    blue: 'bg-blue-50 hover:bg-blue-100 text-blue-700',
                    green: 'bg-green-50 hover:bg-green-100 text-green-700',
                    purple: 'bg-purple-50 hover:bg-purple-100 text-purple-700',
                    orange: 'bg-orange-50 hover:bg-orange-100 text-orange-700'
                  };
                  
                  return (
                    <Link
                      key={index}
                      to={action.href}
                      className={`block p-4 rounded-lg transition-colors ${colorClasses[action.color]}`}
                    >
                      <div className="flex items-center">
                        <Icon className="h-6 w-6 mr-3" />
                        <div>
                          <div className="font-medium">{action.title}</div>
                          <div className="text-sm opacity-75">{action.description}</div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {recentActivity.map((activity) => {
                  const severityClasses = {
                    info: 'bg-blue-100 text-blue-800',
                    warning: 'bg-yellow-100 text-yellow-800',
                    success: 'bg-green-100 text-green-800',
                    error: 'bg-red-100 text-red-800'
                  };
                  
                  return (
                    <div key={activity.id} className="border-l-4 border-gray-200 pl-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">{activity.description}</p>
                          <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${severityClasses[activity.severity]}`}>
                          {activity.severity}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && canManageUsers() && (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">User Role Management</h3>
          <UserRoleManager />
        </div>
      )}

      {activeTab === 'analytics' && hasPermission('view_analytics') && (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Analytics</h3>
          <div className="text-center py-12">
            <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Analytics Dashboard</h3>
            <p className="mt-1 text-sm text-gray-500">
              Detailed analytics and reporting features coming soon.
            </p>
            <Link
              to="/analytics"
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              View Full Analytics
            </Link>
          </div>
        </div>
      )}

      {activeTab === 'settings' && hasPermission('system_config') && (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Settings</h3>
          <div className="text-center py-12">
            <CogIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">System Configuration</h3>
            <p className="mt-1 text-sm text-gray-500">
              System configuration panel coming soon.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;