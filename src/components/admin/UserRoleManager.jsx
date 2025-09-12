import React, { useState, useEffect } from 'react';
import { useUserManagement } from '../../hooks/useUserManagement';
import { toast } from 'react-hot-toast';
import {
  UsersIcon,
  PencilSquareIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowPathIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

// Static mock data with American names
const mockUsers = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '+1-555-0101',
    admin_role: 'admin',
    user_type: 'organization_creator',
    subscription_status: 'subscribed',
    created_at: '2024-01-15T10:30:00Z',
    last_active: '2024-03-10T14:22:00Z'
  },
  {
    id: '2',
    name: 'Jennifer Garcia',
    email: 'jennifer.garcia@example.com',
    phone: '+1-555-0102',
    admin_role: 'moderator',
    user_type: 'individual_creator',
    subscription_status: 'subscribed',
    created_at: '2024-01-20T09:15:00Z',
    last_active: '2024-03-09T16:45:00Z'
  },
  {
    id: '3',
    name: 'Michael Johnson',
    email: 'michael.johnson@example.com',
    phone: '+1-555-0103',
    admin_role: 'editor',
    user_type: 'voter',
    subscription_status: 'free',
    created_at: '2024-02-01T11:00:00Z',
    last_active: '2024-03-08T12:30:00Z'
  },
  {
    id: '4',
    name: 'Sarah Rodriguez',
    email: 'sarah.rodriguez@example.com',
    phone: '+1-555-0104',
    admin_role: 'analyst',
    user_type: 'individual_creator',
    subscription_status: 'subscribed',
    created_at: '2024-02-05T13:45:00Z',
    last_active: '2024-03-07T08:20:00Z'
  },
  {
    id: '5',
    name: 'David Williams',
    email: 'david.williams@example.com',
    phone: '+1-555-0105',
    admin_role: 'user',
    user_type: 'voter',
    subscription_status: 'free',
    created_at: '2024-02-10T15:20:00Z',
    last_active: '2024-03-06T19:15:00Z'
  },
  {
    id: '6',
    name: 'Jessica Martinez',
    email: 'jessica.martinez@example.com',
    phone: '+1-555-0106',
    admin_role: 'advertiser',
    user_type: 'organization_creator',
    subscription_status: 'subscribed',
    created_at: '2024-02-15T08:30:00Z',
    last_active: '2024-03-05T13:40:00Z'
  },
  {
    id: '7',
    name: 'Robert Davis',
    email: 'robert.davis@example.com',
    phone: '+1-555-0107',
    admin_role: 'auditor',
    user_type: 'individual_creator',
    subscription_status: 'free',
    created_at: '2024-02-20T10:45:00Z',
    last_active: '2024-03-04T17:25:00Z'
  },
  {
    id: '8',
    name: 'Lisa Thompson',
    email: 'lisa.thompson@example.com',
    phone: '+1-555-0108',
    admin_role: 'manager',
    user_type: 'organization_creator',
    subscription_status: 'subscribed',
    created_at: '2024-02-25T12:00:00Z',
    last_active: '2024-03-03T11:50:00Z'
  },
  {
    id: '9',
    name: 'William Miller',
    email: 'william.miller@example.com',
    phone: '+1-555-0109',
    admin_role: 'user',
    user_type: 'voter',
    subscription_status: 'free',
    created_at: '2024-03-01T14:15:00Z',
    last_active: '2024-03-02T20:10:00Z'
  },
  {
    id: '10',
    name: 'Michelle White',
    email: 'michelle.white@example.com',
    phone: '+1-555-0110',
    admin_role: 'moderator',
    user_type: 'individual_creator',
    subscription_status: 'subscribed',
    created_at: '2024-03-05T16:30:00Z',
    last_active: '2024-03-01T09:35:00Z'
  }
];

const UserRoleManager = () => {
  const {
    users = mockUsers, // Use mock data as fallback
    pagination = { page: 1, limit: 10, total: mockUsers.length },
    loading = false,
    error = null,
    fetchUsers = () => {},
    updateUserRole = () => Promise.resolve(),
    deleteUser = () => Promise.resolve(),
    searchUsers = () => {},
    setFilters = () => {}
  } = useUserManagement() || {};

  // Form state
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedAdminRole, setSelectedAdminRole] = useState('');
  const [selectedUserType, setSelectedUserType] = useState('');
  const [selectedSubscription, setSelectedSubscription] = useState('');
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterSubscription, setFilterSubscription] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');

  // Debounced search
  const [searchDebounce, setSearchDebounce] = useState(null);

  // Handle search with debouncing
  useEffect(() => {
    if (searchDebounce) {
      clearTimeout(searchDebounce);
    }

    const timeout = setTimeout(() => {
      if (searchTerm.trim()) {
        searchUsers(searchTerm.trim());
      } else {
        applyFilters();
      }
    }, 500);

    setSearchDebounce(timeout);

    return () => {
      if (searchDebounce) {
        clearTimeout(searchDebounce);
      }
    };
  }, [searchTerm]);

  // Apply filters when filter options change
  const applyFilters = () => {
    const filters = {
      ...(filterRole !== 'all' && { admin_role: filterRole }),
      ...(filterType !== 'all' && { user_type: filterType }),
      ...(filterSubscription !== 'all' && { subscription_status: filterSubscription }),
      sort_by: sortBy,
      sort_order: sortOrder
    };

    setFilters(filters);
    fetchUsers(1, filters);
  };

  useEffect(() => {
    if (!searchTerm.trim()) {
      applyFilters();
    }
  }, [filterRole, filterType, filterSubscription, sortBy, sortOrder]);

  // Handle role update
  const handleUpdateUserRole = async () => {
    if (!selectedUserId || !selectedAdminRole || !selectedUserType || !selectedSubscription) {
      toast.error('Please fill all fields');
      return;
    }

    try {
      setIsUpdatingRole(true);
      
      await updateUserRole(selectedUserId, {
        adminRole: selectedAdminRole,
        userType: selectedUserType,
        subscriptionStatus: selectedSubscription
      });
      
      toast.success('User role updated successfully');
      
      // Reset form
      setSelectedUserId('');
      setSelectedAdminRole('');
      setSelectedUserType('');
      setSelectedSubscription('');
      
    } catch (error) {
      console.error('Failed to update user role:', error);
      toast.error('Failed to update user role');
    } finally {
      setIsUpdatingRole(false);
    }
  };

  // Handle user deletion
  const handleDeleteUser = async (userId, userName) => {
    const confirmMessage = `Are you sure you want to delete user "${userName}"? This action cannot be undone.`;
    
    if (window.confirm(confirmMessage)) {
      try {
        await deleteUser(userId);
        toast.success('User deleted successfully');
      } catch (error) {
        console.error('Failed to delete user:', error);
        toast.error('Failed to delete user');
      }
    }
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    fetchUsers(newPage);
  };

  // Handle user selection for editing
  const handleSelectUserForEdit = (user) => {
    setSelectedUserId(user.id);
    setSelectedAdminRole(user.admin_role);
    setSelectedUserType(user.user_type);
    setSelectedSubscription(user.subscription_status);
    
    // Scroll to form
    document.getElementById('role-update-form')?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  // Role badge styling
  const getRoleBadgeColor = (role) => {
    const colors = {
      user: 'bg-gray-100 text-gray-800',
      analyst: 'bg-purple-100 text-purple-800',
      editor: 'bg-blue-100 text-blue-800',
      moderator: 'bg-green-100 text-green-800',
      auditor: 'bg-orange-100 text-orange-800',
      advertiser: 'bg-pink-100 text-pink-800',
      admin: 'bg-red-100 text-red-800',
      manager: 'bg-red-100 text-red-800'
    };
    return colors[role] || colors.user;
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Role Update Form */}
      <div id="role-update-form" className="bg-gray-50 rounded-lg p-6">
        <h4 className="font-medium text-gray-900 mb-4 flex items-center">
          <PencilSquareIcon className="h-5 w-5 mr-2" />
          Update User Role & Type
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label htmlFor="selectUser" className="block text-sm font-medium text-gray-700 mb-2">
              Select User
            </label>
            <select
              id="selectUser"
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              disabled={isUpdatingRole || loading}
              className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100"
            >
              <option value="">Choose a user</option>
              {mockUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name || user.email}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="selectRole" className="block text-sm font-medium text-gray-700 mb-2">
              Admin Role
            </label>
            <select
              id="selectRole"
              value={selectedAdminRole}
              onChange={(e) => setSelectedAdminRole(e.target.value)}
              disabled={isUpdatingRole || loading}
              className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100"
            >
              <option value="">Select Role</option>
              <option value="user">User</option>
              <option value="analyst">Analyst</option>
              <option value="editor">Editor</option>
              <option value="advertiser">Advertiser</option>
              <option value="moderator">Moderator</option>
              <option value="auditor">Auditor</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
            </select>
          </div>

          <div>
            <label htmlFor="selectType" className="block text-sm font-medium text-gray-700 mb-2">
              User Type
            </label>
            <select
              id="selectType"
              value={selectedUserType}
              onChange={(e) => setSelectedUserType(e.target.value)}
              disabled={isUpdatingRole || loading}
              className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100"
            >
              <option value="">Select Type</option>
              <option value="voter">Voter</option>
              <option value="individual_creator">Individual Creator</option>
              <option value="organization_creator">Organization Creator</option>
            </select>
          </div>

          <div>
            <label htmlFor="selectSubscription" className="block text-sm font-medium text-gray-700 mb-2">
              Subscription
            </label>
            <select
              id="selectSubscription"
              value={selectedSubscription}
              onChange={(e) => setSelectedSubscription(e.target.value)}
              disabled={isUpdatingRole || loading}
              className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100"
            >
              <option value="">Select Subscription</option>
              <option value="free">Free</option>
              <option value="subscribed">Subscribed</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleUpdateUserRole}
              disabled={isUpdatingRole || loading || !selectedUserId || !selectedAdminRole || !selectedUserType || !selectedSubscription}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center"
            >
              {isUpdatingRole ? (
                <>
                  <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Role'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Search, Filter and Sort Controls */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Role Filter */}
          <div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Roles</option>
              <option value="user">User</option>
              <option value="analyst">Analyst</option>
              <option value="editor">Editor</option>
              <option value="moderator">Moderator</option>
              <option value="auditor">Auditor</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Types</option>
              <option value="voter">Voter</option>
              <option value="individual_creator">Individual Creator</option>
              <option value="organization_creator">Organization Creator</option>
            </select>
          </div>

          {/* Subscription Filter */}
          <div>
            <select
              value={filterSubscription}
              onChange={(e) => setFilterSubscription(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Subscriptions</option>
              <option value="free">Free</option>
              <option value="subscribed">Subscribed</option>
            </select>
          </div>

          {/* Sort Options */}
          <div>
            <select
              value={`${sortBy}_${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('_');
                setSortBy(field);
                setSortOrder(order);
              }}
              className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="created_at_desc">Newest First</option>
              <option value="created_at_asc">Oldest First</option>
              <option value="name_asc">Name A-Z</option>
              <option value="name_desc">Name Z-A</option>
              <option value="last_active_desc">Recently Active</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <ArrowPathIcon className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-2" />
          <p className="text-gray-600">Loading users...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error: {error}</p>
          <button
            onClick={() => fetchUsers()}
            className="mt-2 text-red-600 hover:text-red-800 text-sm underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Users Table */}
      {!loading && !error && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <UsersIcon className="h-5 w-5 text-gray-400 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">
                  Users ({pagination.total})
                </h3>
              </div>
              <button
                onClick={() => fetchUsers()}
                className="text-gray-600 hover:text-gray-800"
                title="Refresh users"
              >
                <ArrowPathIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subscription
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Active
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {user.name || 'No Name'}
                        </div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                        {user.phone && (
                          <div className="text-xs text-gray-400">{user.phone}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(user.admin_role)}`}>
                        {user.admin_role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                      {user.user_type?.replace('_', ' ') || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.subscription_status === 'subscribed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.subscription_status || 'free'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.created_at ? formatDate(user.created_at) : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.last_active ? formatDate(user.last_active) : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleSelectUserForEdit(user)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit user"
                        >
                          <PencilSquareIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id, user.name || user.email)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete user"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Empty State */}
          {users.length === 0 && (
            <div className="text-center py-12">
              <UsersIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || filterRole !== 'all' || filterType !== 'all' || filterSubscription !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No users have been created yet.'
                }
              </p>
            </div>
          )}

          {/* Pagination */}
          {pagination.total > pagination.limit && (
            <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page * pagination.limit >= pagination.total}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing{' '}
                      <span className="font-medium">
                        {((pagination.page - 1) * pagination.limit) + 1}
                      </span>{' '}
                      to{' '}
                      <span className="font-medium">
                        {Math.min(pagination.page * pagination.limit, pagination.total)}
                      </span>{' '}
                      of{' '}
                      <span className="font-medium">{pagination.total}</span>{' '}
                      results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page <= 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                      >
                        <ChevronLeftIcon className="h-5 w-5" />
                      </button>
                      
                      {/* Page numbers */}
                      {Array.from({ length: Math.ceil(pagination.total / pagination.limit) }).map((_, index) => {
                        const pageNum = index + 1;
                        const isCurrentPage = pageNum === pagination.page;
                        
                        // Show first page, last page, current page, and pages around current
                        const totalPages = Math.ceil(pagination.total / pagination.limit);
                        const showPage = pageNum === 1 || 
                                        pageNum === totalPages || 
                                        Math.abs(pageNum - pagination.page) <= 1;
                        
                        if (!showPage) {
                          // Show ellipsis
                          if (pageNum === 2 && pagination.page > 4) {
                            return (
                              <span key={`ellipsis-${pageNum}`} className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                                ...
                              </span>
                            );
                          }
                          if (pageNum === totalPages - 1 && pagination.page < totalPages - 3) {
                            return (
                              <span key={`ellipsis-${pageNum}`} className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                                ...
                              </span>
                            );
                          }
                          return null;
                        }
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              isCurrentPage
                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      
                      <button
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page * pagination.limit >= pagination.total}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                      >
                        <ChevronRightIcon className="h-5 w-5" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserRoleManager;
// import React, { useState, useEffect } from 'react';
// import { useUserManagement } from '../../hooks/useUserManagement';
// import { toast } from 'react-hot-toast';
// import {
//   UsersIcon,
//   PencilSquareIcon,
//   TrashIcon,
//   MagnifyingGlassIcon,
//   FunnelIcon,
//   ArrowPathIcon,
//   ChevronLeftIcon,
//   ChevronRightIcon
// } from '@heroicons/react/24/outline';

// const UserRoleManager = () => {
//   const {
//     users,
//     pagination,
//     loading,
//     error,
//     fetchUsers,
//     updateUserRole,
//     deleteUser,
//     searchUsers,
//     setFilters
//   } = useUserManagement();

//   // Form state
//   const [selectedUserId, setSelectedUserId] = useState('');
//   const [selectedAdminRole, setSelectedAdminRole] = useState('');
//   const [selectedUserType, setSelectedUserType] = useState('');
//   const [selectedSubscription, setSelectedSubscription] = useState('');
//   const [isUpdatingRole, setIsUpdatingRole] = useState(false);

//   // Search and filter state
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterRole, setFilterRole] = useState('all');
//   const [filterType, setFilterType] = useState('all');
//   const [filterSubscription, setFilterSubscription] = useState('all');
//   const [sortBy, setSortBy] = useState('created_at');
//   const [sortOrder, setSortOrder] = useState('desc');

//   // Debounced search
//   const [searchDebounce, setSearchDebounce] = useState(null);

//   // Handle search with debouncing
//   useEffect(() => {
//     if (searchDebounce) {
//       clearTimeout(searchDebounce);
//     }

//     const timeout = setTimeout(() => {
//       if (searchTerm.trim()) {
//         searchUsers(searchTerm.trim());
//       } else {
//         applyFilters();
//       }
//     }, 500);

//     setSearchDebounce(timeout);

//     return () => {
//       if (searchDebounce) {
//         clearTimeout(searchDebounce);
//       }
//     };
//   }, [searchTerm]);

//   // Apply filters when filter options change
//   const applyFilters = () => {
//     const filters = {
//       ...(filterRole !== 'all' && { admin_role: filterRole }),
//       ...(filterType !== 'all' && { user_type: filterType }),
//       ...(filterSubscription !== 'all' && { subscription_status: filterSubscription }),
//       sort_by: sortBy,
//       sort_order: sortOrder
//     };

//     setFilters(filters);
//     fetchUsers(1, filters);
//   };

//   useEffect(() => {
//     if (!searchTerm.trim()) {
//       applyFilters();
//     }
//   }, [filterRole, filterType, filterSubscription, sortBy, sortOrder]);

//   // Handle role update
//   const handleUpdateUserRole = async () => {
//     if (!selectedUserId || !selectedAdminRole || !selectedUserType || !selectedSubscription) {
//       toast.error('Please fill all fields');
//       return;
//     }

//     try {
//       setIsUpdatingRole(true);
      
//       await updateUserRole(selectedUserId, {
//         adminRole: selectedAdminRole,
//         userType: selectedUserType,
//         subscriptionStatus: selectedSubscription
//       });
      
//       // Reset form
//       setSelectedUserId('');
//       setSelectedAdminRole('');
//       setSelectedUserType('');
//       setSelectedSubscription('');
      
//     } catch (error) {
//       console.error('Failed to update user role:', error);
//     } finally {
//       setIsUpdatingRole(false);
//     }
//   };

//   // Handle user deletion
//   const handleDeleteUser = async (userId, userName) => {
//     const confirmMessage = `Are you sure you want to delete user "${userName}"? This action cannot be undone.`;
    
//     if (window.confirm(confirmMessage)) {
//       try {
//         await deleteUser(userId);
//       } catch (error) {
//         console.error('Failed to delete user:', error);
//       }
//     }
//   };

//   // Handle pagination
//   const handlePageChange = (newPage) => {
//     fetchUsers(newPage);
//   };

//   // Handle user selection for editing
//   const handleSelectUserForEdit = (user) => {
//     setSelectedUserId(user.id);
//     setSelectedAdminRole(user.admin_role);
//     setSelectedUserType(user.user_type);
//     setSelectedSubscription(user.subscription_status);
    
//     // Scroll to form
//     document.getElementById('role-update-form')?.scrollIntoView({ 
//       behavior: 'smooth',
//       block: 'start'
//     });
//   };

//   // Role badge styling
//   const getRoleBadgeColor = (role) => {
//     const colors = {
//       user: 'bg-gray-100 text-gray-800',
//       analyst: 'bg-purple-100 text-purple-800',
//       editor: 'bg-blue-100 text-blue-800',
//       moderator: 'bg-green-100 text-green-800',
//       auditor: 'bg-orange-100 text-orange-800',
//       advertiser: 'bg-pink-100 text-pink-800',
//       admin: 'bg-red-100 text-red-800',
//       manager: 'bg-red-100 text-red-800'
//     };
//     return colors[role] || colors.user;
//   };

//   // Format date
//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   return (
//     <div className="space-y-6">
//       {/* Role Update Form */}
//       <div id="role-update-form" className="bg-gray-50 rounded-lg p-6">
//         <h4 className="font-medium text-gray-900 mb-4 flex items-center">
//           <PencilSquareIcon className="h-5 w-5 mr-2" />
//           Update User Role & Type
//         </h4>
        
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
//           <div>
//             <label htmlFor="selectUser" className="block text-sm font-medium text-gray-700 mb-2">
//               Select User
//             </label>
//             <select
//               id="selectUser"
//               value={selectedUserId}
//               onChange={(e) => setSelectedUserId(e.target.value)}
//               disabled={isUpdatingRole || loading}
//               className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100"
//             >
//               <option value="">Choose a user</option>
//               {users.map((user) => (
//                 <option key={user.id} value={user.id}>
//                   {user.name || user.email}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label htmlFor="selectRole" className="block text-sm font-medium text-gray-700 mb-2">
//               Admin Role
//             </label>
//             <select
//               id="selectRole"
//               value={selectedAdminRole}
//               onChange={(e) => setSelectedAdminRole(e.target.value)}
//               disabled={isUpdatingRole || loading}
//               className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100"
//             >
//               <option value="">Select Role</option>
//               <option value="user">User</option>
//               <option value="analyst">Analyst</option>
//               <option value="editor">Editor</option>
//               <option value="advertiser">Advertiser</option>
//               <option value="moderator">Moderator</option>
//               <option value="auditor">Auditor</option>
//               <option value="admin">Admin</option>
//               <option value="manager">Manager</option>
//             </select>
//           </div>

//           <div>
//             <label htmlFor="selectType" className="block text-sm font-medium text-gray-700 mb-2">
//               User Type
//             </label>
//             <select
//               id="selectType"
//               value={selectedUserType}
//               onChange={(e) => setSelectedUserType(e.target.value)}
//               disabled={isUpdatingRole || loading}
//               className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100"
//             >
//               <option value="">Select Type</option>
//               <option value="voter">Voter</option>
//               <option value="individual_creator">Individual Creator</option>
//               <option value="organization_creator">Organization Creator</option>
//             </select>
//           </div>

//           <div>
//             <label htmlFor="selectSubscription" className="block text-sm font-medium text-gray-700 mb-2">
//               Subscription
//             </label>
//             <select
//               id="selectSubscription"
//               value={selectedSubscription}
//               onChange={(e) => setSelectedSubscription(e.target.value)}
//               disabled={isUpdatingRole || loading}
//               className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100"
//             >
//               <option value="">Select Subscription</option>
//               <option value="free">Free</option>
//               <option value="subscribed">Subscribed</option>
//             </select>
//           </div>

//           <div className="flex items-end">
//             <button
//               onClick={handleUpdateUserRole}
//               disabled={isUpdatingRole || loading || !selectedUserId || !selectedAdminRole || !selectedUserType || !selectedSubscription}
//               className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center"
//             >
//               {isUpdatingRole ? (
//                 <>
//                   <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
//                   Updating...
//                 </>
//               ) : (
//                 'Update Role'
//               )}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Search, Filter and Sort Controls */}
//       <div className="bg-white rounded-lg border border-gray-200 p-4">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
//           {/* Search */}
//           <div className="lg:col-span-2">
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
//               </div>
//               <input
//                 type="text"
//                 placeholder="Search users..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
//               />
//             </div>
//           </div>

//           {/* Role Filter */}
//           <div>
//             <select
//               value={filterRole}
//               onChange={(e) => setFilterRole(e.target.value)}
//               className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//             >
//               <option value="all">All Roles</option>
//               <option value="user">User</option>
//               <option value="analyst">Analyst</option>
//               <option value="editor">Editor</option>
//               <option value="moderator">Moderator</option>
//               <option value="auditor">Auditor</option>
//               <option value="admin">Admin</option>
//               <option value="manager">Manager</option>
//             </select>
//           </div>

//           {/* Type Filter */}
//           <div>
//             <select
//               value={filterType}
//               onChange={(e) => setFilterType(e.target.value)}
//               className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//             >
//               <option value="all">All Types</option>
//               <option value="voter">Voter</option>
//               <option value="individual_creator">Individual Creator</option>
//               <option value="organization_creator">Organization Creator</option>
//             </select>
//           </div>

//           {/* Subscription Filter */}
//           <div>
//             <select
//               value={filterSubscription}
//               onChange={(e) => setFilterSubscription(e.target.value)}
//               className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//             >
//               <option value="all">All Subscriptions</option>
//               <option value="free">Free</option>
//               <option value="subscribed">Subscribed</option>
//             </select>
//           </div>

//           {/* Sort Options */}
//           <div>
//             <select
//               value={`${sortBy}_${sortOrder}`}
//               onChange={(e) => {
//                 const [field, order] = e.target.value.split('_');
//                 setSortBy(field);
//                 setSortOrder(order);
//               }}
//               className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//             >
//               <option value="created_at_desc">Newest First</option>
//               <option value="created_at_asc">Oldest First</option>
//               <option value="name_asc">Name A-Z</option>
//               <option value="name_desc">Name Z-A</option>
//               <option value="last_active_desc">Recently Active</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Loading State */}
//       {loading && (
//         <div className="text-center py-8">
//           <ArrowPathIcon className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-2" />
//           <p className="text-gray-600">Loading users...</p>
//         </div>
//       )}

//       {/* Error State */}
//       {error && (
//         <div className="bg-red-50 border border-red-200 rounded-lg p-4">
//           <p className="text-red-800">Error: {error}</p>
//           <button
//             onClick={() => fetchUsers()}
//             className="mt-2 text-red-600 hover:text-red-800 text-sm underline"
//           >
//             Try again
//           </button>
//         </div>
//       )}

//       {/* Users Table */}
//       {!loading && !error && (
//         <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
//           <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center">
//                 <UsersIcon className="h-5 w-5 text-gray-400 mr-2" />
//                 <h3 className="text-lg font-medium text-gray-900">
//                   Users ({pagination.total})
//                 </h3>
//               </div>
//               <button
//                 onClick={() => fetchUsers()}
//                 className="text-gray-600 hover:text-gray-800"
//                 title="Refresh users"
//               >
//                 <ArrowPathIcon className="h-5 w-5" />
//               </button>
//             </div>
//           </div>
          
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     User
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Role
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Type
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Subscription
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Created
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Last Active
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {users.map((user) => (
//                   <tr key={user.id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div>
//                         <div className="text-sm font-medium text-gray-900">
//                           {user.name || 'No Name'}
//                         </div>
//                         <div className="text-sm text-gray-500">{user.email}</div>
//                         {user.phone && (
//                           <div className="text-xs text-gray-400">{user.phone}</div>
//                         )}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(user.admin_role)}`}>
//                         {user.admin_role}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
//                       {user.user_type?.replace('_', ' ') || 'N/A'}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                         user.subscription_status === 'subscribed' 
//                           ? 'bg-green-100 text-green-800' 
//                           : 'bg-gray-100 text-gray-800'
//                       }`}>
//                         {user.subscription_status || 'free'}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {user.created_at ? formatDate(user.created_at) : 'N/A'}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {user.last_active ? formatDate(user.last_active) : 'N/A'}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                       <div className="flex space-x-2">
//                         <button
//                           onClick={() => handleSelectUserForEdit(user)}
//                           className="text-blue-600 hover:text-blue-900"
//                           title="Edit user"
//                         >
//                           <PencilSquareIcon className="h-4 w-4" />
//                         </button>
//                         <button
//                           onClick={() => handleDeleteUser(user.id, user.name || user.email)}
//                           className="text-red-600 hover:text-red-900"
//                           title="Delete user"
//                         >
//                           <TrashIcon className="h-4 w-4" />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
          
//           {/* Empty State */}
//           {users.length === 0 && (
//             <div className="text-center py-12">
//               <UsersIcon className="mx-auto h-12 w-12 text-gray-400" />
//               <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
//               <p className="mt-1 text-sm text-gray-500">
//                 {searchTerm || filterRole !== 'all' || filterType !== 'all' || filterSubscription !== 'all'
//                   ? 'Try adjusting your search or filter criteria.'
//                   : 'No users have been created yet.'
//                 }
//               </p>
//             </div>
//           )}

//           {/* Pagination */}
//           {pagination.total > pagination.limit && (
//             <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
//               <div className="flex items-center justify-between">
//                 <div className="flex-1 flex justify-between sm:hidden">
//                   <button
//                     onClick={() => handlePageChange(pagination.page - 1)}
//                     disabled={pagination.page <= 1}
//                     className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
//                   >
//                     Previous
//                   </button>
//                   <button
//                     onClick={() => handlePageChange(pagination.page + 1)}
//                     disabled={pagination.page * pagination.limit >= pagination.total}
//                     className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
//                   >
//                     Next
//                   </button>
//                 </div>
//                 <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
//                   <div>
//                     <p className="text-sm text-gray-700">
//                       Showing{' '}
//                       <span className="font-medium">
//                         {((pagination.page - 1) * pagination.limit) + 1}
//                       </span>{' '}
//                       to{' '}
//                       <span className="font-medium">
//                         {Math.min(pagination.page * pagination.limit, pagination.total)}
//                       </span>{' '}
//                       of{' '}
//                       <span className="font-medium">{pagination.total}</span>{' '}
//                       results
//                     </p>
//                   </div>
//                   <div>
//                     <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
//                       <button
//                         onClick={() => handlePageChange(pagination.page - 1)}
//                         disabled={pagination.page <= 1}
//                         className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
//                       >
//                         <ChevronLeftIcon className="h-5 w-5" />
//                       </button>
                      
//                       {/* Page numbers */}
//                       {Array.from({ length: Math.ceil(pagination.total / pagination.limit) }).map((_, index) => {
//                         const pageNum = index + 1;
//                         const isCurrentPage = pageNum === pagination.page;
                        
//                         // Show first page, last page, current page, and pages around current
//                         const totalPages = Math.ceil(pagination.total / pagination.limit);
//                         const showPage = pageNum === 1 || 
//                                         pageNum === totalPages || 
//                                         Math.abs(pageNum - pagination.page) <= 1;
                        
//                         if (!showPage) {
//                           // Show ellipsis
//                           if (pageNum === 2 && pagination.page > 4) {
//                             return (
//                               <span key={`ellipsis-${pageNum}`} className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
//                                 ...
//                               </span>
//                             );
//                           }
//                           if (pageNum === totalPages - 1 && pagination.page < totalPages - 3) {
//                             return (
//                               <span key={`ellipsis-${pageNum}`} className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
//                                 ...
//                               </span>
//                             );
//                           }
//                           return null;
//                         }
                        
//                         return (
//                           <button
//                             key={pageNum}
//                             onClick={() => handlePageChange(pageNum)}
//                             className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
//                               isCurrentPage
//                                 ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
//                                 : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
//                             }`}
//                           >
//                             {pageNum}
//                           </button>
//                         );
//                       })}
                      
//                       <button
//                         onClick={() => handlePageChange(pagination.page + 1)}
//                         disabled={pagination.page * pagination.limit >= pagination.total}
//                         className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
//                       >
//                         <ChevronRightIcon className="h-5 w-5" />
//                       </button>
//                     </nav>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default UserRoleManager;

//this is checking role from database

// import React, { useState, useEffect } from 'react';
// import { useUserManagement } from '../../hooks/useUserManagement';
// import { useAuth } from '../../contexts/AuthContext';
// import { toast } from 'react-hot-toast';
// import {
//   UsersIcon,
//   PencilSquareIcon,
//   TrashIcon,
//   MagnifyingGlassIcon,
//   FunnelIcon,
//   ArrowPathIcon,
//   ChevronLeftIcon,
//   ChevronRightIcon,
//   XMarkIcon,
//   EyeIcon,
//   UserPlusIcon
// } from '@heroicons/react/24/outline';

// const UserRoleManager = () => {
//   const { hasPermission} = useAuth();
  
//   const {
//     users,
//     pagination,
//     filters,
//     loading,
//     error,
//     updateUserRole,
//     deleteUser,
//     searchUsers,
//     applyFilters,
//     changePage,
//     changePageSize,
//     refreshUsers,
//     clearFilters,
//     getUserForEdit
//   } = useUserManagement();
// console.log("users====>", users)
//   // Form state
//   const [selectedUserId, setSelectedUserId] = useState('');
//   const [selectedAdminRole, setSelectedAdminRole] = useState('');
//   const [selectedUserType, setSelectedUserType] = useState('');
//   const [selectedSubscription, setSelectedSubscription] = useState('');
//   const [isUpdatingRole, setIsUpdatingRole] = useState(false);

//   // Local filter state for UI
//   const [localFilters, setLocalFilters] = useState({
//     role: 'all',
//     type: 'all',
//     subscription: 'all',
//     search: ''
//   });

//   // View state
//   const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
//   const [selectedUser, setSelectedUser] = useState(null); // For view details modal

//   // Debounce timer for search
//   const [searchTimeout, setSearchTimeout] = useState(null);

//   // Check permissions
//   const canManageUsers = hasPermission('manage_users');
//   const canViewUsers = hasPermission('view_analytics') || canManageUsers;

//   useEffect(() => {
//     if (!canViewUsers) {
//       toast.error('You do not have permission to view users');
//     }
//   }, [canViewUsers]);

//   // Handle search with debouncing
//   useEffect(() => {
//     if (searchTimeout) {
//       clearTimeout(searchTimeout);
//     }

//     const timeout = setTimeout(() => {
//       if (localFilters.search !== filters.search) {
//         searchUsers(localFilters.search);
//       }
//     }, 500);

//     setSearchTimeout(timeout);

//     return () => {
//       if (searchTimeout) {
//         clearTimeout(searchTimeout);
//       }
//     };
//   }, [localFilters.search, filters.search, searchUsers]);

//   // Handle filter changes
//   const handleFilterChange = (filterType, value) => {
//     const newFilters = { ...localFilters, [filterType]: value };
//     setLocalFilters(newFilters);
    
//     if (filterType !== 'search') {
//       applyFilters(newFilters);
//     }
//   };

//   // Handle role update with correct payload format
//   const handleUpdateUserRole = async () => {
//     if (!canManageUsers) {
//       toast.error('You do not have permission to manage users');
//       return;
//     }

//     if (!selectedUserId || !selectedAdminRole || !selectedUserType || !selectedSubscription) {
//       toast.error('Please fill all fields');
//       return;
//     }

//     try {
//       setIsUpdatingRole(true);
      
//       await updateUserRole(selectedUserId, {
//         userType: selectedUserType,
//         adminRole: selectedAdminRole,
//         subscriptionStatus: selectedSubscription
//       });
      
//       // Reset form
//       resetForm();
      
//     } catch (error) {
//       console.error('Failed to update user role:', error);
//     } finally {
//       setIsUpdatingRole(false);
//     }
//   };

//   // Handle user deletion
//   const handleDeleteUser = async (userId, userName) => {
//     if (!canManageUsers) {
//       toast.error('You do not have permission to manage users');
//       return;
//     }

//     const confirmMessage = `Are you sure you want to delete user "${userName}"? This action cannot be undone.`;
    
//     if (window.confirm(confirmMessage)) {
//       try {
//         await deleteUser(userId);
//       } catch (error) {
//         console.error('Failed to delete user:', error);
//       }
//     }
//   };

//   // Handle user selection for editing - CORRECTED to fetch profile first
//   const handleSelectUserForEdit = async (user) => {
//     if (!canManageUsers) {
//       toast.error('You do not have permission to edit users');
//       return;
//     }

//     try {
//       // Fetch complete profile data first
//       const fullProfile = await getUserForEdit(user.id);
      
//       setSelectedUserId(fullProfile.id);
//       setSelectedAdminRole(fullProfile.admin_role || '');
//       setSelectedUserType(fullProfile.user_type || '');
//       setSelectedSubscription(fullProfile.subscription_status || '');
      
//       // Scroll to form
//       document.getElementById('role-update-form')?.scrollIntoView({ 
//         behavior: 'smooth',
//         block: 'start'
//       });
//     } catch (error) {
//       // If profile fetch fails, fall back to basic user data
//       console.warn('Could not fetch full profile, using basic data:', error);
//       setSelectedUserId(user.id);
//       setSelectedAdminRole(user.admin_role || '');
//       setSelectedUserType(user.user_type || '');
//       setSelectedSubscription(user.subscription_status || '');
      
//       document.getElementById('role-update-form')?.scrollIntoView({ 
//         behavior: 'smooth',
//         block: 'start'
//       });
//     }
//   };

//   // View user details
//   const handleViewUser = (user) => {
//     setSelectedUser(user);
//   };

//   // Reset form
//   const resetForm = () => {
//     setSelectedUserId('');
//     setSelectedAdminRole('');
//     setSelectedUserType('');
//     setSelectedSubscription('');
//   };

//   // Clear all filters
//   const handleClearFilters = () => {
//     const defaultFilters = {
//       role: 'all',
//       type: 'all',
//       subscription: 'all',
//       search: ''
//     };
//     setLocalFilters(defaultFilters);
//     clearFilters();
//   };

//   // Role badge styling
//   const getRoleBadgeColor = (role) => {
//     const colors = {
//       user: 'bg-gray-100 text-gray-800',
//       analyst: 'bg-purple-100 text-purple-800',
//       editor: 'bg-blue-100 text-blue-800',
//       moderator: 'bg-green-100 text-green-800',
//       auditor: 'bg-orange-100 text-orange-800',
//       advertiser: 'bg-pink-100 text-pink-800',
//       admin: 'bg-red-100 text-red-800',
//       manager: 'bg-red-100 text-red-800'
//     };
//     return colors[role] || colors.user;
//   };

//   // Format date
//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     try {
//       return new Date(dateString).toLocaleDateString('en-US', {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric',
//         hour: '2-digit',
//         minute: '2-digit'
//       });
//     } catch {
//       return 'Invalid Date';
//     }
//   };

//   // Get user display name
//   const getUserDisplayName = (user) => {
//     return user.name || user.first_name || user.email || `User ${user.id}`;
//   };

//   // Permission check component
//   if (!canViewUsers) {
//     return (
//       <div className="text-center py-12">
//         <UsersIcon className="mx-auto h-12 w-12 text-gray-400" />
//         <h3 className="mt-2 text-sm font-medium text-gray-900">Access Denied</h3>
//         <p className="mt-1 text-sm text-gray-500">
//           You do not have permission to view users.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Page Header */}
//       <div className="md:flex md:items-center md:justify-between">
//         <div className="flex-1 min-w-0">
//           <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
//             User Management
//           </h2>
//           <p className="mt-1 text-sm text-gray-500">
//             Manage user roles, types, and subscriptions across the platform
//           </p>
//         </div>
//         <div className="mt-4 flex md:mt-0 md:ml-4">
//           <div className="flex rounded-md shadow-sm">
//             <button
//               type="button"
//               onClick={() => setViewMode('table')}
//               className={`relative inline-flex items-center px-4 py-2 rounded-l-md border text-sm font-medium focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
//                 viewMode === 'table'
//                   ? 'bg-blue-50 border-blue-500 text-blue-700'
//                   : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
//               }`}
//             >
//               Table
//             </button>
//             <button
//               type="button"
//               onClick={() => setViewMode('grid')}
//               className={`-ml-px relative inline-flex items-center px-4 py-2 rounded-r-md border text-sm font-medium focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
//                 viewMode === 'grid'
//                   ? 'bg-blue-50 border-blue-500 text-blue-700'
//                   : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
//               }`}
//             >
//               Grid
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Role Update Form */}
//       {canManageUsers && (
//         <div id="role-update-form" className="bg-gray-50 rounded-lg p-6">
//           <div className="flex items-center justify-between mb-4">
//             <h4 className="font-medium text-gray-900 flex items-center">
//               <PencilSquareIcon className="h-5 w-5 mr-2" />
//               Update User Role & Type
//             </h4>
//             {(selectedUserId || selectedAdminRole || selectedUserType || selectedSubscription) && (
//               <button
//                 onClick={resetForm}
//                 className="text-gray-500 hover:text-gray-700"
//                 title="Clear form"
//               >
//                 <XMarkIcon className="h-5 w-5" />
//               </button>
//             )}
//           </div>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
//             <div>
//               <label htmlFor="selectUser" className="block text-sm font-medium text-gray-700 mb-2">
//                 Select User
//               </label>
//               <select
//                 id="selectUser"
//                 value={selectedUserId}
//                 onChange={(e) => setSelectedUserId(e.target.value)}
//                 disabled={isUpdatingRole || loading}
//                 className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100"
//               >
//                 <option value="">Choose a user</option>
//                 {users.map((user) => (
//                   <option key={user.id} value={user.id}>
//                     {getUserDisplayName(user)}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label htmlFor="selectRole" className="block text-sm font-medium text-gray-700 mb-2">
//                 Admin Role
//               </label>
//               <select
//                 id="selectRole"
//                 value={selectedAdminRole}
//                 onChange={(e) => setSelectedAdminRole(e.target.value)}
//                 disabled={isUpdatingRole || loading}
//                 className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100"
//               >
//                 <option value="">Select Role</option>
//                 <option value="user">User</option>
//                 <option value="analyst">Analyst</option>
//                 <option value="editor">Editor</option>
//                 <option value="advertiser">Advertiser</option>
//                 <option value="moderator">Moderator</option>
//                 <option value="auditor">Auditor</option>
//                 <option value="admin">Admin</option>
//                 <option value="manager">Manager</option>
//               </select>
//             </div>

//             <div>
//               <label htmlFor="selectType" className="block text-sm font-medium text-gray-700 mb-2">
//                 User Type
//               </label>
//               <select
//                 id="selectType"
//                 value={selectedUserType}
//                 onChange={(e) => setSelectedUserType(e.target.value)}
//                 disabled={isUpdatingRole || loading}
//                 className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100"
//               >
//                 <option value="">Select Type</option>
//                 <option value="voter">Voter</option>
//                 <option value="individual_creator">Individual Creator</option>
//                 <option value="organization_creator">Organization Creator</option>
//               </select>
//             </div>

//             <div>
//               <label htmlFor="selectSubscription" className="block text-sm font-medium text-gray-700 mb-2">
//                 Subscription
//               </label>
//               <select
//                 id="selectSubscription"
//                 value={selectedSubscription}
//                 onChange={(e) => setSelectedSubscription(e.target.value)}
//                 disabled={isUpdatingRole || loading}
//                 className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100"
//               >
//                 <option value="">Select Subscription</option>
//                 <option value="free">Free</option>
//                 <option value="subscribed">Subscribed</option>
//               </select>
//             </div>

//             <div className="flex items-end">
//               <button
//                 onClick={handleUpdateUserRole}
//                 disabled={isUpdatingRole || loading || !selectedUserId || !selectedAdminRole || !selectedUserType || !selectedSubscription}
//                 className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center"
//               >
//                 {isUpdatingRole ? (
//                   <>
//                     <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
//                     Updating...
//                   </>
//                 ) : (
//                   'Update Role'
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Search and Filter Controls */}
//       <div className="bg-white rounded-lg border border-gray-200 p-4">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
//           {/* Search */}
//           <div className="lg:col-span-2">
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
//               </div>
//               <input
//                 type="text"
//                 placeholder="Search users by name or email..."
//                 value={localFilters.search}
//                 onChange={(e) => handleFilterChange('search', e.target.value)}
//                 className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
//               />
//             </div>
//           </div>

//           {/* Role Filter */}
//           <div>
//             <select
//               value={localFilters.role}
//               onChange={(e) => handleFilterChange('role', e.target.value)}
//               className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//             >
//               <option value="all">All Roles</option>
//               <option value="user">User</option>
//               <option value="analyst">Analyst</option>
//               <option value="editor">Editor</option>
//               <option value="moderator">Moderator</option>
//               <option value="auditor">Auditor</option>
//               <option value="admin">Admin</option>
//               <option value="manager">Manager</option>
//             </select>
//           </div>

//           {/* Type Filter */}
//           <div>
//             <select
//               value={localFilters.type}
//               onChange={(e) => handleFilterChange('type', e.target.value)}
//               className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//             >
//               <option value="all">All Types</option>
//               <option value="voter">Voter</option>
//               <option value="individual_creator">Individual Creator</option>
//               <option value="organization_creator">Organization Creator</option>
//             </select>
//           </div>

//           {/* Subscription Filter */}
//           <div>
//             <select
//               value={localFilters.subscription}
//               onChange={(e) => handleFilterChange('subscription', e.target.value)}
//               className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//             >
//               <option value="all">All Subscriptions</option>
//               <option value="free">Free</option>
//               <option value="subscribed">Subscribed</option>
//             </select>
//           </div>

//           {/* Actions */}
//           <div className="flex space-x-2">
//             <button
//               onClick={handleClearFilters}
//               className="flex-1 px-3 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg"
//             >
//               Clear
//             </button>
//             <button
//               onClick={refreshUsers}
//               disabled={loading}
//               className="px-3 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
//               title="Refresh users"
//             >
//               <ArrowPathIcon className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Loading State */}
//       {loading && (
//         <div className="text-center py-8">
//           <ArrowPathIcon className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-2" />
//           <p className="text-gray-600">Loading users...</p>
//         </div>
//       )}

//       {/* Error State */}
//       {error && (
//         <div className="bg-red-50 border border-red-200 rounded-lg p-4">
//           <div className="flex">
//             <div className="flex-shrink-0">
//               <XMarkIcon className="h-5 w-5 text-red-400" />
//             </div>
//             <div className="ml-3">
//               <h3 className="text-sm font-medium text-red-800">Error loading users</h3>
//               <div className="mt-2 text-sm text-red-700">
//                 <p>{error}</p>
//               </div>
//               <div className="mt-4">
//                 <button
//                   onClick={refreshUsers}
//                   className="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200"
//                 >
//                   Try again
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Users Display */}
//       {!loading && !error && (
//         <>
//           {viewMode === 'table' ? (
//             // Table View
//             <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
//               <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center">
//                     <UsersIcon className="h-5 w-5 text-gray-400 mr-2" />
//                     <h3 className="text-lg font-medium text-gray-900">
//                       Users ({pagination.total})
//                     </h3>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <select
//                       value={pagination.limit}
//                       onChange={(e) => changePageSize(parseInt(e.target.value))}
//                       className="text-sm border border-gray-300 rounded px-2 py-1"
//                     >
//                       <option value={10}>10 per page</option>
//                       <option value={20}>20 per page</option>
//                       <option value={50}>50 per page</option>
//                       <option value={100}>100 per page</option>
//                     </select>
//                   </div>
//                 </div>
//               </div>
              
//               <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         User
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Role
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Type
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Subscription
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Created
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Last Active
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Actions
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {users.map((user) => (
//                       <tr key={user.id} className="hover:bg-gray-50">
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="flex items-center">
//                             <div className="flex-shrink-0 h-10 w-10">
//                               <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
//                                 <span className="text-sm font-medium text-gray-700">
//                                   {getUserDisplayName(user).charAt(0).toUpperCase()}
//                                 </span>
//                               </div>
//                             </div>
//                             <div className="ml-4">
//                               <div className="text-sm font-medium text-gray-900">
//                                 {getUserDisplayName(user)}
//                               </div>
//                               <div className="text-sm text-gray-500">{user.email}</div>
//                               {user.phone && (
//                                 <div className="text-xs text-gray-400">{user.phone}</div>
//                               )}
//                             </div>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(user.admin_role)}`}>
//                             {user.admin_role || 'user'}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
//                           {user.user_type?.replace('_', ' ') || 'N/A'}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                             user.subscription_status === 'subscribed' 
//                               ? 'bg-green-100 text-green-800' 
//                               : 'bg-gray-100 text-gray-800'
//                           }`}>
//                             {user.subscription_status || 'free'}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                           {formatDate(user.created_at)}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                           {formatDate(user.last_active || user.updated_at)}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                           <div className="flex space-x-2">
//                             <button
//                               onClick={() => handleViewUser(user)}
//                               className="text-gray-600 hover:text-gray-900"
//                               title="View user details"
//                             >
//                               <EyeIcon className="h-4 w-4" />
//                             </button>
//                             {canManageUsers && (
//                               <>
//                                 <button
//                                   onClick={() => handleSelectUserForEdit(user)}
//                                   className="text-blue-600 hover:text-blue-900"
//                                   title="Edit user"
//                                 >
//                                   <PencilSquareIcon className="h-4 w-4" />
//                                 </button>
//                                 <button
//                                   onClick={() => handleDeleteUser(user.id, getUserDisplayName(user))}
//                                   className="text-red-600 hover:text-red-900"
//                                   title="Delete user"
//                                 >
//                                   <TrashIcon className="h-4 w-4" />
//                                 </button>
//                               </>
//                             )}
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           ) : (
//             // Grid View
//             <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
//               <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center">
//                     <UsersIcon className="h-5 w-5 text-gray-400 mr-2" />
//                     <h3 className="text-lg font-medium text-gray-900">
//                       Users ({pagination.total})
//                     </h3>
//                   </div>
//                   <select
//                     value={pagination.limit}
//                     onChange={(e) => changePageSize(parseInt(e.target.value))}
//                     className="text-sm border border-gray-300 rounded px-2 py-1"
//                   >
//                     <option value={10}>10 per page</option>
//                     <option value={20}>20 per page</option>
//                     <option value={50}>50 per page</option>
//                     <option value={100}>100 per page</option>
//                   </select>
//                 </div>
//               </div>
              
//               <div className="p-6">
//                 <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//                   {users.map((user) => (
//                     <div key={user.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
//                       <div className="flex items-center space-x-3">
//                         <div className="flex-shrink-0">
//                           <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
//                             <span className="text-sm font-medium text-gray-700">
//                               {getUserDisplayName(user).charAt(0).toUpperCase()}
//                             </span>
//                           </div>
//                         </div>
//                         <div className="min-w-0 flex-1">
//                           <p className="text-sm font-medium text-gray-900 truncate">
//                             {getUserDisplayName(user)}
//                           </p>
//                           <p className="text-sm text-gray-500 truncate">{user.email}</p>
//                         </div>
//                       </div>
                      
//                       <div className="mt-4 space-y-2">
//                         <div className="flex justify-between items-center">
//                           <span className="text-xs text-gray-500">Role:</span>
//                           <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(user.admin_role)}`}>
//                             {user.admin_role || 'user'}
//                           </span>
//                         </div>
                        
//                         <div className="flex justify-between items-center">
//                           <span className="text-xs text-gray-500">Type:</span>
//                           <span className="text-xs text-gray-900 capitalize">
//                             {user.user_type?.replace('_', ' ') || 'N/A'}
//                           </span>
//                         </div>
                        
//                         <div className="flex justify-between items-center">
//                           <span className="text-xs text-gray-500">Subscription:</span>
//                           <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                             user.subscription_status === 'subscribed' 
//                               ? 'bg-green-100 text-green-800' 
//                               : 'bg-gray-100 text-gray-800'
//                           }`}>
//                             {user.subscription_status || 'free'}
//                           </span>
//                         </div>
                        
//                         <div className="flex justify-between items-center">
//                           <span className="text-xs text-gray-500">Created:</span>
//                           <span className="text-xs text-gray-900">
//                             {formatDate(user.created_at)}
//                           </span>
//                         </div>
//                       </div>
                      
//                       <div className="mt-4 flex justify-end space-x-2">
//                         <button
//                           onClick={() => handleViewUser(user)}
//                           className="text-gray-600 hover:text-gray-900"
//                           title="View details"
//                         >
//                           <EyeIcon className="h-4 w-4" />
//                         </button>
//                         {canManageUsers && (
//                           <>
//                             <button
//                               onClick={() => handleSelectUserForEdit(user)}
//                               className="text-blue-600 hover:text-blue-900"
//                               title="Edit user"
//                             >
//                               <PencilSquareIcon className="h-4 w-4" />
//                             </button>
//                             <button
//                               onClick={() => handleDeleteUser(user.id, getUserDisplayName(user))}
//                               className="text-red-600 hover:text-red-900"
//                               title="Delete user"
//                             >
//                               <TrashIcon className="h-4 w-4" />
//                             </button>
//                           </>
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Empty State */}
//           {users.length === 0 && (
//             <div className="bg-white rounded-lg border border-gray-200">
//               <div className="text-center py-12">
//                 <UsersIcon className="mx-auto h-12 w-12 text-gray-400" />
//                 <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
//                 <p className="mt-1 text-sm text-gray-500">
//                   {localFilters.search || localFilters.role !== 'all' || localFilters.type !== 'all' || localFilters.subscription !== 'all'
//                     ? 'Try adjusting your search or filter criteria.'
//                     : 'No users have been created yet.'
//                   }
//                 </p>
//                 {localFilters.search || localFilters.role !== 'all' || localFilters.type !== 'all' || localFilters.subscription !== 'all' ? (
//                   <div className="mt-6">
//                     <button
//                       onClick={handleClearFilters}
//                       className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                     >
//                       Clear all filters
//                     </button>
//                   </div>
//                 ) : null}
//               </div>
//             </div>
//           )}

//           {/* Pagination */}
//           {pagination.totalPages > 1 && (
//             <div className="bg-white px-4 py-3 border border-gray-200 rounded-lg sm:px-6">
//               <div className="flex items-center justify-between">
//                 <div className="flex-1 flex justify-between sm:hidden">
//                   <button
//                     onClick={() => changePage(pagination.page - 1)}
//                     disabled={pagination.page <= 1}
//                     className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
//                   >
//                     Previous
//                   </button>
//                   <button
//                     onClick={() => changePage(pagination.page + 1)}
//                     disabled={pagination.page >= pagination.totalPages}
//                     className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
//                   >
//                     Next
//                   </button>
//                 </div>
//                 <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
//                   <div>
//                     <p className="text-sm text-gray-700">
//                       Showing{' '}
//                       <span className="font-medium">
//                         {((pagination.page - 1) * pagination.limit) + 1}
//                       </span>{' '}
//                       to{' '}
//                       <span className="font-medium">
//                         {Math.min(pagination.page * pagination.limit, pagination.total)}
//                       </span>{' '}
//                       of{' '}
//                       <span className="font-medium">{pagination.total}</span>{' '}
//                       results
//                     </p>
//                   </div>
//                   <div>
//                     <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
//                       <button
//                         onClick={() => changePage(pagination.page - 1)}
//                         disabled={pagination.page <= 1}
//                         className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
//                       >
//                         <span className="sr-only">Previous</span>
//                         <ChevronLeftIcon className="h-5 w-5" />
//                       </button>
                      
//                       {/* Page numbers */}
//                       {Array.from({ length: pagination.totalPages }).map((_, index) => {
//                         const pageNum = index + 1;
//                         const isCurrentPage = pageNum === pagination.page;
                        
//                         // Show first page, last page, current page, and pages around current
//                         const showPage = pageNum === 1 || 
//                                         pageNum === pagination.totalPages || 
//                                         Math.abs(pageNum - pagination.page) <= 1;
                        
//                         if (!showPage) {
//                           // Show ellipsis
//                           if (pageNum === 2 && pagination.page > 4) {
//                             return (
//                               <span key={`ellipsis-${pageNum}`} className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
//                                 ...
//                               </span>
//                             );
//                           }
//                           if (pageNum === pagination.totalPages - 1 && pagination.page < pagination.totalPages - 3) {
//                             return (
//                               <span key={`ellipsis-${pageNum}`} className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
//                                 ...
//                               </span>
//                             );
//                           }
//                           return null;
//                         }
                        
//                         return (
//                           <button
//                             key={pageNum}
//                             onClick={() => changePage(pageNum)}
//                             className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
//                               isCurrentPage
//                                 ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
//                                 : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
//                             }`}
//                           >
//                             {pageNum}
//                           </button>
//                         );
//                       })}
                      
//                       <button
//                         onClick={() => changePage(pagination.page + 1)}
//                         disabled={pagination.page >= pagination.totalPages}
//                         className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
//                       >
//                         <span className="sr-only">Next</span>
//                         <ChevronRightIcon className="h-5 w-5" />
//                       </button>
//                     </nav>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </>
//       )}

//       {/* User Details Modal */}
//       {selectedUser && (
//         <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
//           <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
//             <div className="mt-3">
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="text-lg font-medium text-gray-900">User Details</h3>
//                 <button
//                   onClick={() => setSelectedUser(null)}
//                   className="text-gray-400 hover:text-gray-600"
//                 >
//                   <XMarkIcon className="h-6 w-6" />
//                 </button>
//               </div>
              
//               <div className="space-y-4">
//                 <div className="flex items-center space-x-3">
//                   <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center">
//                     <span className="text-lg font-medium text-gray-700">
//                       {getUserDisplayName(selectedUser).charAt(0).toUpperCase()}
//                     </span>
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium text-gray-900">
//                       {getUserDisplayName(selectedUser)}
//                     </p>
//                     <p className="text-sm text-gray-500">{selectedUser.email}</p>
//                   </div>
//                 </div>
                
//                 <div className="border-t border-gray-200 pt-4">
//                   <dl className="space-y-3">
//                     <div className="flex justify-between">
//                       <dt className="text-sm font-medium text-gray-500">User ID:</dt>
//                       <dd className="text-sm text-gray-900">{selectedUser.id}</dd>
//                     </div>
                    
//                     <div className="flex justify-between">
//                       <dt className="text-sm font-medium text-gray-500">Role:</dt>
//                       <dd>
//                         <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(selectedUser.admin_role)}`}>
//                           {selectedUser.admin_role || 'user'}
//                         </span>
//                       </dd>
//                     </div>
                    
//                     <div className="flex justify-between">
//                       <dt className="text-sm font-medium text-gray-500">Type:</dt>
//                       <dd className="text-sm text-gray-900 capitalize">
//                         {selectedUser.user_type?.replace('_', ' ') || 'N/A'}
//                       </dd>
//                     </div>
                    
//                     <div className="flex justify-between">
//                       <dt className="text-sm font-medium text-gray-500">Subscription:</dt>
//                       <dd>
//                         <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                           selectedUser.subscription_status === 'subscribed' 
//                             ? 'bg-green-100 text-green-800' 
//                             : 'bg-gray-100 text-gray-800'
//                         }`}>
//                           {selectedUser.subscription_status || 'free'}
//                         </span>
//                       </dd>
//                     </div>
                    
//                     {selectedUser.phone && (
//                       <div className="flex justify-between">
//                         <dt className="text-sm font-medium text-gray-500">Phone:</dt>
//                         <dd className="text-sm text-gray-900">{selectedUser.phone}</dd>
//                       </div>
//                     )}
                    
//                     <div className="flex justify-between">
//                       <dt className="text-sm font-medium text-gray-500">Created:</dt>
//                       <dd className="text-sm text-gray-900">{formatDate(selectedUser.created_at)}</dd>
//                     </div>
                    
//                     <div className="flex justify-between">
//                       <dt className="text-sm font-medium text-gray-500">Last Active:</dt>
//                       <dd className="text-sm text-gray-900">{formatDate(selectedUser.last_active || selectedUser.updated_at)}</dd>
//                     </div>
//                   </dl>
//                 </div>
                
//                 {canManageUsers && (
//                   <div className="border-t border-gray-200 pt-4 flex space-x-3">
//                     <button
//                       onClick={() => {
//                         handleSelectUserForEdit(selectedUser);
//                         setSelectedUser(null);
//                       }}
//                       className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
//                     >
//                       Edit User
//                     </button>
//                     <button
//                       onClick={() => {
//                         handleDeleteUser(selectedUser.id, getUserDisplayName(selectedUser));
//                         setSelectedUser(null);
//                       }}
//                       className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
//                     >
//                       Delete User
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UserRoleManager;