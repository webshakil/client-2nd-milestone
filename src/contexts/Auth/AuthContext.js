import React, { createContext, useContext, useReducer, useCallback, useEffect, useState, useRef } from 'react';
import { toast } from 'react-hot-toast';

// Import all the utilities and hooks
import { useSecurity } from './SecurityContext';
import { TokenManager } from './utils/tokenManager';
import { createApiRequest, clearApiCache } from './utils/apiManager';
import { authReducer, initialState } from './reducers/authReducer';
import { 
  derivePermissionsFromRole, 
  getDashboardRoute, 
  isAdmin, 
  isSuperAdmin, 
  canManageUsers, 
  hasPermission 
} from './utils/roleManagement';
import { useAuthActions } from './hooks/useAuthActions';
import { useProfileActions } from './hooks/useProfileActions';
import { useUserManagement } from './hooks/useUserManagement';

const AuthContext = createContext();

/*eslint-disable*/
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const [rolePermissions, setRolePermissions] = useState(null);
  const securityContext = useSecurity();
  const hasInitialized = useRef(false);

  // Safe access to security functions with fallbacks
  const {
    checkReferrer = () => ({ isValid: false, referrer: '', error: 'Security context unavailable' }),
    encryptData = (data) => JSON.stringify(data),
    decryptData = (data) => JSON.parse(data),
    generateDeviceFingerprint = () => Promise.resolve('fallback-fingerprint'),
    createSession = () => {},
    clearSession = () => {}
  } = securityContext || {};

  // API endpoints
  const API_BASE_3001 = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:3001';
  const API_BASE_3002 = import.meta.env?.VITE_BIOMETRIC_API_BASE_URL || 'http://localhost:3002';
  const API_BASE_3003 = import.meta.env?.VITE_USER_MANAGEMENT_API_BASE_URL|| 'http://localhost:3003';

  const api3001 = useCallback(createApiRequest(API_BASE_3001), [API_BASE_3001]);
  const api3002 = useCallback(createApiRequest(API_BASE_3002), [API_BASE_3002]);
  const api3003 = useCallback(createApiRequest(API_BASE_3003), [API_BASE_3003]);

  // Get User ID from check-user endpoint
  const getUserId = useCallback(async () => {
    try {
      const response = await api3001('/api/auth/check-user', {
        body: {
          email: state.email,
          phone: state.phone,
        }
      });
      
      if (response?.success && response?.userId) {
        dispatch({ type: 'SET_USER_ID', payload: response.userId });
        return response.userId;
      }
      throw new Error(response?.message || 'Failed to get user ID');
    } catch (error) {
      console.error('Get user ID error:', error);
      throw error;
    }
  }, [state.email, state.phone, api3001]);

  // Initialize custom hooks
  const authActions = useAuthActions(state, dispatch, api3001, api3002, api3003, getUserId, generateDeviceFingerprint);
  const profileActions = useProfileActions(state, dispatch, api3003, createSession, setRolePermissions);
  const userManagement = useUserManagement(api3003, state, dispatch, setRolePermissions);

  // Token refresh utility with rotation
  const refreshAccessToken = useCallback(async () => {
    try {
      const refreshToken = TokenManager.getRefreshToken();
      if (!refreshToken) throw new Error('No refresh token available');

      const response = await api3003('/api/auth/refresh', {
        method: 'POST',
        body: { refreshToken }
      });

      if (response?.success && response?.accessToken && response?.refreshToken) {
        TokenManager.setTokens(
          response.accessToken,
          response.refreshToken,
          response.tokenExpiry
        );
        return response.accessToken;
      }

      throw new Error('Token refresh failed');
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
      throw error;
    }
  }, [api3003]);

  // Check existing authentication on load (runs only once)
  useEffect(() => {
    if (hasInitialized.current) return;
    
    const checkExistingAuth = () => {
      const accessToken = TokenManager.getAccessToken();
      const userData = localStorage.getItem('vottery_user_data');
      
      if (accessToken && !TokenManager.isTokenExpired() && userData) {
        try {
          const parsedUserData = JSON.parse(userData);
          dispatch({ type: 'SET_USER_DATA', payload: parsedUserData });
          dispatch({ type: 'SET_USER_ID', payload: parsedUserData.id });
          dispatch({ type: 'SET_EMAIL', payload: parsedUserData.sngine_email });
          dispatch({ type: 'SET_PHONE', payload: parsedUserData.sngine_phone });
          dispatch({ type: 'SET_EMAIL_VERIFIED', payload: true });
          dispatch({ type: 'SET_PHONE_VERIFIED', payload: true });
          dispatch({ type: 'SET_BIOMETRIC_VERIFIED', payload: true });
          dispatch({ type: 'SET_PROFILE_CREATED', payload: true });
          dispatch({ type: 'SET_SECURITY_QUESTIONS_SETUP', payload: true });
          dispatch({ type: 'SET_AUTHENTICATED', payload: true });
          
          // Set role permissions from cached data
          const permissions = derivePermissionsFromRole(parsedUserData.admin_role);
          setRolePermissions({
            admin_role: parsedUserData.admin_role,
            user_type: parsedUserData.user_type,
            subscription_status: parsedUserData.subscription_status,
            permissions: permissions,
            userData: parsedUserData
          });
          
        } catch (error) {
          console.warn('Failed to parse user data, clearing tokens');
          TokenManager.clearTokens();
        }
      }
    };

    checkExistingAuth();
    hasInitialized.current = true;
  }, []); // Empty dependency array - runs only once

  // Referrer check (runs only once)
  useEffect(() => {
    if (hasInitialized.current) return;
    
    try {
      const referrerInfo = checkReferrer();
      dispatch({ type: 'SET_REFERRER_VALID', payload: referrerInfo.isValid, referrerInfo });

      if (referrerInfo.isValid) {
        const validationData = encryptData({
          referrer: referrerInfo.referrer,
          timestamp: Date.now(),
          validated: true
        });
        sessionStorage.setItem('vottery_referrer_validation', validationData);
      }
    } catch (error) {
      console.warn('Referrer check failed:', error);
      dispatch({ type: 'SET_REFERRER_VALID', payload: false, referrerInfo: { error: error.message } });
    }
  }, [checkReferrer, encryptData]);

  // Navigation helpers
  const goBackStep = useCallback(() => {
    if (state.currentStep === 2) dispatch({ type: 'SET_STEP', payload: 1 });
    else if (state.currentStep === 4) dispatch({ type: 'SET_STEP', payload: 3 });
    else if (state.currentStep === 5) dispatch({ type: 'SET_STEP', payload: 4 });
    else if (state.currentStep === 6) dispatch({ type: 'SET_STEP', payload: 5 });
    else if (state.currentStep === 'security-questions') dispatch({ type: 'SET_STEP', payload: 4 });
  }, [state.currentStep]);

  const logout = useCallback(() => {
    TokenManager.clearTokens();
    clearSession();
    sessionStorage.removeItem('vottery_referrer_validation');
    setRolePermissions(null);
    hasInitialized.current = false;
    clearApiCache(); // Clear API cache
    dispatch({ type: 'RESET_AUTH' });
    toast.success('Logged out successfully');
  }, [clearSession]);

  const resetAuth = useCallback(() => {
    TokenManager.clearTokens();
    setRolePermissions(null);
    hasInitialized.current = false;
    clearApiCache(); // Clear API cache
    dispatch({ type: 'RESET_AUTH' });
  }, []);

  // Role functions using cached data
  const isAdminUser = useCallback(() => {
    const currentRole = rolePermissions?.admin_role || state.userData?.admin_role;
    return isAdmin(currentRole);
  }, [rolePermissions, state.userData]);

  const isSuperAdminUser = useCallback(() => {
    const currentRole = rolePermissions?.admin_role || state.userData?.admin_role;
    return isSuperAdmin(currentRole);
  }, [rolePermissions, state.userData]);

  const canManageUsersCheck = useCallback(() => {
    const currentRole = rolePermissions?.admin_role || state.userData?.admin_role;
    return canManageUsers(currentRole);
  }, [rolePermissions, state.userData]);

  const hasPermissionCheck = useCallback((permission) => {
    const currentRole = rolePermissions?.admin_role || state.userData?.admin_role;
    return hasPermission(currentRole, permission);
  }, [rolePermissions, state.userData]);

  const getUserRole = useCallback(() => {
    return rolePermissions?.admin_role || state.userData?.admin_role || 'user';
  }, [rolePermissions, state.userData]);

  const getUserType = useCallback(() => {
    return rolePermissions?.user_type || state.userData?.user_type || 'voter';
  }, [rolePermissions, state.userData]);

  const getSubscriptionStatus = useCallback(() => {
    return rolePermissions?.subscription_status || state.userData?.subscription_status || 'free';
  }, [rolePermissions, state.userData]);

  const getDashboardRouteForUser = useCallback(() => {
    const role = rolePermissions?.admin_role || state.userData?.admin_role || 'user';
    return getDashboardRoute(role);
  }, [rolePermissions, state.userData]);

  // Auto refresh token before expiry
  useEffect(() => {
    const accessToken = TokenManager.getAccessToken();
    const tokenExpiry = localStorage.getItem('vottery_token_expiry');
    
    if (accessToken && tokenExpiry && !TokenManager.isTokenExpired()) {
      try {
        /*eslint-disable*/
        const expiryData = JSON.parse(tokenExpiry);
        const expiryTime = new Date().getTime() + (7 * 24 * 60 * 60 * 1000);
        const refreshTime = expiryTime - Date.now() - 60000;

        if (refreshTime > 0) {
          const timeout = setTimeout(() => {
            refreshAccessToken().catch(console.error);
          }, refreshTime);

          return () => clearTimeout(timeout);
        }
        /*eslint-disable*/
      } catch (error) {
        console.warn('Failed to parse token expiry, clearing tokens');
        TokenManager.clearTokens();
      }
    }
  }, [refreshAccessToken]);

  // Context value with all functionality
  const value = {
    ...state,
    dispatch,
    
    // Auth actions
    ...authActions,
    
    // Profile actions
    ...profileActions,
    
    // User management
    ...userManagement,
    
    // Utility functions
    getUserId,
    refreshAccessToken,
    goBackStep,
    logout,
    resetAuth,
    
    // Token utilities
    getAccessToken: TokenManager.getAccessToken,
    getRefreshToken: TokenManager.getRefreshToken,
    isTokenExpired: TokenManager.isTokenExpired,
    
    // Role functions
    isAdmin: isAdminUser,
    isSuperAdmin: isSuperAdminUser,
    canManageUsers: canManageUsersCheck,
    getUserRole,
    getUserType,
    getSubscriptionStatus,
    hasPermission: hasPermissionCheck,
    getDashboardRoute: getDashboardRouteForUser,
    rolePermissions
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};