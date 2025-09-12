import { useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { TokenManager } from '../utils/tokenManager';
import { derivePermissionsFromRole } from '../utils/roleManagement';

export const useProfileActions = (state, dispatch, api3003, createSession, setRolePermissions) => {
  // STEP 7: Complete Profile Creation
  const completeProfileCreation = useCallback(async (profileData, getUserId) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      if (!state.biometricVerified || !state.fallbackSetupComplete) {
        throw new Error('Authentication and fallback security setup must be completed first');
      }

      let userId = state.userId;
      if (!userId) {
        userId = await getUserId();
        if (!userId) throw new Error('Failed to get user ID');
      }

      const response = await api3003('/api/users/create', {
        method: 'POST',
        body: {
          user_id: userId,
          sngine_email: state.email,
          sngine_phone: state.phone,
          ...profileData,
          referrer: document.referrer,
          timestamp: Date.now()
        }
      });

      if (response?.success && response?.accessToken && response?.refreshToken) {
        TokenManager.setTokens(
          response.accessToken,
          response.refreshToken,
          response.tokenExpiry
        );

        localStorage.setItem('vottery_user_data', JSON.stringify(response.data));

        dispatch({ type: 'SET_USER_DATA', payload: response.data });
        dispatch({ type: 'SET_PROFILE_CREATED', payload: true });
        dispatch({ type: 'SET_AUTHENTICATED', payload: true });

        const sessionData = {
          userId: response.data.id,
          email: response.data.sngine_email,
          phone: response.data.sngine_phone,
          userType: response.data.user_type,
          adminRole: response.data.admin_role,
          subscriptionStatus: response.data.subscription_status,
          authenticated: true,
          profileCreated: true,
          timestamp: Date.now()
        };

        createSession(sessionData);
        
        // Set role permissions from response data
        const permissions = derivePermissionsFromRole(response.data.admin_role);
        setRolePermissions({
          admin_role: response.data.admin_role,
          user_type: response.data.user_type,
          subscription_status: response.data.subscription_status,
          permissions: permissions,
          userData: response.data
        });
        
        toast.success('Profile created successfully! Welcome to Vottery!');
        return response;
      }

      throw new Error(response?.message || 'Profile creation failed');
    } catch (error) {
      console.error('Profile creation error:', error);
      const errorMessage = error?.message || 'Profile creation failed';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      toast.error(errorMessage);
      throw new Error(errorMessage);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.biometricVerified, state.fallbackSetupComplete, state.userId, state.email, state.phone, api3003, createSession, setRolePermissions, dispatch]);

  // Fetch user profile with role validation
  const fetchUserProfile = useCallback(async (userId = null, forceRefresh = false, rolePermissions) => {
    const targetUserId = userId || state.userData?.id;
    if (!targetUserId) throw new Error('No user ID available');

    // Use cached data unless force refresh
    if (!forceRefresh && rolePermissions && rolePermissions.userData?.id === targetUserId) {
      return rolePermissions.userData;
    }

    try {
      const response = await api3003(`/api/users/profile/${targetUserId}`, {
        method: 'GET'
      });

      if (response?.success && response?.data) {
        // If fetching current user's profile, update state and permissions
        if (!userId || userId === state.userData?.id) {
          dispatch({ type: 'SET_USER_DATA', payload: response.data });
          localStorage.setItem('vottery_user_data', JSON.stringify(response.data));
          
          // Update role permissions
          const permissions = derivePermissionsFromRole(response.data.admin_role);
          setRolePermissions({
            admin_role: response.data.admin_role,
            user_type: response.data.user_type,
            subscription_status: response.data.subscription_status,
            permissions: permissions,
            userData: response.data
          });
        }
        return response.data;
      }
      throw new Error(response?.message || 'Failed to fetch user profile');
    } catch (error) {
      console.error('Fetch user profile error:', error);
      throw error;
    }
  }, [api3003, state.userData?.id, setRolePermissions, dispatch]);

  return {
    completeProfileCreation,
    fetchUserProfile
  };
};