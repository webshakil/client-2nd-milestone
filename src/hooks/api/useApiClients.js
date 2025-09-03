import { useCallback } from 'react';
import { createApiRequest } from '../../services/api/apiClient';

export const useApiClients = () => {
  const API_BASE_3001 = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:3001';
  const API_BASE_3002 = import.meta.env?.VITE_BIOMETRIC_API_BASE_URL || 'http://localhost:3002';
  const API_BASE_3003 = import.meta.env?.VITE_USER_MANAGEMENT_API_BASE_URL || 'http://localhost:3003';

  const api3001 = useCallback(createApiRequest(API_BASE_3001), [API_BASE_3001]);
  const api3002 = useCallback(createApiRequest(API_BASE_3002), [API_BASE_3002]);
  const api3003 = useCallback(createApiRequest(API_BASE_3003), [API_BASE_3003]);

  return { api3001, api3002, api3003 };
};