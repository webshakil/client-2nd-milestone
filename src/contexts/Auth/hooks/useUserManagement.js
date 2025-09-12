import { useCallback, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { derivePermissionsFromRole, canManageUsers } from '../utils/roleManagement';

export const useUserManagement = (api3003, state, dispatch, setRolePermissions) => {
  const roleCheckInProgress = useRef(false);

  // Fetch fresh role permissions from database
  const fetchRolePermissionsCallback = useCallback(async (userId = null, forceRefresh = false, rolePermissions) => {
    const targetUserId = userId || state.userData?.id;
    if (!targetUserId || roleCheckInProgress.current) return null;

    // Use cached data unless force refresh is requested
    if (!forceRefresh && rolePermissions && rolePermissions.userData?.id === targetUserId) {
      return rolePermissions;
    }

    try {
      roleCheckInProgress.current = true;
      
      const response = await api3003(`/api/users/profile/${targetUserId}`, {
        method: 'GET'
      });

      if (response?.success && response?.data) {
        // Update user data if fetching current user
        if (!userId || userId === state.userData?.id) {
          dispatch({ type: 'SET_USER_DATA', payload: response.data });
          localStorage.setItem('vottery_user_data', JSON.stringify(response.data));
        }
        
        // Extract role permissions from database
        const permissions = derivePermissionsFromRole(response.data.admin_role);
        const roleData = {
          admin_role: response.data.admin_role,
          user_type: response.data.user_type,
          subscription_status: response.data.subscription_status,
          permissions: permissions,
          userData: response.data
        };
        
        if (!userId || userId === state.userData?.id) {
          setRolePermissions(roleData);
        }
        
        return roleData;
      }
      return null;
    } catch (error) {
      console.error('Failed to fetch role permissions:', error);
      return null;
    } finally {
      roleCheckInProgress.current = false;
    }
  }, [api3003, state.userData?.id, setRolePermissions]);

  // Enhanced user role update with database validation
  const updateUserRole = useCallback(async (userId, newRole, newType = null, rolePermissions) => {
    try {
      // Check if current user can manage users
      const canManage = canManageUsers(rolePermissions?.admin_role || state.userData?.admin_role);
      if (!canManage) {
        throw new Error('Insufficient permissions to manage users');
      }

      // Validate the new role against milestone document roles
      const allowedAdminRoles = ['manager', 'admin', 'moderator', 'auditor', 'editor', 'advertiser', 'analyst', 'user'];
      const allowedUserTypes = ['Individual Election Creators', 'Organization Election Creators', 'Voters'];
      
      if (!allowedAdminRoles.includes(newRole.toLowerCase())) {
        throw new Error('Invalid admin role specified');
      }
      
      if (newType && !allowedUserTypes.includes(newType)) {
        throw new Error('Invalid user type specified');
      }

      const response = await api3003(`/api/users/role/${userId}`, {
        method: 'PATCH',
        body: {
          admin_role: newRole,
          ...(newType && { user_type: newType })
        }
      });

      if (response?.success) {
        toast.success('User role updated successfully');
        
        // Refresh role permissions if updating current user
        if (userId === state.userData?.id) {
          await fetchRolePermissionsCallback(null, true, rolePermissions); // Force refresh
        }
        
        return response;
      }
      throw new Error(response?.message || 'Failed to update user role');
    } catch (error) {
      console.error('Update user role error:', error);
      toast.error(error.message);
      throw error;
    }
  }, [api3003, state.userData?.id, fetchRolePermissionsCallback]);

  // Update user role and type with subscription (for dropdown functionality)
  const updateUserRoleAndType = useCallback(async (userId, adminRole, userType, subscriptionStatus, rolePermissions) => {
    try {
      // Check if current user can manage users
      const canManage = canManageUsers(rolePermissions?.admin_role || state.userData?.admin_role);
      if (!canManage) {
        throw new Error('Insufficient permissions to manage users');
      }

      // Validate inputs
      const allowedAdminRoles = ['analyst', 'editor', 'advertiser', 'moderator', 'auditor', 'admin', 'manager'];
      const allowedUserTypes = ['voter', 'individual_creator', 'organization_creator'];
      const allowedSubscriptions = ['free', 'subscribed'];
      
      if (!allowedAdminRoles.includes(adminRole.toLowerCase())) {
        throw new Error('Invalid admin role specified');
      }
      
      if (!allowedUserTypes.includes(userType.toLowerCase())) {
        throw new Error('Invalid user type specified');
      }

      if (!allowedSubscriptions.includes(subscriptionStatus.toLowerCase())) {
        throw new Error('Invalid subscription status specified');
      }

      const response = await api3003(`/api/users/role/${userId}`, {
        method: 'PATCH',
        body: {
          user_type: userType,
          admin_role: adminRole,
          subscription_status: subscriptionStatus
        }
      });

      if (response?.success) {
        toast.success('User role and type updated successfully');
        
        // Refresh role permissions if updating current user
        if (userId === state.userData?.id) {
          await fetchRolePermissionsCallback(null, true, rolePermissions); // Force refresh
        }
        
        return response;
      }
      throw new Error(response?.message || 'Failed to update user role and type');
    } catch (error) {
      console.error('Update user role and type error:', error);
      toast.error(error.message);
      throw error;
    }
  }, [api3003, state.userData?.id, fetchRolePermissionsCallback]);

  return {
    fetchRolePermissions: fetchRolePermissionsCallback,
    updateUserRole,
    updateUserRoleAndType
  };
};