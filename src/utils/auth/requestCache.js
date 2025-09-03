const requestCache = new Map();
const CACHE_DURATION = 30000; // 30 seconds

export const RequestCache = {
  get: (key) => {
    const cached = requestCache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
    return null;
  },

  set: (key, data) => {
    requestCache.set(key, { data, timestamp: Date.now() });
  },

  clear: () => {
    requestCache.clear();
  },

  createCacheKey: (url, body) => {
    return `${url}_${JSON.stringify(body || {})}`;
  }
};