import React, { useReducer,  useRef, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { AuthContext } from './AuthContext';
import { authReducer } from './authReducer';
import { initialAuthState, AUTH_ACTIONS } from './authTypes';
//import { useSecurity } from '../security/SecurityContext';
import { useApiClients } from '../../hooks/api/useApiClients';
import { useRoleManagement } from '../../hooks/auth/useRoleManagement';
//import { useAuthSteps } from '../../hooks/auth/useAuthSteps';
//import { useBiometric } from '../../hooks/auth/useBiometric';
import { useSecurityQuestions } from '../../hooks/auth/useSecurityQuestions';
import { useTokenManagement } from '../../hooks/auth/useTokenManagement';
import { TokenManager } from '../../utils/auth/tokenManager';
import { RequestCache } from '../../utils/auth/requestCache';

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);
  const securityContext = useSecurityQuestions();
  const hasInitialized = useRef(false);

  // API clients
  const { api3001, api3002, api3003 } = useApiClients();

  // Role management
  const roleManagement = useRoleManagement(api3003, state.userData, dispatch);

  // Auth steps
  const authSteps = useAuthSteps(api3001, state, dispatch);

  // Biometric
  const biometric = useBiometric(api3002, state, dispatch);

  // Security questions
  const securityQuestions = useSecurityQuestions(api3003, state, dispatch);

  // Token management
  const tokenManagement = useTokenManagement(api3003);

  // Safe access to security functions
  const {
    checkReferrer = () => ({ isValid: false, referrer: '', error: 'Security context unavailable' }),
    encryptData = (data) => JSON.stringify(data),
 
    clearSession = () => {}
  } = securityContext || {};

  // Initialize auth state on mount
  useEffect(() => {
    if (hasInitialized.current) return;
    
    const checkExistingAuth = () => {
      const accessToken = TokenManager.getAccessToken();
      const userData = localStorage.getItem('vottery_user_data');
      
      if (accessToken && !TokenManager.isTokenExpired() && userData) {
        try {
          const parsedUserData = JSON.parse(userData);
          dispatch({ type: AUTH_ACTIONS.SET_USER_DATA, payload: parsedUserData });
          dispatch({ type: AUTH_ACTIONS.SET_USER_ID, payload: parsedUserData.id });
          dispatch({ type: AUTH_ACTIONS.SET_EMAIL, payload: parsedUserData.sngine_email });
          dispatch({ type: AUTH_ACTIONS.SET_PHONE, payload: parsedUserData.sngine_phone });
          dispatch({ type: AUTH_ACTIONS.SET_EMAIL_VERIFIED, payload: true });
          dispatch({ type: AUTH_ACTIONS.SET_PHONE_VERIFIED, payload: true });
          dispatch({ type: AUTH_ACTIONS.SET_BIOMETRIC_VERIFIED, payload: true });
          dispatch({ type: AUTH_ACTIONS.SET_PROFILE_CREATED, payload: true });
          dispatch({ type: AUTH_ACTIONS.SET_SECURITY_QUESTIONS_SETUP, payload: true });
          dispatch({ type: AUTH_ACTIONS.SET_AUTHENTICATED, payload: true });
          
          // Set role permissions
          const permissions = roleManagement.derivePermissionsFromRole(parsedUserData.admin_role);
          roleManagement.setRolePermissions({
            admin_role: parsedUserData.admin_role,
            user_type: parsedUserData.user_type,
            subscription_status: parsedUserData.subscription_status,
            permissions: permissions,
            userData: parsedUserData
          });
          /* eslint-disable */
        } catch (error) {
          console.warn('Failed to parse user data, clearing tokens');
          TokenManager.clearTokens();
        }
      }
    };

    // Check referrer
    try {
      const referrerInfo = checkReferrer();
      dispatch({ type: AUTH_ACTIONS.SET_REFERRER_VALID, payload: referrerInfo.isValid, referrerInfo });

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
      dispatch({ type: AUTH_ACTIONS.SET_REFERRER_VALID, payload: false, referrerInfo: { error: error.message } });
    }

    checkExistingAuth();
    hasInitialized.current = true;
  }, [checkReferrer, encryptData, roleManagement]);

  // Logout function
  const logout = useCallback(() => {
    TokenManager.clearTokens();
    clearSession();
    sessionStorage.removeItem('vottery_referrer_validation');
    roleManagement.setRolePermissions(null);
    hasInitialized.current = false;
    RequestCache.clear();
    dispatch({ type: AUTH_ACTIONS.RESET_AUTH });
    toast.success('Logged out successfully');
  }, [clearSession, roleManagement]);

  // Reset auth
  const resetAuth = useCallback(() => {
    TokenManager.clearTokens();
    roleManagement.setRolePermissions(null);
    hasInitialized.current = false;
    RequestCache.clear();
    dispatch({ type: AUTH_ACTIONS.RESET_AUTH });
  }, [roleManagement]);

  // Context value
  const value = {
    ...state,
    dispatch,
    // Auth steps
    ...authSteps,
    // Biometric
    ...biometric,
    // Security questions
    ...securityQuestions,
    // Token management
    ...tokenManagement,
    // Role management
    ...roleManagement,
    // Utils
    logout,
    resetAuth,
    getAccessToken: TokenManager.getAccessToken,
    getRefreshToken: TokenManager.getRefreshToken,
    isTokenExpired: TokenManager.isTokenExpired
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};