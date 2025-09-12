import { useState, useEffect, useCallback } from 'react';
import { userService } from '../services/user/userService.js';
import { toast } from 'react-hot-toast';

export const useUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  // Filters state
  const [filters, setFilters] = useState({
    role: 'all',
    type: 'all',
    subscription: 'all',
    search: ''
  });

  // Request deduplication
  const [activeRequests, setActiveRequests] = useState(new Set());

  // Create a unique request key
  const createRequestKey = useCallback((operation, params = {}) => {
    return `${operation}_${JSON.stringify(params)}`;
  }, []);

  // Check if request is already in progress
  const isRequestActive = useCallback((requestKey) => {
    return activeRequests.has(requestKey);
  }, [activeRequests]);

  // Mark request as active
  const setRequestActive = useCallback((requestKey) => {
    setActiveRequests(prev => new Set([...prev, requestKey]));
  }, []);

  // Mark request as complete
  const setRequestComplete = useCallback((requestKey) => {
    setActiveRequests(prev => {
      const newSet = new Set(prev);
      newSet.delete(requestKey);
      return newSet;
    });
  }, []);

  // Enhanced fetch users with deduplication and better error handling
  const fetchUsers = useCallback(async (page = pagination.page, newFilters = {}) => {
    const currentFilters = { ...filters, ...newFilters };
    const requestKey = createRequestKey('fetchUsers', { page, filters: currentFilters });
    
    // Prevent duplicate requests
    if (isRequestActive(requestKey)) {
      console.log('Request already in progress, skipping duplicate');
      return;
    }

    try {
      setRequestActive(requestKey);
      setLoading(true);
      setError(null);

      // Build API filters (exclude 'all' values)
      const apiFilters = {};
      if (currentFilters.role !== 'all') {
        apiFilters.admin_role = currentFilters.role;
      }
      if (currentFilters.type !== 'all') {
        apiFilters.user_type = currentFilters.type;
      }
      if (currentFilters.subscription !== 'all') {
        apiFilters.subscription_status = currentFilters.subscription;
      }

      let response;
      
      // Use search endpoint if there's a search term
      if (currentFilters.search && currentFilters.search.trim()) {
        response = await userService.searchUsers(
          currentFilters.search.trim(),
          page,
          pagination.limit
        );
      } else {
        response = await userService.getAllUsers(page, pagination.limit, apiFilters);
      }

      if (response?.success) {
        setUsers(response.data || []);
        setPagination({
          page: response.page || page,
          limit: response.limit || pagination.limit,
          total: response.total || 0,
          totalPages: response.totalPages || Math.ceil((response.total || 0) / (response.limit || pagination.limit))
        });
        
        // Update filters state if new filters were applied
        if (Object.keys(newFilters).length > 0) {
          setFilters(currentFilters);
        }
      } else {
        // Handle non-success response
        console.warn('Non-success response:', response);
        setUsers([]);
        setPagination(prev => ({ ...prev, total: 0, totalPages: 0 }));
        
        const errorMessage = response?.message || 'Failed to fetch users';
        setError(errorMessage);
        
        // Only show toast for actual errors, not empty results
        if (response?.message && !response?.message.includes('No users found')) {
          toast.error(errorMessage);
        }
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
      const errorMessage = err.message || 'Failed to fetch users';
      setError(errorMessage);
      setUsers([]);
      setPagination(prev => ({ ...prev, total: 0, totalPages: 0 }));
      
      // Check if it's an authentication error
      if (err.message.includes('Authentication') || err.message.includes('401')) {
        toast.error('Session expired. Please log in again.');
        // Emit logout event
        window.dispatchEvent(new CustomEvent('auth:logout', { 
          detail: { reason: 'authentication_failed' } 
        }));
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
      setRequestComplete(requestKey);
    }
  }, [pagination.page, pagination.limit, filters, createRequestKey, isRequestActive, setRequestActive, setRequestComplete]);

  // Update user role with enhanced error handling
  const updateUserRole = useCallback(async (userId, roleData) => {
    const requestKey = createRequestKey('updateUserRole', { userId, roleData });
    
    if (isRequestActive(requestKey)) {
      console.log('Update already in progress for this user');
      return;
    }

    try {
      setRequestActive(requestKey);
      setLoading(true);
      
      const response = await userService.updateUserRole(userId, roleData);
      
      if (response?.success) {
        // Update local state optimistically
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user.id === userId 
              ? { 
                  ...user, 
                  admin_role: roleData.adminRole,
                  user_type: roleData.userType,
                  subscription_status: roleData.subscriptionStatus,
                  updated_at: new Date().toISOString()
                }
              : user
          )
        );
        
        toast.success('User role updated successfully');
        return response;
      } else {
        throw new Error(response?.message || 'Failed to update user role');
      }
    } catch (err) {
      console.error('Failed to update user role:', err);
      const errorMessage = err.message || 'Failed to update user role';
      
      if (errorMessage.includes('Authentication') || errorMessage.includes('Insufficient permissions')) {
        toast.error('You do not have permission to perform this action');
      } else {
        toast.error(errorMessage);
      }
      
      throw err;
    } finally {
      setLoading(false);
      setRequestComplete(requestKey);
    }
  }, [createRequestKey, isRequestActive, setRequestActive, setRequestComplete]);

  // Delete user with enhanced error handling
  const deleteUser = useCallback(async (userId) => {
    const requestKey = createRequestKey('deleteUser', { userId });
    
    if (isRequestActive(requestKey)) {
      console.log('Delete already in progress for this user');
      return;
    }

    try {
      setRequestActive(requestKey);
      setLoading(true);
      
      const response = await userService.deleteUser(userId);
      
      if (response?.success) {
        // Remove from local state
        setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
        
        // Update pagination if needed
        const newTotal = pagination.total - 1;
        const newTotalPages = Math.ceil(newTotal / pagination.limit);
        
        setPagination(prev => ({
          ...prev,
          total: newTotal,
          totalPages: newTotalPages,
          // If current page is now empty and not the first page, go to previous page
          page: prev.page > newTotalPages && newTotalPages > 0 ? newTotalPages : prev.page
        }));
        
        toast.success('User deleted successfully');
        return response;
      } else {
        throw new Error(response?.message || 'Failed to delete user');
      }
    } catch (err) {
      console.error('Failed to delete user:', err);
      const errorMessage = err.message || 'Failed to delete user';
      
      if (errorMessage.includes('Authentication') || errorMessage.includes('Insufficient permissions')) {
        toast.error('You do not have permission to perform this action');
      } else {
        toast.error(errorMessage);
      }
      
      throw err;
    } finally {
      setLoading(false);
      setRequestComplete(requestKey);
    }
  }, [pagination, createRequestKey, isRequestActive, setRequestActive, setRequestComplete]);

  // Apply filters
  const applyFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
    fetchUsers(1, newFilters);
  }, [fetchUsers]);

  // Search users
  const searchUsers = useCallback((searchTerm) => {
    applyFilters({ search: searchTerm });
  }, [applyFilters]);

  // Change page
  const changePage = useCallback((newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages && newPage !== pagination.page) {
      setPagination(prev => ({ ...prev, page: newPage }));
      fetchUsers(newPage);
    }
  }, [fetchUsers, pagination.totalPages, pagination.page]);

  // Change page size
  const changePageSize = useCallback((newLimit) => {
    setPagination(prev => ({ ...prev, limit: newLimit, page: 1 }));
    fetchUsers(1);
  }, [fetchUsers]);

  // Refresh users
  const refreshUsers = useCallback(() => {
    // Clear the service cache to ensure fresh data
    userService.clearCache();
    fetchUsers(pagination.page);
  }, [fetchUsers, pagination.page]);

  // Clear filters
  const clearFilters = useCallback(() => {
    const defaultFilters = {
      role: 'all',
      type: 'all',
      subscription: 'all',
      search: ''
    };
    setFilters(defaultFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchUsers(1, defaultFilters);
  }, [fetchUsers]);

  // Get user details for editing (with profile data)
  const getUserForEdit = useCallback(async (userId) => {
    const requestKey = createRequestKey('getUserForEdit', { userId });
    
    if (isRequestActive(requestKey)) {
      console.log('Get user for edit already in progress');
      return;
    }

    try {
      setRequestActive(requestKey);
      
      const response = await userService.getUserProfile(userId);
      if (response?.success && response?.data) {
        return response.data;
      }
      throw new Error(response?.message || 'Failed to get user details');
    } catch (err) {
      console.error('Failed to get user for edit:', err);
      
      if (err.message.includes('Authentication')) {
        toast.error('Session expired. Please log in again.');
        window.dispatchEvent(new CustomEvent('auth:logout', { 
          detail: { reason: 'authentication_failed' } 
        }));
      } else {
        toast.error('Could not load user details for editing');
      }
      throw err;
    } finally {
      setRequestComplete(requestKey);
    }
  }, [createRequestKey, isRequestActive, setRequestActive, setRequestComplete]);

  // Get user statistics
  const getUserStats = useCallback(async () => {
    const requestKey = createRequestKey('getUserStats');
    
    if (isRequestActive(requestKey)) {
      return;
    }

    try {
      setRequestActive(requestKey);
      
      const response = await userService.getUserStats();
      return response;
    } catch (err) {
      console.error('Failed to get user stats:', err);
      toast.error('Failed to load user statistics');
      throw err;
    } finally {
      setRequestComplete(requestKey);
    }
  }, [createRequestKey, isRequestActive, setRequestActive, setRequestComplete]);

  // Bulk operations
  const bulkUpdateUsers = useCallback(async (userUpdates) => {
    const requestKey = createRequestKey('bulkUpdateUsers', { count: userUpdates.length });
    
    if (isRequestActive(requestKey)) {
      return;
    }

    try {
      setRequestActive(requestKey);
      setLoading(true);
      
      const response = await userService.bulkUpdateUsers(userUpdates);
      
      if (response?.success) {
        toast.success(`Successfully updated ${userUpdates.length} users`);
        // Refresh the user list
        refreshUsers();
        return response;
      } else {
        throw new Error(response?.message || 'Bulk update failed');
      }
    } catch (err) {
      console.error('Failed to bulk update users:', err);
      toast.error(err.message || 'Failed to update users');
      throw err;
    } finally {
      setLoading(false);
      setRequestComplete(requestKey);
    }
  }, [createRequestKey, isRequestActive, setRequestActive, setRequestComplete, refreshUsers]);

  // Export users
  const exportUsers = useCallback(async (exportFilters = {}, format = 'csv') => {
    const requestKey = createRequestKey('exportUsers', { exportFilters, format });
    
    if (isRequestActive(requestKey)) {
      return;
    }

    try {
      setRequestActive(requestKey);
      setLoading(true);
      
      const response = await userService.exportUsers(exportFilters, format);
      
      if (response?.success) {
        toast.success('Export completed successfully');
        return response;
      } else {
        throw new Error(response?.message || 'Export failed');
      }
    } catch (err) {
      console.error('Failed to export users:', err);
      toast.error(err.message || 'Failed to export users');
      throw err;
    } finally {
      setLoading(false);
      setRequestComplete(requestKey);
    }
  }, [createRequestKey, isRequestActive, setRequestActive, setRequestComplete]);

  // Toggle user status (activate/deactivate)
  const toggleUserStatus = useCallback(async (userId, isActive) => {
    const requestKey = createRequestKey('toggleUserStatus', { userId, isActive });
    
    if (isRequestActive(requestKey)) {
      return;
    }

    try {
      setRequestActive(requestKey);
      
      const response = await userService.toggleUserStatus(userId, isActive);
      
      if (response?.success) {
        // Update local state
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user.id === userId 
              ? { ...user, is_active: isActive, updated_at: new Date().toISOString() }
              : user
          )
        );
        
        toast.success(`User ${isActive ? 'activated' : 'deactivated'} successfully`);
        return response;
      } else {
        throw new Error(response?.message || 'Failed to update user status');
      }
    } catch (err) {
      console.error('Failed to toggle user status:', err);
      toast.error(err.message || 'Failed to update user status');
      throw err;
    } finally {
      setRequestComplete(requestKey);
    }
  }, [createRequestKey, isRequestActive, setRequestActive, setRequestComplete]);

  // Initial load with error handling
  useEffect(() => {
    let isMounted = true;
    
    const loadInitialData = async () => {
      try {
        if (isMounted) {
          await fetchUsers();
        }
      } catch (error) {
        if (isMounted) {
          console.error('Failed to load initial data:', error);
        }
      }
    };

    loadInitialData();
    
    return () => {
      isMounted = false;
    };
  }, []); // Only run on mount

  // Listen for auth logout events
  useEffect(() => {
    const handleAuthLogout = () => {
      setUsers([]);
      setError('Authentication required');
      setLoading(false);
    };

    window.addEventListener('auth:logout', handleAuthLogout);
    
    return () => {
      window.removeEventListener('auth:logout', handleAuthLogout);
    };
  }, []);

  return {
    // Data
    users,
    pagination,
    filters,
    
    // Loading states
    loading,
    error,
    
    // Core actions
    fetchUsers,
    updateUserRole,
    deleteUser,
    searchUsers,
    applyFilters,
    changePage,
    changePageSize,
    refreshUsers,
    clearFilters,
    getUserForEdit,
    
    // Additional actions
    getUserStats,
    bulkUpdateUsers,
    exportUsers,
    toggleUserStatus,
    
    // Setters for direct state manipulation if needed
    setUsers,
    setFilters,
    setPagination,
    setError,
    
    // Request management
    activeRequests: Array.from(activeRequests),
    isRequestActive
  };
};


// import { useState, useEffect, useCallback } from 'react';
// import { userService } from '../services/user/userService.js';
// import { toast } from 'react-hot-toast';

// export const useUserManagement = () => {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [pagination, setPagination] = useState({
//     page: 1,
//     limit: 10,
//     total: 0,
//     totalPages: 0
//   });

//   // Filters state
//   const [filters, setFilters] = useState({
//     role: 'all',
//     type: 'all',
//     subscription: 'all',
//     search: ''
//   });

//   // Fetch users with current filters and pagination
//   const fetchUsers = useCallback(async (page = pagination.page, newFilters = {}) => {
//     try {
//       setLoading(true);
//       setError(null);

//       // Combine current filters with new ones
//       const currentFilters = { ...filters, ...newFilters };
      
//       // Build API filters (exclude 'all' values)
//       const apiFilters = {};
//       if (currentFilters.role !== 'all') {
//         apiFilters.admin_role = currentFilters.role;
//       }
//       if (currentFilters.type !== 'all') {
//         apiFilters.user_type = currentFilters.type;
//       }
//       if (currentFilters.subscription !== 'all') {
//         apiFilters.subscription_status = currentFilters.subscription;
//       }

//       let response;
      
//       // Use search endpoint if there's a search term
//       if (currentFilters.search && currentFilters.search.trim()) {
//         response = await userService.searchUsers(
//           currentFilters.search.trim(),
//           page,
//           pagination.limit
//         );
//       } else {
//         response = await userService.getAllUsers(page, pagination.limit, apiFilters);
//       }

//       if (response?.success) {
//         setUsers(response.data || []);
//         setPagination({
//           page: response.page || page,
//           limit: response.limit || pagination.limit,
//           total: response.total || 0,
//           totalPages: response.totalPages || Math.ceil((response.total || 0) / (response.limit || pagination.limit))
//         });
//       } else {
//         throw new Error(response?.message || 'Failed to fetch users');
//       }
//     } catch (err) {
//       console.error('Failed to fetch users:', err);
//       setError(err.message);
//       toast.error(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }, [pagination.page, pagination.limit, filters]);

//   // Update user role
//   const updateUserRole = useCallback(async (userId, roleData) => {
//     try {
//       setLoading(true);
//       const response = await userService.updateUserRole(userId, roleData);
      
//       if (response?.success) {
//         // Update local state
//         setUsers(prevUsers => 
//           prevUsers.map(user => 
//             user.id === userId 
//               ? { 
//                   ...user, 
//                   admin_role: roleData.adminRole,
//                   user_type: roleData.userType,
//                   subscription_status: roleData.subscriptionStatus,
//                   updated_at: new Date().toISOString()
//                 }
//               : user
//           )
//         );
        
//         toast.success('User role updated successfully');
//         return response;
//       } else {
//         throw new Error(response?.message || 'Failed to update user role');
//       }
//     } catch (err) {
//       console.error('Failed to update user role:', err);
//       toast.error(err.message);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   // Delete user
//   const deleteUser = useCallback(async (userId) => {
//     try {
//       setLoading(true);
//       const response = await userService.deleteUser(userId);
      
//       if (response?.success) {
//         // Remove from local state
//         setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
        
//         // Update pagination if needed
//         const newTotal = pagination.total - 1;
//         const newTotalPages = Math.ceil(newTotal / pagination.limit);
        
//         setPagination(prev => ({
//           ...prev,
//           total: newTotal,
//           totalPages: newTotalPages,
//           // If current page is now empty and not the first page, go to previous page
//           page: prev.page > newTotalPages && newTotalPages > 0 ? newTotalPages : prev.page
//         }));
        
//         toast.success('User deleted successfully');
//         return response;
//       } else {
//         throw new Error(response?.message || 'Failed to delete user');
//       }
//     } catch (err) {
//       console.error('Failed to delete user:', err);
//       toast.error(err.message);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   }, [pagination]);

//   // Apply filters
//   const applyFilters = useCallback((newFilters) => {
//     setFilters(prev => ({ ...prev, ...newFilters }));
//     setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
//     fetchUsers(1, newFilters);
//   }, [fetchUsers]);

//   // Search users
//   const searchUsers = useCallback((searchTerm) => {
//     applyFilters({ search: searchTerm });
//   }, [applyFilters]);

//   // Change page
//   const changePage = useCallback((newPage) => {
//     if (newPage >= 1 && newPage <= pagination.totalPages) {
//       setPagination(prev => ({ ...prev, page: newPage }));
//       fetchUsers(newPage);
//     }
//   }, [fetchUsers, pagination.totalPages]);

//   // Change page size
//   const changePageSize = useCallback((newLimit) => {
//     setPagination(prev => ({ ...prev, limit: newLimit, page: 1 }));
//     fetchUsers(1);
//   }, [fetchUsers]);

//   // Refresh users
//   const refreshUsers = useCallback(() => {
//     fetchUsers(pagination.page);
//   }, [fetchUsers, pagination.page]);

//   // Clear filters
//   const clearFilters = useCallback(() => {
//     const defaultFilters = {
//       role: 'all',
//       type: 'all',
//       subscription: 'all',
//       search: ''
//     };
//     setFilters(defaultFilters);
//     setPagination(prev => ({ ...prev, page: 1 }));
//     fetchUsers(1, defaultFilters);
//   }, [fetchUsers]);

//   // Initial load
//   useEffect(() => {
//     fetchUsers();
//   }, []); // Only run on mount

//   // Get user details for editing (with profile data)
//   const getUserForEdit = useCallback(async (userId) => {
//     try {
//       const response = await userService.getUserProfile(userId);
//       if (response?.success && response?.data) {
//         return response.data;
//       }
//       throw new Error(response?.message || 'Failed to get user details');
//     } catch (err) {
//       console.error('Failed to get user for edit:', err);
//       toast.error('Could not load user details for editing');
//       throw err;
//     }
//   }, []);

//   return {
//     // Data
//     users,
//     pagination,
//     filters,
    
//     // Loading states
//     loading,
//     error,
    
//     // Actions
//     fetchUsers,
//     updateUserRole,
//     deleteUser,
//     searchUsers,
//     applyFilters,
//     changePage,
//     changePageSize,
//     refreshUsers,
//     clearFilters,
//     getUserForEdit, // New method
    
//     // Setters for direct state manipulation if needed
//     setUsers,
//     setFilters,
//     setPagination
//   };
// };