// BaseService.js - Fixed CORS issue by removing X-Referrer header
class BaseService {
  constructor(serviceType = 'default') {
    this.serviceType = serviceType;
    
    // API base URLs mapping
    this.baseUrls = {
      auth: import.meta.env?.VITE_API_BASE_URL || 'http://localhost:3001',
      biometric: import.meta.env?.VITE_BIOMETRIC_API_BASE_URL || 'http://localhost:3002', 
      user: import.meta.env?.VITE_USER_MANAGEMENT_API_BASE_URL || 'http://localhost:3003',
      election: import.meta.env?.VITE_ELECTION_API_BASE_URL || 'http://localhost:3004', // Added election
      default: import.meta.env?.VITE_USER_MANAGEMENT_API_BASE_URL || 'http://localhost:3003'
    };
    
    this.baseUrl = this.baseUrls[serviceType] || this.baseUrls.default;
    
    // Request cache for deduplication
    this.requestCache = new Map();
    this.CACHE_DURATION = 30000; // 30 seconds
    
    // Track refresh attempts to prevent infinite loops
    this.refreshInProgress = false;
    this.maxRetryAttempts = 3;
  }

  // Token management utilities
  getTokens() {
    return {
      accessToken: localStorage.getItem('vottery_access_token'),
      refreshToken: localStorage.getItem('vottery_refresh_token'),
      tokenExpiry: localStorage.getItem('vottery_token_expiry'),
      tokenTimestamp: localStorage.getItem('vottery_token_timestamp')
    };
  }

  setTokens(accessToken, refreshToken, expiryInfo) {
    localStorage.setItem('vottery_access_token', accessToken);
    localStorage.setItem('vottery_refresh_token', refreshToken);
    localStorage.setItem('vottery_token_expiry', JSON.stringify(expiryInfo));
    localStorage.setItem('vottery_token_timestamp', Date.now().toString());
  }

  clearTokens() {
    localStorage.removeItem('vottery_access_token');
    localStorage.removeItem('vottery_refresh_token');
    localStorage.removeItem('vottery_token_expiry');
    localStorage.removeItem('vottery_token_timestamp');
    localStorage.removeItem('vottery_user_data');
  }

  isTokenExpired() {
    const timestamp = localStorage.getItem('vottery_token_timestamp');
    if (!timestamp) return true;
    
    // Check if token is older than 7 days
    const tokenAge = Date.now() - parseInt(timestamp);
    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
    
    return tokenAge >= maxAge;
  }

  // Refresh access token
  async refreshAccessToken() {
    if (this.refreshInProgress) {
      // Wait for ongoing refresh
      await new Promise(resolve => setTimeout(resolve, 100));
      return this.getTokens().accessToken;
    }

    try {
      this.refreshInProgress = true;
      
      const { refreshToken } = this.getTokens();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      // Always use the user management API for token refresh
      const refreshUrl = `${this.baseUrls.user}/api/auth/refresh`;
      
      const response = await fetch(refreshUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
          // REMOVED X-Referrer header to fix CORS
        },
        body: JSON.stringify({ refreshToken })
      });

      if (!response.ok) {
        throw new Error(`Token refresh failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.accessToken && data.refreshToken) {
        this.setTokens(data.accessToken, data.refreshToken, data.tokenExpiry);
        return data.accessToken;
      }
      
      throw new Error('Invalid refresh response');
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.clearTokens();
      
      // Redirect to login or emit logout event
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('auth:logout', { 
          detail: { reason: 'token_refresh_failed' } 
        }));
      }
      
      throw error;
    } finally {
      this.refreshInProgress = false;
    }
  }

  // Enhanced request method with automatic token refresh
  async request(endpoint, options = {}) {
    const isAbsolute = /^https?:\/\//i.test(endpoint);
    const url = isAbsolute ? endpoint : `${this.baseUrl}${endpoint}`;
    
    // Check cache for GET requests
    if ((!options.method || options.method === 'GET') && options.cacheTTL) {
      const cacheKey = `${url}_${JSON.stringify(options.body || {})}`;
      const cached = this.requestCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < (options.cacheTTL || this.CACHE_DURATION)) {
        return cached.data;
      }
    }

    let attempt = 0;
    const maxAttempts = this.maxRetryAttempts;

    while (attempt < maxAttempts) {
      try {
        const { accessToken } = this.getTokens();
        
        const config = {
          method: options.method || 'GET',
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
            // REMOVED X-Referrer header to fix CORS issue
            // Only add Content-Type for non-FormData requests
            ...(!(options.body instanceof FormData) && { 'Content-Type': 'application/json' }),
            ...(options.headers || {})
          },
          ...options
        };

        // Add Authorization header if token exists
        if (accessToken && !this.isTokenExpired() && !config.headers.Authorization) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }

        // Handle request body
        if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
          config.body = JSON.stringify(config.body);
        }

        const response = await fetch(url, config);
        
        // Handle 401 Unauthorized - try to refresh token
        if (response.status === 401 && attempt === 0) {
          try {
            await this.refreshAccessToken();
            attempt++;
            continue; // Retry with new token
            /* eslint-disable */
          } catch (refreshError) {
            throw new Error('Authentication failed - please log in again');
          }
        }

        let data;
        try {
          data = await response.json();
        } catch {
          data = { success: false, message: 'Invalid response format' };
        }

        if (!response.ok) {
          // Handle rate limiting
          if (response.status === 429) {
            const cacheKey = `${url}_${JSON.stringify(options.body || {})}`;
            const cached = this.requestCache.get(cacheKey);
            if (cached) {
              return cached.data;
            }
          }
          
          const error = new Error(data?.message || `HTTP error! status: ${response.status}`);
          error.status = response.status;
          error.response = { data };
          throw error;
        }

        // Cache successful GET responses
        if ((!options.method || options.method === 'GET') && options.cacheTTL) {
          const cacheKey = `${url}_${JSON.stringify(options.body || {})}`;
          this.requestCache.set(cacheKey, { 
            data, 
            timestamp: Date.now() 
          });
          
          // Clean old cache entries
          setTimeout(() => {
            for (const [key, value] of this.requestCache.entries()) {
              if (Date.now() - value.timestamp > this.CACHE_DURATION * 2) {
                this.requestCache.delete(key);
              }
            }
          }, this.CACHE_DURATION);
        }

        return data;
      } catch (error) {
        attempt++;
        
        if (attempt >= maxAttempts) {
          console.error(`API request failed after ${maxAttempts} attempts for ${url}:`, error);
          
          if (error.status === 401) {
            throw new Error('Authentication required - please log in again');
          }
          
          if (error.response) throw error;
          throw new Error('Network error. Please check your connection and try again.');
        }
        
        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
  }

  // HTTP method helpers
  async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  async post(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'POST', body });
  }

  async put(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'PUT', body });
  }

  async patch(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'PATCH', body });
  }

  async delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }

  // Clear request cache
  clearCache() {
    this.requestCache.clear();
  }
}

export { BaseService };
// //token management
// // BaseService.js - Enhanced with token management and automatic refresh
// class BaseService {
//   constructor(serviceType = 'default') {
//     this.serviceType = serviceType;
    
//     // API base URLs mapping
//     this.baseUrls = {
//       auth: import.meta.env?.VITE_API_BASE_URL || 'http://localhost:3001',
//       biometric: import.meta.env?.VITE_BIOMETRIC_API_BASE_URL || 'http://localhost:3002', 
//       user: import.meta.env?.VITE_USER_MANAGEMENT_API_BASE_URL || 'http://localhost:3003',
//       default: import.meta.env?.VITE_ELECTION_API_BASE_URL || 'http://localhost:3004'
//     };
    
//     this.baseUrl = this.baseUrls[serviceType] || this.baseUrls.default;
    
//     // Request cache for deduplication
//     this.requestCache = new Map();
//     this.CACHE_DURATION = 30000; // 30 seconds
    
//     // Track refresh attempts to prevent infinite loops
//     this.refreshInProgress = false;
//     this.maxRetryAttempts = 3;
//   }

//   // Token management utilities
//   getTokens() {
//     return {
//       accessToken: localStorage.getItem('vottery_access_token'),
//       refreshToken: localStorage.getItem('vottery_refresh_token'),
//       tokenExpiry: localStorage.getItem('vottery_token_expiry'),
//       tokenTimestamp: localStorage.getItem('vottery_token_timestamp')
//     };
//   }

//   setTokens(accessToken, refreshToken, expiryInfo) {
//     localStorage.setItem('vottery_access_token', accessToken);
//     localStorage.setItem('vottery_refresh_token', refreshToken);
//     localStorage.setItem('vottery_token_expiry', JSON.stringify(expiryInfo));
//     localStorage.setItem('vottery_token_timestamp', Date.now().toString());
//   }

//   clearTokens() {
//     localStorage.removeItem('vottery_access_token');
//     localStorage.removeItem('vottery_refresh_token');
//     localStorage.removeItem('vottery_token_expiry');
//     localStorage.removeItem('vottery_token_timestamp');
//     localStorage.removeItem('vottery_user_data');
//   }

//   isTokenExpired() {
//     const timestamp = localStorage.getItem('vottery_token_timestamp');
//     if (!timestamp) return true;
    
//     // Check if token is older than 7 days
//     const tokenAge = Date.now() - parseInt(timestamp);
//     const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
    
//     return tokenAge >= maxAge;
//   }

//   // Refresh access token
//   async refreshAccessToken() {
//     if (this.refreshInProgress) {
//       // Wait for ongoing refresh
//       await new Promise(resolve => setTimeout(resolve, 100));
//       return this.getTokens().accessToken;
//     }

//     try {
//       this.refreshInProgress = true;
      
//       const { refreshToken } = this.getTokens();
//       if (!refreshToken) {
//         throw new Error('No refresh token available');
//       }

//       // Always use the user management API for token refresh
//       const refreshUrl = `${this.baseUrls.user}/api/auth/refresh`;
      
//       const response = await fetch(refreshUrl, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'X-Requested-With': 'XMLHttpRequest'
//         },
//         body: JSON.stringify({ refreshToken })
//       });

//       if (!response.ok) {
//         throw new Error(`Token refresh failed: ${response.status}`);
//       }

//       const data = await response.json();
      
//       if (data.success && data.accessToken && data.refreshToken) {
//         this.setTokens(data.accessToken, data.refreshToken, data.tokenExpiry);
//         return data.accessToken;
//       }
      
//       throw new Error('Invalid refresh response');
//     } catch (error) {
//       console.error('Token refresh failed:', error);
//       this.clearTokens();
      
//       // Redirect to login or emit logout event
//       if (typeof window !== 'undefined') {
//         window.dispatchEvent(new CustomEvent('auth:logout', { 
//           detail: { reason: 'token_refresh_failed' } 
//         }));
//       }
      
//       throw error;
//     } finally {
//       this.refreshInProgress = false;
//     }
//   }

//   // Enhanced request method with automatic token refresh
//   async request(endpoint, options = {}) {
//     const isAbsolute = /^https?:\/\//i.test(endpoint);
//     const url = isAbsolute ? endpoint : `${this.baseUrl}${endpoint}`;
    
//     // Check cache for GET requests
//     if ((!options.method || options.method === 'GET') && options.cacheTTL) {
//       const cacheKey = `${url}_${JSON.stringify(options.body || {})}`;
//       const cached = this.requestCache.get(cacheKey);
//       if (cached && Date.now() - cached.timestamp < (options.cacheTTL || this.CACHE_DURATION)) {
//         return cached.data;
//       }
//     }

//     let attempt = 0;
//     const maxAttempts = this.maxRetryAttempts;

//     while (attempt < maxAttempts) {
//       try {
//         const { accessToken } = this.getTokens();
        
//         const config = {
//           method: options.method || 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//             'X-Requested-With': 'XMLHttpRequest',
//             'X-Referrer': typeof document !== 'undefined' ? document.referrer : '',
//             ...(options.headers || {})
//           },
//           ...options
//         };

//         // Add Authorization header if token exists
//         if (accessToken && !this.isTokenExpired() && !config.headers.Authorization) {
//           config.headers.Authorization = `Bearer ${accessToken}`;
//         }

//         // Handle request body
//         if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
//           config.body = JSON.stringify(config.body);
//         }

//         const response = await fetch(url, config);
        
//         // Handle 401 Unauthorized - try to refresh token
//         if (response.status === 401 && attempt === 0) {
//           try {
//             await this.refreshAccessToken();
//             attempt++;
//             continue; // Retry with new token
//             /* eslint-disable */
//           } catch (refreshError) {
//             throw new Error('Authentication failed - please log in again');
//           }
//         }

//         let data;
//         try {
//           data = await response.json();
//         } catch {
//           data = { success: false, message: 'Invalid response format' };
//         }

//         if (!response.ok) {
//           // Handle rate limiting
//           if (response.status === 429) {
//             const cacheKey = `${url}_${JSON.stringify(options.body || {})}`;
//             const cached = this.requestCache.get(cacheKey);
//             if (cached) {
//               return cached.data;
//             }
//           }
          
//           const error = new Error(data?.message || `HTTP error! status: ${response.status}`);
//           error.status = response.status;
//           error.response = { data };
//           throw error;
//         }

//         // Cache successful GET responses
//         if ((!options.method || options.method === 'GET') && options.cacheTTL) {
//           const cacheKey = `${url}_${JSON.stringify(options.body || {})}`;
//           this.requestCache.set(cacheKey, { 
//             data, 
//             timestamp: Date.now() 
//           });
          
//           // Clean old cache entries
//           setTimeout(() => {
//             for (const [key, value] of this.requestCache.entries()) {
//               if (Date.now() - value.timestamp > this.CACHE_DURATION * 2) {
//                 this.requestCache.delete(key);
//               }
//             }
//           }, this.CACHE_DURATION);
//         }

//         return data;
//       } catch (error) {
//         attempt++;
        
//         if (attempt >= maxAttempts) {
//           console.error(`API request failed after ${maxAttempts} attempts for ${url}:`, error);
          
//           if (error.status === 401) {
//             throw new Error('Authentication required - please log in again');
//           }
          
//           if (error.response) throw error;
//           throw new Error('Network error. Please check your connection and try again.');
//         }
        
//         // Wait before retry (exponential backoff)
//         await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
//       }
//     }
//   }

//   // HTTP method helpers
//   async get(endpoint, options = {}) {
//     return this.request(endpoint, { ...options, method: 'GET' });
//   }

//   async post(endpoint, body, options = {}) {
//     return this.request(endpoint, { ...options, method: 'POST', body });
//   }

//   async put(endpoint, body, options = {}) {
//     return this.request(endpoint, { ...options, method: 'PUT', body });
//   }

//   async patch(endpoint, body, options = {}) {
//     return this.request(endpoint, { ...options, method: 'PATCH', body });
//   }

//   async delete(endpoint, options = {}) {
//     return this.request(endpoint, { ...options, method: 'DELETE' });
//   }

//   // Clear request cache
//   clearCache() {
//     this.requestCache.clear();
//   }
// }

// export { BaseService };
