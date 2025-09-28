//role checking problem solved
// ========================================
// UPDATED API CLIENT (services/core/apiClient.js)
// ========================================
// Added election service mapping

class ApiClient {
  constructor() {
    this.baseURLs = {
      auth: import.meta.env?.VITE_API_BASE_URL || 'http://localhost:3001',
      biometric: import.meta.env?.VITE_BIOMETRIC_API_BASE_URL || 'http://localhost:3002',
      user: import.meta.env?.VITE_USER_MANAGEMENT_API_BASE_URL || 'http://localhost:3003',
      election: import.meta.env?.VITE_ELECTION_API_BASE_URL || 'http://localhost:3004', // Added this line
      votingengineqa: import.meta.env?.VITE__VOTING_ENGINE_BASE_URL || 'http://localhost:3005',
      fraud: import.meta.env?.VITE_FRAUD_API_URL || 'http://localhost:3008',
      crypto: import.meta.env?.VITE_API_URL_CRYPTOGRAPHIC_VOTING || 'http://localhost:4000',
      content: import.meta.env?.VITE_CONTENT_API_BASE_URL || 'http://localhost:8000',
      audit: import.meta.env?.VITE_AUDIT_API_BASE_URL || 'http://localhost:3009',
      campaign: import.meta.env?.VITE_CAMPAIGN_API_BASE_URL || 'http://localhost:3010'
    };
    
    this.cache = new Map();
    this.requestQueue = new Map();
    this.retryConfig = {
      maxRetries: 3,
      retryDelay: 1000,
      backoffMultiplier: 2
    };
  }

  // Headers with user ID from localStorage (no token needed)
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'X-Referrer': typeof document !== 'undefined' ? document.referrer : ''
    };

    // Get user ID from localStorage for authentication
    try {
      const userData = localStorage.getItem('vottery_user_data');
      if (userData) {
        const user = JSON.parse(userData);
        if (user.id) {
          headers['x-user-id'] = user.id.toString();
        }
      }
    } catch (error) {
      console.error('Error reading user data from localStorage:', error);
    }

    return headers;
  }

  // Request deduplication
  generateRequestKey(service, endpoint, options = {}) {
    const method = options.method || 'GET';
    const body = options.body ? JSON.stringify(options.body) : '';
    return `${service}_${endpoint}_${method}_${body}`;
  }

  // Cache management
  getCachedResponse(key, ttl = 30000) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < ttl) {
      return cached.data;
    }
    return null;
  }

  setCachedResponse(key, data) {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  // Retry mechanism with exponential backoff
  async retryRequest(fn, retries = 0) {
    try {
      return await fn();
    } catch (error) {
      if (retries < this.retryConfig.maxRetries && this.shouldRetry(error)) {
        const delay = this.retryConfig.retryDelay * Math.pow(this.retryConfig.backoffMultiplier, retries);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.retryRequest(fn, retries + 1);
      }
      throw error;
    }
  }

  shouldRetry(error) {
    // Only retry on server errors or network issues, not auth errors
    return error.status >= 500 || error.status === 429 || !error.status;
  }

  // Core request method - simplified without token handling
  async request(service, endpoint, options = {}) {
    const requestKey = this.generateRequestKey(service, endpoint, options);
    
    // Check for ongoing identical request
    if (this.requestQueue.has(requestKey)) {
      return this.requestQueue.get(requestKey);
    }

    // Check cache for GET requests
    if ((!options.method || options.method === 'GET') && !options.skipCache) {
      const cached = this.getCachedResponse(requestKey, options.cacheTTL);
      if (cached) return cached;
    }

    const requestPromise = this.retryRequest(async () => {
      const baseURL = this.baseURLs[service];
      if (!baseURL) throw new Error(`Unknown service: ${service}`);

      const url = endpoint.startsWith('http') ? endpoint : `${baseURL}${endpoint}`;
      
      const config = {
        method: options.method || 'POST',
        headers: {
          ...this.getHeaders(),
          ...(options.headers || {})
        },
        ...options
      };

      if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
        config.body = JSON.stringify(config.body);
      }

      console.log(`Making request to: ${url}`, config);

      const response = await fetch(url, config);
      
      let data;
      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (!response.ok) {
        const error = new Error(data?.message || `HTTP ${response.status}: ${response.statusText}`);
        error.status = response.status;
        error.data = data;
        console.error('API Request failed:', {
          url,
          status: response.status,
          statusText: response.statusText,
          data
        });
        throw error;
      }

      // Cache successful GET responses
      if ((!options.method || options.method === 'GET') && !options.skipCache) {
        this.setCachedResponse(requestKey, data);
      }

      return data;
    });

    // Store in request queue
    this.requestQueue.set(requestKey, requestPromise);
    
    try {
      const result = await requestPromise;
      return result;
    } finally {
      this.requestQueue.delete(requestKey);
    }
  }

  // Batch requests
  async batchRequest(requests) {
    return Promise.allSettled(
      requests.map(({ service, endpoint, options }) => 
        this.request(service, endpoint, options)
      )
    );
  }

  // Clear cache
  clearCache(pattern) {
    if (pattern) {
      for (const key of this.cache.keys()) {
        if (key.includes(pattern)) {
          this.cache.delete(key);
        }
      }
    } else {
      this.cache.clear();
    }
  }
}

// Singleton instance
export const apiClient = new ApiClient();
// //this is the last workable code. if any error just retrive it
// //role checking problem solved
// // ========================================
// // SIMPLIFIED API CLIENT (services/core/apiClient.js)
// // ========================================
// // Removed all token handling since backend handles auth via API gateway

// class ApiClient {
//   constructor() {
//     this.baseURLs = {
//       auth: import.meta.env?.VITE_API_BASE_URL || 'http://localhost:3001',
//       biometric: import.meta.env?.VITE_BIOMETRIC_API_BASE_URL || 'http://localhost:3002',
//       user: import.meta.env?.VITE_USER_MANAGEMENT_API_BASE_URL || 'http://localhost:3003',
//       election: import.meta.env?.VITE_ELECTION_API_BASE_URL || 'http://localhost:3004',
//      votingengineqa:import.meta.env?.VITE__VOTING_ENGINE_BASE_URL || 'http://localhost:3005',
//       fraud: import.meta.env?.VITE_FRAUD_API_URL || 'http://localhost:3008',
//       crypto: import.meta.env?.VITE_API_URL_CRYPTOGRAPHIC_VOTING || 'http://localhost:4000',
//       content: import.meta.env?.VITE_CONTENT_API_BASE_URL || 'http://localhost:8000',
//       audit: import.meta.env?.VITE_AUDIT_API_BASE_URL || 'http://localhost:3009',
//       campaign: import.meta.env?.VITE_CAMPAIGN_API_BASE_URL || 'http://localhost:3010'
//     };
    
//     this.cache = new Map();
//     this.requestQueue = new Map();
//     this.retryConfig = {
//       maxRetries: 3,
//       retryDelay: 1000,
//       backoffMultiplier: 2
//     };
//   }

//   // Headers with user ID from localStorage (no token needed)
//   getHeaders() {
//     const headers = {
//       'Content-Type': 'application/json',
//       'X-Requested-With': 'XMLHttpRequest',
//       'X-Referrer': typeof document !== 'undefined' ? document.referrer : ''
//     };

//     // Get user ID from localStorage for authentication
//     try {
//       const userData = localStorage.getItem('vottery_user_data');
//       if (userData) {
//         const user = JSON.parse(userData);
//         if (user.id) {
//           headers['x-user-id'] = user.id.toString();
//         }
//       }
//     } catch (error) {
//       console.error('Error reading user data from localStorage:', error);
//     }

//     return headers;
//   }

//   // Request deduplication
//   generateRequestKey(service, endpoint, options = {}) {
//     const method = options.method || 'GET';
//     const body = options.body ? JSON.stringify(options.body) : '';
//     return `${service}_${endpoint}_${method}_${body}`;
//   }

//   // Cache management
//   getCachedResponse(key, ttl = 30000) {
//     const cached = this.cache.get(key);
//     if (cached && Date.now() - cached.timestamp < ttl) {
//       return cached.data;
//     }
//     return null;
//   }

//   setCachedResponse(key, data) {
//     this.cache.set(key, { data, timestamp: Date.now() });
//   }

//   // Retry mechanism with exponential backoff
//   async retryRequest(fn, retries = 0) {
//     try {
//       return await fn();
//     } catch (error) {
//       if (retries < this.retryConfig.maxRetries && this.shouldRetry(error)) {
//         const delay = this.retryConfig.retryDelay * Math.pow(this.retryConfig.backoffMultiplier, retries);
//         await new Promise(resolve => setTimeout(resolve, delay));
//         return this.retryRequest(fn, retries + 1);
//       }
//       throw error;
//     }
//   }

//   shouldRetry(error) {
//     // Only retry on server errors or network issues, not auth errors
//     return error.status >= 500 || error.status === 429 || !error.status;
//   }

//   // Core request method - simplified without token handling
//   async request(service, endpoint, options = {}) {
//     const requestKey = this.generateRequestKey(service, endpoint, options);
    
//     // Check for ongoing identical request
//     if (this.requestQueue.has(requestKey)) {
//       return this.requestQueue.get(requestKey);
//     }

//     // Check cache for GET requests
//     if ((!options.method || options.method === 'GET') && !options.skipCache) {
//       const cached = this.getCachedResponse(requestKey, options.cacheTTL);
//       if (cached) return cached;
//     }

//     const requestPromise = this.retryRequest(async () => {
//       const baseURL = this.baseURLs[service];
//       if (!baseURL) throw new Error(`Unknown service: ${service}`);

//       const url = endpoint.startsWith('http') ? endpoint : `${baseURL}${endpoint}`;
      
//       const config = {
//         method: options.method || 'POST',
//         headers: {
//           ...this.getHeaders(),
//           ...(options.headers || {})
//         },
//         ...options
//       };

//       if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
//         config.body = JSON.stringify(config.body);
//       }

//       console.log(`Making request to: ${url}`, config);

//       const response = await fetch(url, config);
      
//       let data;
//       try {
//         data = await response.json();
//       } catch {
//         data = null;
//       }

//       if (!response.ok) {
//         const error = new Error(data?.message || `HTTP ${response.status}: ${response.statusText}`);
//         error.status = response.status;
//         error.data = data;
//         console.error('API Request failed:', {
//           url,
//           status: response.status,
//           statusText: response.statusText,
//           data
//         });
//         throw error;
//       }

//       // Cache successful GET responses
//       if ((!options.method || options.method === 'GET') && !options.skipCache) {
//         this.setCachedResponse(requestKey, data);
//       }

//       return data;
//     });

//     // Store in request queue
//     this.requestQueue.set(requestKey, requestPromise);
    
//     try {
//       const result = await requestPromise;
//       return result;
//     } finally {
//       this.requestQueue.delete(requestKey);
//     }
//   }

//   // Batch requests
//   async batchRequest(requests) {
//     return Promise.allSettled(
//       requests.map(({ service, endpoint, options }) => 
//         this.request(service, endpoint, options)
//       )
//     );
//   }

//   // Clear cache
//   clearCache(pattern) {
//     if (pattern) {
//       for (const key of this.cache.keys()) {
//         if (key.includes(pattern)) {
//           this.cache.delete(key);
//         }
//       }
//     } else {
//       this.cache.clear();
//     }
//   }
// }

// // Singleton instance
// export const apiClient = new ApiClient();
