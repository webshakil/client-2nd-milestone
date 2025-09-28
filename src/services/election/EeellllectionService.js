import { apiClient } from '../core/apiClient.js';

class EeellllectionService {
  constructor() {
    this.serviceName = 'election';
    this.baseEndpoint = '/api/elections';
    this.cache = new Map();
    this.uploadCache = new Map();
  }

  async createElection(electionData, files = {}) {
    try {
      console.log('Creating election with data:', electionData);
      const formData = new FormData();
      Object.keys(electionData).forEach(key => {
        const value = electionData[key];
        if (value !== null && value !== undefined) {
          if (typeof value === 'object') {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value.toString());
          }
        }
      });
      if (files.topicImage) {
        formData.append('topicImage', files.topicImage);
      }
      if (files.logoBranding) {
        formData.append('logoBranding', files.logoBranding);
      }
      if (files.questionImages && files.questionImages.length > 0) {
        /*eslint-disable*/
        files.questionImages.forEach((file, index) => {
          formData.append('questionImages', file);
        });
      }
      if (files.answerImages && files.answerImages.length > 0) {
        files.answerImages.forEach((file, index) => {
          formData.append('answerImages', file);
        });
      }
      const response = await apiClient.request(
        this.serviceName,
        `${this.baseEndpoint}/create`,
        {
          method: 'POST',
          body: formData,
          headers: {
            'X-Requested-With': 'XMLHttpRequest'
          },
          skipCache: true
        }
      );
      this.clearElectionCaches();
      return response;
    } catch (error) {
      console.error('Election creation failed:', error);
      throw this.handleElectionError(error, 'create');
    }
  }

  async getElection(electionId, options = {}) {
    try {
      const cacheKey = `election_${electionId}`;
      if (!options.skipCache) {
        const cached = this.cache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < 60000) {
          return cached.data;
        }
      }
      const response = await apiClient.request(
        this.serviceName,
        `${this.baseEndpoint}/${electionId}`,
        {
          method: 'GET',
          cacheTTL: options.cacheTTL || 60000
        }
      );
      this.cache.set(cacheKey, {
        data: response,
        timestamp: Date.now()
      });
      return response;
    } catch (error) {
      console.error('Get election failed:', error);
      throw this.handleElectionError(error, 'get');
    }
  }

  async getAllElections(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.status) queryParams.append('status', params.status);
      if (params.creatorId) queryParams.append('creatorId', params.creatorId);
      if (params.votingType) queryParams.append('votingType', params.votingType);
      if (params.isLotterized !== undefined) queryParams.append('isLotterized', params.isLotterized);
      if (params.search) queryParams.append('search', params.search);
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
      const endpoint = queryParams.toString() 
        ? `${this.baseEndpoint}?${queryParams.toString()}`
        : this.baseEndpoint;
      const response = await apiClient.request(
        this.serviceName,
        endpoint,
        {
          method: 'GET',
          cacheTTL: params.cacheTTL || 30000
        }
      );
      return response;
    } catch (error) {
      console.error('Get all elections failed:', error);
      throw this.handleElectionError(error, 'list');
    }
  }

  async updateElection(electionId, electionData, files = {}) {
    try {
      console.log('Updating election:', electionId, electionData);
      let body;
      let headers = {};
      if (Object.keys(files).length > 0) {
        const formData = new FormData();
        Object.keys(electionData).forEach(key => {
          const value = electionData[key];
          if (value !== null && value !== undefined) {
            if (typeof value === 'object') {
              formData.append(key, JSON.stringify(value));
            } else {
              formData.append(key, value.toString());
            }
          }
        });
        Object.keys(files).forEach(fileKey => {
          if (files[fileKey]) {
            if (Array.isArray(files[fileKey])) {
              files[fileKey].forEach(file => {
                formData.append(fileKey, file);
              });
            } else {
              formData.append(fileKey, files[fileKey]);
            }
          }
        });
        body = formData;
      } else {
        body = electionData;
        headers['Content-Type'] = 'application/json';
      }
      const response = await apiClient.request(
        this.serviceName,
        `${this.baseEndpoint}/${electionId}`,
        {
          method: 'PUT',
          body,
          headers,
          skipCache: true
        }
      );
      this.clearElectionCaches();
      this.cache.delete(`election_${electionId}`);
      return response;
    } catch (error) {
      console.error('Election update failed:', error);
      throw this.handleElectionError(error, 'update');
    }
  }

  async deleteElection(electionId) {
    try {
      const response = await apiClient.request(
        this.serviceName,
        `${this.baseEndpoint}/${electionId}`,
        {
          method: 'DELETE',
          skipCache: true
        }
      );
      this.clearElectionCaches();
      this.cache.delete(`election_${electionId}`);
      return response;
    } catch (error) {
      console.error('Election deletion failed:', error);
      throw this.handleElectionError(error, 'delete');
    }
  }

  async getElectionAnalytics(electionId) {
    try {
      const response = await apiClient.request(
        this.serviceName,
        `${this.baseEndpoint}/${electionId}/analytics`,
        {
          method: 'GET',
          cacheTTL: 30000
        }
      );
      return response;
    } catch (error) {
      console.error('Get election analytics failed:', error);
      throw this.handleElectionError(error, 'analytics');
    }
  }

  async cloneElection(electionId, modifications = {}) {
    try {
      const response = await apiClient.request(
        this.serviceName,
        `${this.baseEndpoint}/${electionId}/clone`,
        {
          method: 'POST',
          body: modifications,
          skipCache: true
        }
      );
      this.clearElectionCaches();
      return response;
    } catch (error) {
      console.error('Election cloning failed:', error);
      throw this.handleElectionError(error, 'clone');
    }
  }

  async toggleElectionPublication(electionId, isPublished) {
    try {
      const response = await apiClient.request(
        this.serviceName,
        `${this.baseEndpoint}/${electionId}/publish`,
        {
          method: 'PATCH',
          body: { isPublished },
          skipCache: true
        }
      );
      this.clearElectionCaches();
      this.cache.delete(`election_${electionId}`);
      return response;
    } catch (error) {
      console.error('Election publication toggle failed:', error);
      throw this.handleElectionError(error, 'publish');
    }
  }

  async getUserElections(userId, params = {}) {
    try {
      return await this.getAllElections({
        ...params,
        creatorId: userId
      });
    } catch (error) {
      console.error('Get user elections failed:', error);
      throw this.handleElectionError(error, 'user_elections');
    }
  }

  async searchElections(searchTerm, filters = {}) {
    try {
      const params = {
        search: searchTerm,
        ...filters
      };
      return await this.getAllElections(params);
    } catch (error) {
      console.error('Election search failed:', error);
      throw this.handleElectionError(error, 'search');
    }
  }

  async getElectionsByStatus(status, params = {}) {
    try {
      return await this.getAllElections({
        ...params,
        status
      });
    } catch (error) {
      console.error('Get elections by status failed:', error);
      throw this.handleElectionError(error, 'status_filter');
    }
  }

  validateElectionData(electionData) {
    const errors = [];
    if (!electionData.title?.trim()) {
      errors.push('Election title is required');
    }
    if (!electionData.startDate?.date) {
      errors.push('Start date is required');
    }
    if (!electionData.endDate?.date) {
      errors.push('End date is required');
    }
    if (!electionData.votingType) {
      errors.push('Voting type is required');
    }
    if (!electionData.questions || !Array.isArray(electionData.questions) || electionData.questions.length === 0) {
      errors.push('At least one question is required');
    }
    if (electionData.startDate?.date && electionData.endDate?.date) {
      const startDate = new Date(electionData.startDate.date);
      const endDate = new Date(electionData.endDate.date);
      if (startDate >= endDate) {
        errors.push('End date must be after start date');
      }
    }
    if (electionData.questions) {
      electionData.questions.forEach((question, index) => {
        if (!question.questionText?.trim()) {
          errors.push(`Question ${index + 1}: Question text is required`);
        }
        if (!question.answers || !Array.isArray(question.answers) || question.answers.length < 2) {
          errors.push(`Question ${index + 1}: At least 2 answers are required`);
        }
        if (question.answers) {
          question.answers.forEach((answer, answerIndex) => {
            if (!answer.text?.trim()) {
              errors.push(`Question ${index + 1}, Answer ${answerIndex + 1}: Answer text is required`);
            }
          });
          }
      });
    }
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  validateFiles(files) {
    const errors = [];
    const maxSizes = {
      topicImage: 5 * 1024 * 1024,
      logoBranding: 2 * 1024 * 1024,
      questionImages: 3 * 1024 * 1024,
      answerImages: 2 * 1024 * 1024
    };
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    Object.keys(files).forEach(fileKey => {
      const file = files[fileKey];
      if (!file) return;
      const filesToCheck = Array.isArray(file) ? file : [file];
      filesToCheck.forEach((singleFile, index) => {
        const maxSize = maxSizes[fileKey] || 5 * 1024 * 1024;
        if (singleFile.size > maxSize) {
          errors.push(`${fileKey}${Array.isArray(file) ? `[${index}]` : ''}: File size exceeds ${maxSize / (1024 * 1024)}MB limit`);
        }
        if (!allowedTypes.includes(singleFile.type)) {
          errors.push(`${fileKey}${Array.isArray(file) ? `[${index}]` : ''}: Invalid file type. Only JPEG, PNG, and WebP are allowed`);
        }
      });
    });
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  handleElectionError(error, operation) {
    const errorMessage = error.message || 'An error occurred';
    const errorCode = error.status || 500;
    const userFriendlyMessages = {
      create: 'Failed to create election. Please check your data and try again.',
      update: 'Failed to update election. Please try again.',
      delete: 'Failed to delete election. Please try again.',
      get: 'Failed to load election details.',
      list: 'Failed to load elections list.',
      analytics: 'Failed to load election analytics.',
      clone: 'Failed to clone election.',
      publish: 'Failed to publish/unpublish election.',
      user_elections: 'Failed to load your elections.',
      search: 'Election search failed.',
      status_filter: 'Failed to filter elections by status.'
    };
    const enhancedError = new Error(userFriendlyMessages[operation] || errorMessage);
    enhancedError.originalError = error;
    enhancedError.status = errorCode;
    enhancedError.operation = operation;
    return enhancedError;
  }

  clearElectionCaches() {
    apiClient.clearCache('election_/api/elections');
    for (const key of this.cache.keys()) {
      if (key.startsWith('election_') || key.includes('elections')) {
        this.cache.delete(key);
      }
    }
  }

  getCacheStats() {
    return {
      cacheSize: this.cache.size,
      uploadCacheSize: this.uploadCache.size,
      cacheEntries: Array.from(this.cache.keys())
    };
  }

  clearAllCaches() {
    this.cache.clear();
    this.uploadCache.clear();
    apiClient.clearCache();
  }
}

export const eeelllectionService = new EeellllectionService();
export default eeelllectionService;
