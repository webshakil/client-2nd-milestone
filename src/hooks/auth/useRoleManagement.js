import { useState, useCallback, useRef } from 'react';
import { toast } from 'react-hot-toast';

export const useRoleManagement = (api3003, userData, dispatch) => {
  const [rolePermissions, setRolePermissions] = useState(null);
  const roleCheckInProgress = useRef(false);

  // Derive permissions from role
  const derivePermissionsFromRole = useCallback((adminRole) => {
    if (!adminRole || adminRole === 'user') return [];
    
    const rolePermissionMap = {
      'manager': [
        'manage_users', 'manage_elections', 'view_analytics', 
        'manage_content', 'view_audit', 'manage_ads', 'super_admin',
        'manage_subscriptions', 'manage_payments', 'system_config'
      ],
      'admin': [
        'manage_users', 'manage_elections', 'view_analytics', 
        'manage_content', 'view_audit', 'manage_ads', 'super_admin',
        'manage_subscriptions', 'manage_payments'
      ],
      'moderator': ['manage_elections', 'manage_content', 'view_analytics'],
      'auditor': ['view_audit', 'view_analytics', 'audit_elections'],
      'editor': ['manage_content', 'edit_elections'],
      'advertiser': ['manage_ads', 'view_analytics', 'campaign_management'],
      'analyst': ['view_analytics', 'export_data', 'generate_reports']
    };
    
    return rolePermissionMap[adminRole.toLowerCase()] || [];
  }, []);

  // Fetch role permissions
  const fetchRolePermissions = useCallback(async (userId = null, forceRefresh = false) => {
    const targetUserId = userId || userData?.id;
    if (!targetUserId || roleCheckInProgress.current) return null;

    if (!forceRefresh && rolePermissions && rolePermissions.userData?.id === targetUserId) {
      return rolePermissions;
    }

    try {
      roleCheckInProgress.current = true;
      
      const response = await api3003(`/api/users/profile/${targetUserId}`, {
        method: 'GET'
      });

      if (response?.success && response?.data) {
        if (!userId || userId === userData?.id) {
          dispatch({ type: 'SET_USER_DATA', payload: response.data });
          localStorage.setItem('vottery_user_data', JSON.stringify(response.data));
        }
        
        const permissions = derivePermissionsFromRole(response.data.admin_role);
        const roleData = {
          admin_role: response.data.admin_role,
          user_type: response.data.user_type,
          subscription_status: response.data.subscription_status,
          permissions: permissions,
          userData: response.data
        };
        
        if (!userId || userId === userData?.id) {
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
  }, [api3003, derivePermissionsFromRole, userData?.id, rolePermissions, dispatch]);

  // Role check functions
  const isAdmin = useCallback(() => {
    const currentRole = rolePermissions?.admin_role || userData?.admin_role;
    if (!currentRole) return false;
    
    const superAdminRoles = ['manager', 'admin'];
    return superAdminRoles.includes(currentRole.toLowerCase());
  }, [rolePermissions, userData]);

  const hasPermission = useCallback((permission) => {
    const permissions = rolePermissions?.permissions || derivePermissionsFromRole(userData?.admin_role);
    return permissions?.includes(permission) || false;
  }, [rolePermissions, userData, derivePermissionsFromRole]);

  const getUserRole = useCallback(() => {
    return rolePermissions?.admin_role || userData?.admin_role || 'user';
  }, [rolePermissions, userData]);

  const getDashboardRoute = useCallback(() => {
    const role = (rolePermissions?.admin_role || userData?.admin_role || 'user').toLowerCase();
    
    switch (role) {
      case 'manager':
        return '/admin/super-dashboard';
      case 'admin':
        return '/admin/dashboard';
      case 'moderator':
        return '/admin/moderation';
      case 'auditor':
        return '/admin/audit';
      case 'editor':
        return '/admin/content';
      case 'advertiser':
        return '/admin/campaigns';
      case 'analyst':
        return '/analytics';
      default:
        return '/dashboard';
    }
  }, [rolePermissions, userData]);

  const updateUserRole = useCallback(async (userId, newRole, newType = null) => {
    try {
      const canManage = hasPermission('manage_users');
      if (!canManage) {
        throw new Error('Insufficient permissions to manage users');
      }

      const allowedAdminRoles = ['manager', 'admin', 'moderator', 'auditor', 'editor', 'advertiser', 'analyst', 'user'];
      //const allowedUserTypes = ['Individual Election Creators', 'Organization Election Creators', 'Voters'];
      
      if (!allowedAdminRoles.includes(newRole.toLowerCase())) {
        throw new Error('Invalid admin role specified');
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
        
        if (userId === userData?.id) {
          await fetchRolePermissions(null, true);
        }
        
        return response;
      }
      throw new Error(response?.message || 'Failed to update user role');
    } catch (error) {
      console.error('Update user role error:', error);
      toast.error(error.message);
      throw error;
    }
  }, [hasPermission, api3003, userData?.id, fetchRolePermissions]);

  return {
    rolePermissions,
    setRolePermissions,
    fetchRolePermissions,
    isAdmin,
    hasPermission,
    getUserRole,
    getDashboardRoute,
    updateUserRole,
    derivePermissionsFromRole
  };
};