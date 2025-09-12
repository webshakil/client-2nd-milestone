//proper token management
// userService.js - Enhanced with proper token management
import { BaseService } from '../core/BaseService.js';

class UserService extends BaseService {
  constructor() {
    super('user'); // This maps to your localhost:3003
  }

  // Get all users with pagination - matches your endpoint
  async getAllUsers(page = 1, limit = 10, filters = {}) {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...filters
      });
      
      return await this.get(`/api/users/all?${params}`, {
        cacheTTL: 30000 // Cache for 30 seconds
      });
    } catch (error) {
      console.error('Failed to fetch users:', error);
      
      // Return a structured error response for the UI
      return {
        success: false,
        message: error.message || 'Failed to fetch users',
        data: [],
        total: 0,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: 0
      };
    }
  }

  // Update user role - matches your PATCH endpoint
  async updateUserRole(userId, roleData) {
    try {
      const { adminRole, userType, subscriptionStatus } = roleData;
      
      const response = await this.patch(`/api/users/role/${userId}`, {
        user_type: userType,
        admin_role: adminRole,
        subscription_status: subscriptionStatus
      });
      
      // Clear relevant cache entries after update
      this.clearUserCaches(userId);
      
      return response;
    } catch (error) {
      console.error('Failed to update user role:', error);
      throw new Error(error.message || 'Failed to update user role');
    }
  }

  // Get user profile - enhanced with better error handling
  async getUserProfile(userId) {
    try {
      return await this.get(`/api/users/profile/${userId}`, {
        cacheTTL: 60000 // Cache profile for 1 minute
      });
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      throw new Error(error.message || 'Failed to fetch user profile');
    }
  }

  // Get single user by ID
  async getUserById(userId) {
    try {
      return await this.get(`/api/users/${userId}`, {
        cacheTTL: 30000
      });
    } catch (error) {
      console.error('Failed to fetch user:', error);
      throw new Error(error.message || 'Failed to fetch user');
    }
  }

  // Delete user
  async deleteUser(userId) {
    try {
      const response = await this.delete(`/api/users/${userId}`);
      
      // Clear all user-related cache entries after deletion
      this.clearUserCaches(userId);
      this.clearCache(); // Clear all cache to refresh lists
      
      return response;
    } catch (error) {
      console.error('Failed to delete user:', error);
      throw new Error(error.message || 'Failed to delete user');
    }
  }

  // Search users (if your backend supports it)
  async searchUsers(query, page = 1, limit = 10) {
    try {
      const params = new URLSearchParams({
        q: query,
        page: page.toString(),
        limit: limit.toString()
      });
      
      return await this.get(`/api/users/search?${params}`, {
        cacheTTL: 15000 // Shorter cache for search results
      });
    } catch (error) {
      console.error('Failed to search users:', error);
      
      // Return empty search results on error
      return {
        success: false,
        message: error.message || 'Search failed',
        data: [],
        total: 0,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: 0
      };
    }
  }

  // Get users by role filter
  async getUsersByRole(role, page = 1, limit = 10) {
    return this.getAllUsers(page, limit, { admin_role: role });
  }

  // Get users by type filter
  async getUsersByType(type, page = 1, limit = 10) {
    return this.getAllUsers(page, limit, { user_type: type });
  }

  // Get users by subscription status
  async getUsersBySubscription(status, page = 1, limit = 10) {
    return this.getAllUsers(page, limit, { subscription_status: status });
  }

  // Bulk update users (if needed)
  async bulkUpdateUsers(userUpdates) {
    try {
      const response = await this.post('/api/users/bulk-update', { updates: userUpdates });
      
      // Clear cache after bulk operations
      this.clearCache();
      
      return response;
    } catch (error) {
      console.error('Failed to bulk update users:', error);
      throw new Error(error.message || 'Failed to bulk update users');
    }
  }

  // Get user statistics
  async getUserStats() {
    try {
      return await this.get('/api/users/stats', {
        cacheTTL: 120000 // Cache stats for 2 minutes
      });
    } catch (error) {
      console.error('Failed to fetch user stats:', error);
      
      // Return empty stats on error
      return {
        success: false,
        message: error.message || 'Failed to fetch statistics',
        data: {
          totalUsers: 0,
          activeUsers: 0,
          newUsers: 0,
          roleDistribution: {},
          typeDistribution: {},
          subscriptionDistribution: {}
        }
      };
    }
  }

  // Create new user (for admin purposes)
  async createUser(userData) {
    try {
      const response = await this.post('/api/users/create', userData);
      
      // Clear cache to refresh user lists
      this.clearCache();
      
      return response;
    } catch (error) {
      console.error('Failed to create user:', error);
      throw new Error(error.message || 'Failed to create user');
    }
  }

  // Update user profile
  async updateUserProfile(userId, profileData) {
    try {
      const response = await this.patch(`/api/users/profile/${userId}`, profileData);
      
      // Clear user-specific caches
      this.clearUserCaches(userId);
      
      return response;
    } catch (error) {
      console.error('Failed to update user profile:', error);
      throw new Error(error.message || 'Failed to update user profile');
    }
  }

  // Activate/Deactivate user
  async toggleUserStatus(userId, isActive) {
    try {
      const response = await this.patch(`/api/users/${userId}/status`, { 
        is_active: isActive 
      });
      
      // Clear user-specific caches
      this.clearUserCaches(userId);
      
      return response;
    } catch (error) {
      console.error('Failed to toggle user status:', error);
      throw new Error(error.message || 'Failed to update user status');
    }
  }

  // Get user activity log
  async getUserActivity(userId, page = 1, limit = 20) {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });
      
      return await this.get(`/api/users/${userId}/activity?${params}`, {
        cacheTTL: 60000
      });
    } catch (error) {
      console.error('Failed to fetch user activity:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch activity',
        data: [],
        total: 0,
        page: parseInt(page),
        limit: parseInt(limit)
      };
    }
  }

  // Verify user email
  async verifyUserEmail(userId) {
    try {
      const response = await this.post(`/api/users/${userId}/verify-email`);
      
      // Clear user cache to refresh verification status
      this.clearUserCaches(userId);
      
      return response;
    } catch (error) {
      console.error('Failed to verify user email:', error);
      throw new Error(error.message || 'Failed to verify email');
    }
  }

  // Reset user password (admin function)
  async resetUserPassword(userId) {
    try {
      return await this.post(`/api/users/${userId}/reset-password`);
    } catch (error) {
      console.error('Failed to reset user password:', error);
      throw new Error(error.message || 'Failed to reset password');
    }
  }

  // Export users data
  async exportUsers(filters = {}, format = 'csv') {
    try {
      const params = new URLSearchParams({
        format,
        ...filters
      });
      
      return await this.get(`/api/users/export?${params}`);
    } catch (error) {
      console.error('Failed to export users:', error);
      throw new Error(error.message || 'Failed to export users');
    }
  }

  // Helper method to clear user-specific cache entries
  clearUserCaches(userId) {
    // Clear cache entries that might contain this user's data
    for (const [key] of this.requestCache.entries()) {
      if (key.includes(`/users/${userId}`) || 
          key.includes(`/users/profile/${userId}`) ||
          key.includes('/users/all')) {
        this.requestCache.delete(key);
      }
    }
  }

  // Get current user's own profile (uses token from localStorage)
  async getCurrentUserProfile() {
    try {
      return await this.get('/api/users/me', {
        cacheTTL: 60000
      });
    } catch (error) {
      console.error('Failed to fetch current user profile:', error);
      throw new Error(error.message || 'Failed to fetch profile');
    }
  }

  // Update current user's own profile
  async updateCurrentUserProfile(profileData) {
    try {
      const response = await this.patch('/api/users/me', profileData);
      
      // Clear current user cache
      this.requestCache.delete('/api/users/me');
      
      return response;
    } catch (error) {
      console.error('Failed to update current user profile:', error);
      throw new Error(error.message || 'Failed to update profile');
    }
  }
}

export const userService = new UserService();
// import { BaseService } from '../core/BaseService.js';

// class UserService extends BaseService {
//   constructor() {
//     super('user'); // This maps to your localhost:3003
//   }

//   // Get all users with pagination - matches your endpoint
//   async getAllUsers(page = 1, limit = 10, filters = {}) {
//     const params = new URLSearchParams({
//       page: page.toString(),
//       limit: limit.toString(),
//       ...filters
//     });
    
//     return this.get(`/api/users/all?${params}`, {
//       cacheTTL: 30000 // Cache for 30 seconds
//     });
//   }

//   // Update user role - matches your PATCH endpoint
//   async updateUserRole(userId, roleData) {
//     const { adminRole, userType, subscriptionStatus } = roleData;
    
//     return this.patch(`/api/users/role/${userId}`, {
//       user_type: userType,
//       admin_role: adminRole,
//       subscription_status: subscriptionStatus
//     });
//   }

//   // Get single user by ID
//   async getUserById(userId) {
//     return this.get(`/api/users/${userId}`);
//   }

//   // Delete user
//   async deleteUser(userId) {
//     return this.delete(`/api/users/${userId}`);
//   }

//   // Search users (if your backend supports it)
//   async searchUsers(query, page = 1, limit = 10) {
//     const params = new URLSearchParams({
//       q: query,
//       page: page.toString(),
//       limit: limit.toString()
//     });
    
//     return this.get(`/api/users/search?${params}`);
//   }

//   // Get users by role filter
//   async getUsersByRole(role, page = 1, limit = 10) {
//     return this.getAllUsers(page, limit, { admin_role: role });
//   }

//   // Get users by type filter
//   async getUsersByType(type, page = 1, limit = 10) {
//     return this.getAllUsers(page, limit, { user_type: type });
//   }

//   // Get users by subscription status
//   async getUsersBySubscription(status, page = 1, limit = 10) {
//     return this.getAllUsers(page, limit, { subscription_status: status });
//   }

//   // Bulk update users (if needed)
//   async bulkUpdateUsers(userUpdates) {
//     return this.post('/api/users/bulk-update', { updates: userUpdates });
//   }

//   // Get user statistics
//   async getUserStats() {
//     return this.get('/api/users/stats');
//   }
// }

// export const userService = new UserService();