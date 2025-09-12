import { TokenManager } from './tokenManager';

// Request deduplication cache
const requestCache = new Map();
const CACHE_DURATION = 30000; // 30 seconds

export const createApiRequest = (BASE) => {
  return async (endpoint, options = {}) => {
    const isAbsolute = /^https?:\/\//i.test(endpoint);
    const url = isAbsolute ? endpoint : `${BASE}${endpoint}`;

    // Check cache for GET requests to prevent duplicate calls
    if (options.method === 'GET' || !options.method) {
      const cacheKey = `${url}_${JSON.stringify(options.body || {})}`;
      const cached = requestCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        console.log('Returning cached response for:', url);
        return cached.data;
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
        // Handle rate limiting with exponential backoff
        if (response.status === 429) {
          console.warn('Rate limited, using cached data if available');
          const cacheKey = `${url}_${JSON.stringify(options.body || {})}`;
          const cached = requestCache.get(cacheKey);
          if (cached) {
            return cached.data;
          }
          throw new Error('Rate limited and no cached data available');
        }
        
        const error = new Error((data && data.message) || `HTTP error! status: ${response.status}`);
        error.response = { data };
        throw error;
      }

      // Cache successful GET responses
      if (config.method === 'GET' || !config.method) {
        const cacheKey = `${url}_${JSON.stringify(options.body || {})}`;
        requestCache.set(cacheKey, { data, timestamp: Date.now() });
      }

      return data;
    } catch (error) {
      console.error(`API request failed for ${url}:`, error);
      if (error.response) throw error;
      throw new Error('Network error. Please check your connection and try again.');
    }
  };
};

export const clearApiCache = () => {
  requestCache.clear();
};