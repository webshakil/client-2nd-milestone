import { TokenManager } from '../../utils/auth/tokenManager';
import { RequestCache } from '../../utils/auth/requestCache';

export const createApiRequest = (BASE) => {
  return async (endpoint, options = {}) => {
    const isAbsolute = /^https?:\/\//i.test(endpoint);
    const url = isAbsolute ? endpoint : `${BASE}${endpoint}`;

    // Check cache for GET requests
    if (options.method === 'GET' || !options.method) {
      const cacheKey = RequestCache.createCacheKey(url, options.body);
      const cached = RequestCache.get(cacheKey);
      if (cached) {
        console.log('Returning cached response for:', url);
        return cached;
      }
    }

    const config = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'X-Referrer': typeof document !== 'undefined' ? document.referrer : '',
        ...(options.headers || {})
      },
      ...options
    };

    // Add Authorization header if access token exists
    const accessToken = TokenManager.getAccessToken();
    if (accessToken && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        if (response.status === 429) {
          console.warn('Rate limited, using cached data if available');
          const cacheKey = RequestCache.createCacheKey(url, options.body);
          const cached = RequestCache.get(cacheKey);
          if (cached) return cached;
          throw new Error('Rate limited and no cached data available');
        }
        
        const error = new Error((data && data.message) || `HTTP error! status: ${response.status}`);
        error.response = { data };
        throw error;
      }

      // Cache successful GET responses
      if (config.method === 'GET' || !config.method) {
        const cacheKey = RequestCache.createCacheKey(url, options.body);
        RequestCache.set(cacheKey, data);
      }

      return data;
    } catch (error) {
      console.error(`API request failed for ${url}:`, error);
      if (error.response) throw error;
      throw new Error('Network error. Please check your connection and try again.');
    }
  };
};