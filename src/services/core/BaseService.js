//token management
// BaseService.js - Enhanced with token management and automatic refresh
class BaseService {
  constructor(serviceType = 'default') {
    this.serviceType = serviceType;
    
    // API base URLs mapping
    this.baseUrls = {
      auth: import.meta.env?.VITE_API_BASE_URL || 'http://localhost:3001',
      biometric: import.meta.env?.VITE_BIOMETRIC_API_BASE_URL || 'http://localhost:3002', 
      user: import.meta.env?.VITE_USER_MANAGEMENT_API_BASE_URL || 'http://localhost:3003',
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
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-Referrer': typeof document !== 'undefined' ? document.referrer : '',
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
// // ========================================
// // 2. SERVICE BASE CLASS (services/core/BaseService.js)
// // ========================================

// import { apiClient } from './apiClient.js';

// export class BaseService {
//   constructor(serviceName) {
//     this.serviceName = serviceName;
//     this.client = apiClient;
//   }

//   // Standard CRUD operations
//   async get(endpoint, options = {}) {
//     return this.client.request(this.serviceName, endpoint, {
//       method: 'GET',
//       ...options
//     });
//   }

//   async post(endpoint, data, options = {}) {
//     return this.client.request(this.serviceName, endpoint, {
//       method: 'POST',
//       body: data,
//       ...options
//     });
//   }

//   async put(endpoint, data, options = {}) {
//     return this.client.request(this.serviceName, endpoint, {
//       method: 'PUT',
//       body: data,
//       ...options
//     });
//   }

//   async patch(endpoint, data, options = {}) {
//     return this.client.request(this.serviceName, endpoint, {
//       method: 'PATCH',
//       body: data,
//       ...options
//     });
//   }

//   async delete(endpoint, options = {}) {
//     return this.client.request(this.serviceName, endpoint, {
//       method: 'DELETE',
//       ...options
//     });
//   }

//   // Paginated requests
//   async getPaginated(endpoint, page = 1, limit = 20, options = {}) {
//     const params = new URLSearchParams({
//       page: page.toString(),
//       limit: limit.toString(),
//       ...(options.filters || {})
//     });
    
//     return this.get(`${endpoint}?${params}`, options);
//   }

//   // Role-based method wrapper (decorator)
//   requiresPermission(permission) {
//     return (target, propertyName, descriptor) => {
//       const method = descriptor.value;
//       descriptor.value = async function(...args) {
//         const hasPermission = this.checkPermission(permission);
//         if (!hasPermission) {
//           throw new Error(`Insufficient permissions: ${permission} required`);
//         }
//         return method.apply(this, args);
//       };
//     };
//   }

//   // Permission checker
//   checkPermission(permission) {
//     const userData = JSON.parse(localStorage.getItem('vottery_user_data') || '{}');
//     const adminRole = userData.admin_role || 'user';
    
//     const rolePermissions = {
//       manager: [
//         'manage_users', 'manage_elections', 'view_analytics', 
//         'manage_content', 'view_audit', 'manage_ads', 'super_admin',
//         'manage_subscriptions', 'manage_payments', 'system_config'
//       ],
//       admin: [
//         'manage_users', 'manage_elections', 'view_analytics', 
//         'manage_content', 'view_audit', 'manage_ads', 'super_admin',
//         'manage_subscriptions', 'manage_payments'
//       ],
//       moderator: ['manage_elections', 'manage_content', 'view_analytics'],
//       auditor: ['view_audit', 'view_analytics', 'audit_elections'],
//       editor: ['manage_content', 'edit_elections'],
//       advertiser: ['manage_ads', 'view_analytics', 'campaign_management'],
//       analyst: ['view_analytics', 'export_data', 'generate_reports']
//     };
    
//     return rolePermissions[adminRole]?.includes(permission) || false;
//   }

//   // Bulk operations helper
//   async bulkOperation(endpoint, operations, options = {}) {
//     return this.post(endpoint, { operations }, options);
//   }

//   // Search helper
//   async search(endpoint, query, filters = {}, options = {}) {
//     const searchParams = {
//       query,
//       ...filters
//     };
    
//     return this.post(`${endpoint}/search`, searchParams, options);
//   }

//   // File upload helper
//   async uploadFile(endpoint, file, additionalData = {}, options = {}) {
//     const formData = new FormData();
//     formData.append('file', file);
    
//     // Add additional data to form
//     Object.keys(additionalData).forEach(key => {
//       formData.append(key, additionalData[key]);
//     });

//     return this.client.request(this.serviceName, endpoint, {
//       method: 'POST',
//       body: formData,
//       headers: {
//         // Don't set Content-Type for FormData - browser sets it with boundary
//         ...this.client.getAuthHeaders(),
//         'Content-Type': undefined
//       },
//       ...options
//     });
//   }

//   // Export helper
//   async exportData(endpoint, filters = {}, format = 'csv', options = {}) {
//     return this.post(`${endpoint}/export`, { 
//       filters, 
//       format 
//     }, {
//       ...options,
//       responseType: 'blob' // For file downloads
//     });
//   }

//   // Aggregation helper
//   async getAggregatedData(endpoint, aggregations = {}, options = {}) {
//     return this.post(`${endpoint}/aggregate`, aggregations, options);
//   }

//   // Health check for service
//   async healthCheck() {
//     try {
//       return await this.get('/health', { 
//         skipCache: true,
//         timeout: 5000 
//       });
//     } catch (error) {
//       return { 
//         status: 'error', 
//         service: this.serviceName, 
//         error: error.message 
//       };
//     }
//   }

//   // Utility methods for common patterns
  
//   // Soft delete (if supported)
//   async softDelete(endpoint, options = {}) {
//     return this.patch(endpoint, { deleted: true }, options);
//   }

//   // Restore soft deleted item
//   async restore(endpoint, options = {}) {
//     return this.patch(endpoint, { deleted: false }, options);
//   }

//   // Toggle active status
//   async toggleStatus(endpoint, options = {}) {
//     return this.patch(`${endpoint}/toggle-status`, {}, options);
//   }

//   // Get statistics/metrics
//   async getStats(endpoint, timeRange = '30d', options = {}) {
//     return this.get(`${endpoint}/stats?range=${timeRange}`, options);
//   }

//   // Batch get by IDs
//   async getByIds(endpoint, ids, options = {}) {
//     return this.post(`${endpoint}/batch`, { ids }, options);
//   }

//   // Rate limiting helper
//   async withRateLimit(fn, retryCount = 3) {
//     try {
//       return await fn();
//     } catch (error) {
//       if (error.status === 429 && retryCount > 0) {
//         // Extract retry-after header or use default delay
//         const retryAfter = error.response?.headers?.['retry-after'] || 1;
//         await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
//         return this.withRateLimit(fn, retryCount - 1);
//       }
//       throw error;
//     }
//   }

//   // Cache management for this service
//   clearServiceCache() {
//     this.client.clearCache(this.serviceName);
//   }

//   // Validation helper
//   validateRequiredFields(data, requiredFields) {
//     const missing = requiredFields.filter(field => !data[field]);
//     if (missing.length > 0) {
//       throw new Error(`Missing required fields: ${missing.join(', ')}`);
//     }
//   }

//   // Transform response data
//   transformResponse(data, transformer) {
//     if (typeof transformer === 'function') {
//       return transformer(data);
//     }
//     return data;
//   }

//   // Error handling wrapper
//   async withErrorHandling(operation, errorHandler) {
//     try {
//       return await operation();
//     } catch (error) {
//       if (errorHandler) {
//         return errorHandler(error);
//       }
//       throw error;
//     }
//   }
// }

// export default BaseService;