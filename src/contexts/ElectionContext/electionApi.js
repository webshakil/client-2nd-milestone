// services/election/electionApi.js
import { BaseService } from '../core/BaseService.js';

class ElectionApiService extends BaseService {
  constructor() {
    super('election'); // This will use the election base URL from your BaseService
  }

  /**
   * Create a new election
   * @param {Object} electionData - Election data to create
   * @param {Array} files - Optional files to upload
   * @returns {Promise} API response
   */
  async createElection(electionData, files = []) {
    try {
      console.log('Creating election with data:', electionData);
      
      // If files are present, use FormData
      if (files && files.length > 0) {
        const formData = new FormData();
        
        // Append election data as JSON string
        formData.append('electionData', JSON.stringify(electionData));
        
        // Append files
        files.forEach((file, index) => {
          if (file.file) {
            formData.append(`file_${index}`, file.file, file.file.name);
            formData.append(`fileType_${index}`, file.type || 'document');
          }
        });

        // Use BaseService request with FormData (will handle auth automatically)
        const response = await this.request('/api/elections/create', {
          method: 'POST',
          body: formData,
          headers: {} // Let browser set Content-Type for FormData, BaseService will add auth headers
        });

        console.log('Election creation response:', response);
        return response;
      } else {
        // Use BaseService request with JSON (will handle auth automatically)
        const response = await this.request('/api/elections/create', {
          method: 'POST',
          body: electionData
        });

        console.log('Election creation response:', response);
        return response;
      }
    } catch (error) {
      console.error('Error creating election:', error);
      throw new Error(error.message || 'Failed to create election');
    }
  }

  /**
   * Update an existing election
   * @param {string} electionId - ID of election to update
   * @param {Object} electionData - Updated election data
   * @param {Array} files - Optional files to upload
   * @returns {Promise} API response
   */
  async updateElection(electionId, electionData, files = []) {
    try {
      console.log('Updating election with ID:', electionId, 'Data:', electionData);
      
      // If files are present, use FormData
      if (files && files.length > 0) {
        const formData = new FormData();
        
        // Append election data as JSON string
        formData.append('electionData', JSON.stringify(electionData));
        
        // Append files
        files.forEach((file, index) => {
          if (file.file) {
            formData.append(`file_${index}`, file.file, file.file.name);
            formData.append(`fileType_${index}`, file.type || 'document');
          }
        });

        // Use BaseService request with FormData
        const response = await this.request(`/api/election/update/${electionId}`, {
          method: 'PUT',
          body: formData,
          headers: {} // Let browser set Content-Type for FormData
        });

        console.log('Election update response:', response);
        return response;
      } else {
        // Use BaseService request with JSON
        const response = await this.request(`/api/election/update/${electionId}`, {
          method: 'PUT',
          body: electionData
        });

        console.log('Election update response:', response);
        return response;
      }
    } catch (error) {
      console.error('Error updating election:', error);
      throw new Error(error.message || 'Failed to update election');
    }
  }

  /**
   * Get election by ID
   * @param {string} electionId - Election ID
   * @returns {Promise} API response
   */
  async getElection(electionId) {
    try {
      const response = await this.get(`/api/election/${electionId}`);
      return response;
    } catch (error) {
      console.error('Error fetching election:', error);
      throw new Error(error.message || 'Failed to fetch election');
    }
  }

  /**
   * Get elections list with filters
   * @param {Object} filters - Query filters
   * @returns {Promise} API response
   */
  async getElections(filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const endpoint = queryParams ? `/api/elections?${queryParams}` : '/api/elections';
      
      const response = await this.get(endpoint);
      return response;
    } catch (error) {
      console.error('Error fetching elections:', error);
      throw new Error(error.message || 'Failed to fetch elections');
    }
  }

  /**
   * Delete an election
   * @param {string} electionId - Election ID
   * @returns {Promise} API response
   */
  async deleteElection(electionId) {
    try {
      const response = await this.delete(`/api/election/delete/${electionId}`);
      return response;
    } catch (error) {
      console.error('Error deleting election:', error);
      throw new Error(error.message || 'Failed to delete election');
    }
  }

  /**
   * Publish an election
   * @param {string} electionId - Election ID
   * @returns {Promise} API response
   */
  async publishElection(electionId) {
    try {
      const response = await this.patch(`/api/election/publish/${electionId}`, {});
      return response;
    } catch (error) {
      console.error('Error publishing election:', error);
      throw new Error(error.message || 'Failed to publish election');
    }
  }

  /**
   * Save election as draft
   * @param {string} electionId - Election ID
   * @returns {Promise} API response
   */
  async saveDraft(electionId) {
    try {
      const response = await this.patch(`/api/election/draft/${electionId}`, {});
      return response;
    } catch (error) {
      console.error('Error saving draft:', error);
      throw new Error(error.message || 'Failed to save draft');
    }
  }
}

// Export singleton instance
export const electionApi = new ElectionApiService();
export default electionApi;